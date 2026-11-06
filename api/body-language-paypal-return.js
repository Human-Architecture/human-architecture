const { ensureSchema, sql, paypalRequest, confirmBooking, sendConfirmationOnce } = require('../lib/body-language-booking');
const { clean, ensureSchema: ensureCodexSchema, getBookingForToken, saveIntake, captureReturn, requestBase } = require('../lib/codex-booking');

function redirect(res, path) { res.statusCode = 303; res.setHeader('Location', path); res.end(); }
function validCodexDate(value) { const date = new Date(`${value}T12:00:00Z`); return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value; }
function validCodexTime(value) { if (!/^\d{2}:\d{2}$/.test(value)) return false; const [hours, minutes] = value.split(':').map(Number); return hours < 24 && minutes < 60; }
function codexAccess(req) { return { booking: clean(req.method === 'GET' ? req.query?.booking : req.body?.booking, 80), token: clean(req.method === 'GET' ? req.query?.token : req.body?.token, 200) }; }
module.exports = async function handler(req, res) {
  if (req.query?.codex === 'return') {
    const bookingId = typeof req.query.booking === 'string' ? req.query.booking : '';
    const orderId = typeof req.query.token === 'string' ? req.query.token : '';
    if (!bookingId || !orderId) return redirect(res, '/codex/book/?payment=error');
    try {
      await ensureCodexSchema();
      await captureReturn({ bookingId, orderId, base: requestBase(req) });
      return redirect(res, '/codex/payment/confirmed/');
    } catch (error) { console.error('CODEX PayPal return failed', error); return redirect(res, '/codex/book/?payment=error'); }
  }
  if (req.query?.codex === 'intake') {
    if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return res.status(405).end(); }
    const { booking: bookingId, token } = codexAccess(req);
    try {
      await ensureCodexSchema();
      const booking = await getBookingForToken(bookingId, token);
      if (!booking || !['paid', 'intake_complete'].includes(booking.status)) return res.status(404).json({ error: 'This private intake link is not available.' });
      if (req.method === 'GET') return res.status(200).json({ ok: true, offerKey: booking.offer_key, submitted: Boolean(booking.intake_completed_at) });
      const birthDate = clean(req.body?.birthDate, 10);
      const birthPlace = clean(req.body?.birthPlace, 120);
      const birthTime = clean(req.body?.birthTime, 5);
      const birthTimeUnknown = req.body?.birthTimeUnknown === true;
      if (!validCodexDate(birthDate) || !birthPlace || (!birthTimeUnknown && !validCodexTime(birthTime)) || req.body?.dataConsent !== true) {
        return res.status(400).json({ error: 'Please complete your birth details, confirm a recorded time or that it is unknown, and accept the private-handling notice.' });
      }

      const intake = {
        birthDate,
        birthPlace,
        birthTime: birthTimeUnknown ? 'unknown' : birthTime,
        birthTimeKnown: !birthTimeUnknown,
        dataConsentedAt: new Date().toISOString()
      };

      if (booking.offer_key === 'current_sky') {
        const context = clean(req.body?.currentSkyContext, 120);
        const focus = clean(req.body?.currentSkyFocus, 500);
        const allowed = ['A current decision or turning point', 'A change in work, direction or responsibility', 'A relationship or relational pattern', 'A wider transition or period of change', 'Another present theme'];
        if (!allowed.includes(context) || !focus) return res.status(400).json({ error: 'Please choose what is most present and add a short focus for this reading.' });
        intake.currentSkyContext = context;
        intake.currentSkyFocus = focus;
      } else if (booking.offer_key === 'personal_pattern') {
        const theme = clean(req.body?.personalPatternTheme, 120);
        const question = clean(req.body?.personalPatternQuestion, 700);
        const allowed = ['Love & Relationships', 'Identity & Expression', 'Direction & Responsibility'];
        if (!allowed.includes(theme) || !question) return res.status(400).json({ error: 'Please select your chosen pattern and add a short question or context.' });
        intake.personalPatternTheme = theme;
        intake.personalPatternQuestion = question;
      } else if (booking.offer_key === 'astrological_foundations') {
        const focus = clean(req.body?.foundationsFocus, 120);
        const question = clean(req.body?.foundationsQuestion, 700);
        const allowed = ['Natal-chart foundations', 'Current transits in context', 'Both, as one connected picture'];
        if (!allowed.includes(focus) || !question) return res.status(400).json({ error: 'Please choose the reading focus and add a short question or context.' });
        intake.foundationsFocus = focus;
        intake.foundationsQuestion = question;
      } else if (booking.offer_key === 'codex_2027_entry') {
        const intention = clean(req.body?.annualIntention, 700);
        const context = clean(req.body?.annualContext, 500);
        if (!intention) return res.status(400).json({ error: 'Please add what you would like to meet more consciously in 2027.' });
        intake.annualIntention = intention;
        intake.annualContext = context;
      } else {
        return res.status(400).json({ error: 'This booking does not have a Codex intake form.' });
      }

      await saveIntake({ booking, intake });
      return res.status(201).json({ ok: true });
    } catch (error) { console.error('CODEX intake failed', error); return res.status(400).json({ error: error.message || 'Your intake could not be saved.' }); }
  }
  const bookingId = typeof req.query.booking === 'string' ? req.query.booking : '';
  const orderId = typeof req.query.token === 'string' ? req.query.token : '';
  if (!bookingId || !orderId) return redirect(res, '/body-language/book/?payment=error');
  try {
    await ensureSchema();
    const query = sql();
    const rows = await query`SELECT * FROM body_language_bookings WHERE id = ${bookingId}::uuid AND paypal_order_id = ${orderId}`;
    const booking = rows[0];
    if (!booking) return redirect(res, '/body-language/book/?payment=error');
    let order = await paypalRequest(`/v2/checkout/orders/${orderId}`);
    const unit = order.purchase_units?.[0];
    const expectedValue = (booking.amount_cents / 100).toFixed(2);
    if (
      unit?.custom_id !== bookingId ||
      unit?.amount?.currency_code !== 'EUR' ||
      unit?.amount?.value !== expectedValue
    ) return redirect(res, '/body-language/book/?payment=error');
    if (order.status === 'APPROVED') order = await paypalRequest(`/v2/checkout/orders/${orderId}/capture`, { method: 'POST', body: '{}' });
    const captureId = order.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    if (order.status !== 'COMPLETED' || !captureId) return redirect(res, '/body-language/book/?payment=error');
    const confirmed = await confirmBooking({ bookingId, paypalOrderId: orderId, paypalCaptureId: captureId });
    if (!confirmed) return redirect(res, `/body-language/book/?payment=full`);
    try { await sendConfirmationOnce(confirmed); } catch (error) { console.error('BODY LANGUAGE confirmation email retry needed', error); }
    return redirect(res, `/body-language/${confirmed.locale === 'en' ? 'en/' : ''}book/confirmed/`);
  } catch (error) {
    console.error('BODY LANGUAGE PayPal return failed', error);
    return redirect(res, '/body-language/book/?payment=error');
  }
};
