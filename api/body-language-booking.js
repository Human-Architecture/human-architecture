const { EVENT_KEY, CAPACITY, BOOKING_CLOSES_AT, OPTIONS, sql, ensureSchema, clean, validEmail, array, option, formatAmount, requestBase, paypalRequest, sendEmail, bookingNotificationText, crypto } = require('../lib/body-language-booking');
const { paymentEnabled, secureIntakeConfigured, ensureSchema: ensureCodexSchema, createBooking: createCodexBooking, offer: codexOffer } = require('../lib/codex-booking');

const message = (locale, de, en) => locale === 'en' ? en : de;
const MANUAL_PAYMENT_LINKS = Object.freeze({
  member_single: 'https://www.paypal.com/ncp/payment/922D49UUV5ERJ',
  member_pair: 'https://www.paypal.com/ncp/payment/TST9KXP2UAW92',
  non_member_single: 'https://www.paypal.com/ncp/payment/HQBWX8D68LUSL',
  member_plus_non_member: 'https://www.paypal.com/ncp/payment/X8Y68TRRR3W5A',
  non_member_pair: 'https://www.paypal.com/ncp/payment/DV5E9YUFTCRLG'
});
const validDate = value => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && date <= new Date();
};
module.exports = async function handler(req, res) {
  const locale = req.body?.locale === 'en' ? 'en' : 'de';
  if (req.method === 'GET') {
    if (req.query?.codex === 'status') {
      const available = paymentEnabled() && secureIntakeConfigured() && Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET && (process.env.HA_POSTGRES_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL));
      return res.status(200).json({ available });
    }
    return res.status(200).json({ available: true });
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ message: 'Method not allowed' }); }
  if (req.body?.codex_booking === true) {
    if (!paymentEnabled()) return res.status(503).json({ message: 'Direct booking is not open yet. Please contact us at hello@human-architecture.info.' });
    const name = clean(req.body?.name, 120);
    const email = clean(req.body?.email, 254).toLowerCase();
    const offerKey = clean(req.body?.offer, 80);
    if (!name || !validEmail(email) || !codexOffer(offerKey) || req.body?.privacy !== true) return res.status(400).json({ message: 'Please complete your name, email, offer and privacy consent.' });
    try {
      await ensureCodexSchema();
      const booking = await createCodexBooking({ name, email, offerKey, base: requestBase(req) });
      return res.status(201).json({ approvalUrl: booking.approvalUrl });
    } catch (error) {
      console.error('CODEX booking failed', error);
      return res.status(400).json({ message: error.message || 'The booking could not be started.' });
    }
  }
  try {
    await ensureSchema();
    if (new Date() > BOOKING_CLOSES_AT) return res.status(410).json({ message: message(locale, 'Die Buchung für diesen Workshop ist geschlossen.', 'Booking for this workshop is closed.') });
    const body = req.body || {};
    const participantName = clean(body.name, 160);
    const email = clean(body.email, 180).toLowerCase();
    const phone = clean(body.phone, 80);
    const birthDate = clean(body.birth_date, 10);
    const selected = option(body.payment_option);
    const reasons = array(body.reasons); const areas = array(body.exploration_areas, 3);
    const healthNotes = array(body.health_notes, 8); const healthDetail = clean(body.health_detail);
    const healthRelevant = healthNotes.some(item => item !== 'none') || Boolean(healthDetail);
    if (!participantName || !validEmail(email) || !phone || !validDate(birthDate) || !selected || !reasons.length || !areas.length || areas.length > 3 || !clean(body.movement_context, 60) || (healthNotes.includes('none') && healthNotes.length > 1) || (healthRelevant && body.health_consent !== 'yes')) return res.status(400).json({ message: message(locale, 'Bitte prüfe deine Angaben.', 'Please check your details.') });
    const bookingId = crypto.randomUUID();
    const paymentMethod = body.payment_method === 'studio_cash' ? 'studio_cash' : body.payment_method === 'paypal_link' ? 'paypal_link' : '';
    const intake = { birth_date: birthDate, reasons, reason_other: clean(body.reason_other), movement_context: clean(body.movement_context, 60), current_movement: clean(body.current_movement), exploration_areas: areas, health_notes: healthNotes, health_detail: healthDetail, health_consent: healthRelevant ? 'yes' : '', adjustment: clean(body.adjustment, 60), adjustment_detail: clean(body.adjustment_detail), group_participation: clean(body.group_participation, 60), personal_focus: clean(body.personal_focus) };
    const query = sql();
    const manualPayment = body.payment_mode === 'manual_verification';
    if (manualPayment && !paymentMethod) return res.status(400).json({ message: message(locale, 'Bitte wähle einen Zahlungsweg.', 'Please choose a payment route.') });
    const confirmationToken = manualPayment ? crypto.randomBytes(32).toString('hex') : null;
    const reserved = await query`
      WITH locked AS (SELECT pg_advisory_xact_lock(hashtext(${EVENT_KEY}))),
      used AS (SELECT COALESCE(SUM(seats) FILTER (WHERE status = 'confirmed' OR (status = 'pending' AND reservation_expires_at > now())), 0)::int AS seats FROM body_language_bookings, locked WHERE event_key = ${EVENT_KEY})
      INSERT INTO body_language_bookings (id,event_key,locale,participant_name,email,phone,intake,payment_option,amount_cents,seats,status,reservation_expires_at,payment_method,manual_confirmation_token)
      SELECT ${bookingId}::uuid,${EVENT_KEY},${locale},${participantName},${email},${phone},${JSON.stringify(intake)}::jsonb,${body.payment_option},${selected.cents},${selected.seats},${manualPayment ? 'payment_pending' : 'pending'},${manualPayment ? null : new Date(Date.now() + 20 * 60 * 1000)},${paymentMethod || 'paypal_link'},${confirmationToken}
      FROM used WHERE used.seats + ${selected.seats} <= ${CAPACITY} RETURNING id`;
    if (!reserved[0]) return res.status(409).json({ message: message(locale, 'Dieser Workshop ist leider ausgebucht.', 'This workshop is now sold out.') });
    if (manualPayment) {
      const paymentUrl = paymentMethod === 'paypal_link' ? MANUAL_PAYMENT_LINKS[body.payment_option] : '';
      if (paymentMethod === 'paypal_link' && !paymentUrl) throw new Error('Manual payment link unavailable');
      const label = selected[locale === 'en' ? 'en' : 'de'];
      const amount = new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'de-DE', { style: 'currency', currency: 'EUR' }).format(selected.cents / 100);
      const reference = bookingId.slice(0, 8).toUpperCase();
      const route = paymentMethod === 'studio_cash'
        ? (locale === 'en'
          ? `Please pay in cash at Clever Fit Amberg-Kümmersbruck by 14 November 2026. Please give your full name and booking reference at the studio.`
          : `Bitte bezahle bis einschließlich 14. November 2026 bar im Clever Fit Amberg-Kümmersbruck. Nenne im Studio deinen vollständigen Namen und deine Buchungsreferenz.`)
        : (locale === 'en'
          ? `Please complete payment online via PayPal or card: ${paymentUrl}\nApple Pay is available only where PayPal can offer it.`
          : `Bitte schließe die Zahlung online über PayPal oder Karte ab: ${paymentUrl}\nApple Pay wird angezeigt, wenn PayPal es für deine Zahlung anbieten kann.`);
      const customerText = locale === 'en'
        ? `Hello ${participantName},\n\nwe received your BODY LANGUAGE booking details.\n\n${route}\n\nBooking reference: ${reference}\nSelected option: ${label}\nAmount: ${amount}\n\nBookings and payments close on 14 November 2026. This is not yet a confirmation of a place. We will match the payment to your booking and email you once your place is confirmed.\n\nHuman Architecture®\nhello@human-architecture.info`
        : `Hallo ${participantName},\n\nwir haben deine Buchungsdaten für BODY LANGUAGE erhalten.\n\n${route}\n\nBuchungsreferenz: ${reference}\nGewählte Option: ${label}\nBetrag: ${amount}\n\nAnmeldungen und Zahlungen sind bis einschließlich 14. November 2026 möglich. Dies ist noch keine Platzbestätigung. Wir ordnen die Zahlung deiner Anmeldung zu und senden dir anschließend die Bestätigung per E-Mail.\n\nHuman Architecture®\nhello@human-architecture.info`;
      const confirmationUrl = `${requestBase(req)}/api/body-language-manual-confirm?booking=${bookingId}&token=${confirmationToken}`;
      const staffText = bookingNotificationText({ bookingId, participantName, email, phone, intake, label, amount, seats: selected.seats, paymentRoute: paymentMethod === 'studio_cash' ? 'Barzahlung im Clever Fit Amberg-Kümmersbruck' : 'Online PayPal / Karte', confirmationUrl });
      await Promise.all([
        sendEmail({ to: email, subject: paymentMethod === 'studio_cash' ? (locale === 'en' ? 'BODY LANGUAGE: cash payment at Clever Fit' : 'BODY LANGUAGE: Barzahlung im Clever Fit') : (locale === 'en' ? 'BODY LANGUAGE: complete your online payment' : 'BODY LANGUAGE: Bitte schließe deine Online-Zahlung ab'), text: customerText }),
        sendEmail({ to: 'hello@human-architecture.info', subject: `BODY LANGUAGE · payment pending · ${participantName} · ${amount}`, text: staffText })
      ]);
      return res.status(201).json({ bookingId, approvalUrl: paymentUrl || null, paymentMethod, manualVerification: true });
    }
    const base = requestBase(req);
    const order = await paypalRequest('/v2/checkout/orders', { method: 'POST', headers: { 'PayPal-Request-Id': bookingId }, body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ reference_id: bookingId, custom_id: bookingId, description: 'BODY LANGUAGE | KÖRPERSPRACHE · 28 November 2026', amount: { currency_code: 'EUR', value: (selected.cents / 100).toFixed(2) } }], application_context: { brand_name: 'Human Architecture', landing_page: 'LOGIN', user_action: 'PAY_NOW', return_url: `${base}/api/body-language-paypal-return?booking=${bookingId}`, cancel_url: `${base}/${locale === 'en' ? 'body-language/en/book/' : 'body-language/book/'}?payment=cancelled` } }) });
    const approvalUrl = order.links?.find(link => link.rel === 'approve')?.href;
    if (!approvalUrl) throw new Error('PayPal approval link unavailable');
    await query`UPDATE body_language_bookings SET paypal_order_id=${order.id},updated_at=now() WHERE id=${bookingId}`;
    const label = selected[locale === 'en' ? 'en' : 'de'];
    const amount = formatAmount(selected.cents, locale);
    const staffText = bookingNotificationText({ bookingId, participantName, email, phone, intake, label, amount, seats: selected.seats, paymentRoute: 'Online PayPal / Karte · Zahlung noch offen' });
    try {
      await sendEmail({ to: 'hello@human-architecture.info', subject: `BODY LANGUAGE · neue Anmeldung · ${participantName} · ${amount}`, text: staffText });
    } catch (emailError) {
      console.error('BODY LANGUAGE staff booking email failed', emailError);
    }
    return res.status(201).json({ bookingId, approvalUrl });
  } catch (error) {
    console.error('BODY LANGUAGE booking creation failed', error);
    return res.status(503).json({ message: message(locale, 'Die sichere Zahlung ist gerade nicht verfügbar. Bitte versuche es erneut oder kontaktiere uns.', 'Secure payment is not available right now. Please try again or contact us.') });
  }
};
