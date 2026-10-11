const { EVENT_KEY, CAPACITY, OPTIONS, sql, ensureSchema, clean, validEmail, array, option, requestBase, paypalRequest, crypto } = require('../lib/body-language-booking');

const message = (locale, de, en) => locale === 'en' ? en : de;
module.exports = async function handler(req, res) {
  const locale = req.body?.locale === 'en' ? 'en' : 'de';
  if (req.method === 'GET') {
    try {
      await ensureSchema();
      const query = sql();
      const rows = await query`SELECT COALESCE(SUM(seats) FILTER (WHERE status = 'confirmed'), 0)::int AS confirmed FROM body_language_bookings WHERE event_key = ${EVENT_KEY}`;
      return res.status(200).json({ capacity: CAPACITY, confirmed: rows[0].confirmed, remaining: Math.max(0, CAPACITY - rows[0].confirmed) });
    } catch (_) { return res.status(503).json({ message: 'Booking service unavailable' }); }
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ message: 'Method not allowed' }); }
  try {
    await ensureSchema();
    const body = req.body || {};
    const participantName = clean(body.name, 160);
    const email = clean(body.email, 180).toLowerCase();
    const selected = option(body.payment_option);
    const reasons = array(body.reasons); const areas = array(body.exploration_areas, 3);
    if (!participantName || !validEmail(email) || !selected || !reasons.length || !areas.length || areas.length > 3 || !clean(body.movement_context, 60)) return res.status(400).json({ message: message(locale, 'Bitte prüfe deine Angaben.', 'Please check your details.') });
    const bookingId = crypto.randomUUID();
    const intake = { reasons, reason_other: clean(body.reason_other), movement_context: clean(body.movement_context, 60), current_movement: clean(body.current_movement), exploration_areas: areas, adjustment: clean(body.adjustment, 60), adjustment_detail: clean(body.adjustment_detail), group_participation: clean(body.group_participation, 60), personal_focus: clean(body.personal_focus) };
    const query = sql();
    const reserved = await query`
      WITH locked AS (SELECT pg_advisory_xact_lock(hashtext(${EVENT_KEY}))),
      used AS (SELECT COALESCE(SUM(seats) FILTER (WHERE status = 'confirmed' OR (status = 'pending' AND reservation_expires_at > now())), 0)::int AS seats FROM body_language_bookings, locked WHERE event_key = ${EVENT_KEY})
      INSERT INTO body_language_bookings (id,event_key,locale,participant_name,email,phone,intake,payment_option,amount_cents,seats,status,reservation_expires_at)
      SELECT ${bookingId}::uuid,${EVENT_KEY},${locale},${participantName},${email},${clean(body.phone,80)},${JSON.stringify(intake)}::jsonb,${body.payment_option},${selected.cents},${selected.seats},'pending',now() + interval '20 minutes'
      FROM used WHERE used.seats + ${selected.seats} <= ${CAPACITY} RETURNING id`;
    if (!reserved[0]) return res.status(409).json({ message: message(locale, 'Dieser Workshop ist leider ausgebucht.', 'This workshop is now sold out.') });
    const base = requestBase(req);
    const order = await paypalRequest('/v2/checkout/orders', { method: 'POST', headers: { 'PayPal-Request-Id': bookingId }, body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ reference_id: bookingId, custom_id: bookingId, description: 'BODY LANGUAGE | KÖRPERSPRACHE · 28 November 2026', amount: { currency_code: 'EUR', value: (selected.cents / 100).toFixed(2) } }], application_context: { brand_name: 'Human Architecture', landing_page: 'LOGIN', user_action: 'PAY_NOW', return_url: `${base}/api/body-language-paypal-return?booking=${bookingId}`, cancel_url: `${base}/${locale === 'en' ? 'body-language/en/book/' : 'body-language/book/'}?payment=cancelled` } }) });
    const approvalUrl = order.links?.find(link => link.rel === 'approve')?.href;
    if (!approvalUrl) throw new Error('PayPal approval link unavailable');
    await query`UPDATE body_language_bookings SET paypal_order_id=${order.id},updated_at=now() WHERE id=${bookingId}`;
    return res.status(201).json({ bookingId, approvalUrl });
  } catch (error) {
    console.error('BODY LANGUAGE booking creation failed', error);
    return res.status(503).json({ message: message(locale, 'Die sichere Zahlung ist gerade nicht verfügbar. Bitte versuche es erneut oder kontaktiere uns.', 'Secure payment is not available right now. Please try again or contact us.') });
  }
};
