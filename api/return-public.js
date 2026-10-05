const { Resend } = require('resend');

const clean = (value, max = 600) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const safePaymentUrl = (value) => {
  if (!value) return '';
  try { const url = new URL(value); return url.protocol === 'https:' ? url.toString() : ''; } catch { return ''; }
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'Method not allowed' }); }
  const body = req.body || {};
  if (body.website) return res.status(200).json({ ok: true });
  const firstName = clean(body.firstName, 80);
  const lastName = clean(body.lastName, 80);
  const email = clean(body.email, 180);
  const phone = clean(body.phone, 80);
  const priceType = clean(body.priceType, 20);
  const safetyNote = clean(body.safetyNote, 600);
  const language = body.language === 'en' ? 'en' : 'de';
  if (!firstName || !lastName || !validEmail(email) || !['regular', 'dali'].includes(priceType) || body.participation !== true || body.privacy !== true || (safetyNote && body.healthConsent !== true)) {
    return res.status(400).json({ ok: false, error: 'Required fields missing' });
  }
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ ok: false, error: 'Delivery unavailable' });

  const price = priceType === 'dali' ? '18,00 €' : '22,00 €';
  const category = priceType === 'dali' ? 'DALI Mitglied' : 'Regulär';
  const notification = [
    'RETURN · PUBLIC SESSION REGISTRATION',
    'Session: 07.11.2026 · 17:30–19:30 · Sulzbach-Rosenberg',
    `Name: ${firstName} ${lastName}`,
    `Email: ${email}`,
    `Phone: ${phone || '—'}`,
    `Price category: ${category}`,
    `Amount: ${price}`,
    `Participation note: ${safetyNote || '—'}`,
    `Language: ${language === 'en' ? 'English' : 'German'}`,
    'Participation guidance accepted: yes', `Explicit consent for optional health-related note: ${safetyNote ? 'yes' : 'not applicable'}`,
    'Privacy consent: yes',
    'Status: registration received; place NOT confirmed until payment is confirmed.'
  ].join('\n\n');

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: notificationError } = await resend.emails.send({
      from: 'Mihira Ceremonia Website <website@human-architecture.info>',
      to: ['hello@human-architecture.info'],
      replyTo: email,
      subject: `RETURN Anmeldung · ${firstName} ${lastName} · ${category}`,
      text: notification
    });
    if (notificationError) throw new Error(notificationError.message || 'Email failed');

    const confirmationText = language === 'en'
      ? `Hello ${firstName},\n\nthank you for registering for RETURN on 7 November 2026, 17:30–19:30 in Sulzbach-Rosenberg.\n\nYour registration has been received. Your place is not yet confirmed: it is secured only after payment has been completed and confirmed. We will send the secure payment route and, after confirmation, the exact location, what to bring, preparation and cancellation information.\n\nSelected category: ${category}\nAmount: ${price}\n\nRETURN is voluntary. You can reduce breathing intensity, return to normal breathing or pause at any time. RETURN is not medical treatment or psychotherapy.\n\nMihira Ceremonia · Human Architecture\nhello@human-architecture.info`
      : `Hallo ${firstName},\n\nvielen Dank für deine Anmeldung zu RETURN am 7. November 2026 von 17:30–19:30 Uhr in Sulzbach-Rosenberg.\n\nDeine Anmeldung ist eingegangen. Dein Platz ist noch nicht bestätigt: Er ist erst nach abgeschlossener und bestätigter Zahlung gesichert. Wir senden dir den sicheren Zahlungsweg und nach der Bestätigung den exakten Ort, Mitbringen, Vorbereitung und Stornoinformationen.\n\nGewählte Preisgruppe: ${category}\nBetrag: ${price}\n\nDie Teilnahme ist freiwillig. Du kannst die Atemintensität reduzieren, zur normalen Atmung zurückkehren oder jederzeit pausieren. RETURN ist keine medizinische Behandlung oder Psychotherapie.\n\nMihira Ceremonia · Human Architecture\nhello@human-architecture.info`;
    const { error: confirmationError } = await resend.emails.send({
      from: 'Mihira Ceremonia <hello@human-architecture.info>',
      to: [email],
      replyTo: 'hello@human-architecture.info',
      subject: language === 'en' ? 'We received your RETURN registration' : 'Deine RETURN Anmeldung ist eingegangen',
      text: confirmationText
    });
    if (confirmationError) console.error('RETURN acknowledgement failed', confirmationError);

    const paymentUrl = safePaymentUrl(priceType === 'dali' ? process.env.RETURN_PAYMENT_URL_DALI : process.env.RETURN_PAYMENT_URL_REGULAR);
    return res.status(200).json({ ok: true, paymentUrl: paymentUrl || undefined, paymentConfigured: Boolean(paymentUrl) });
  } catch (error) {
    console.error('RETURN registration delivery failed', error);
    return res.status(500).json({ ok: false, error: 'Delivery failed' });
  }
};
