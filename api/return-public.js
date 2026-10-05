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
  const bringFriend = clean(body.bringFriend, 8);
  const friendFirstName = clean(body.friendFirstName, 80);
  const friendLastName = clean(body.friendLastName, 80);
  const friendEmail = clean(body.friendEmail, 180);
  const friendPriceType = clean(body.friendPriceType, 20);
  const safetyNote = clean(body.safetyNote, 600);
  const language = body.language === 'en' ? 'en' : 'de';
  const hasFriend = bringFriend === 'yes';
  const validFriend = !hasFriend || (friendFirstName && friendLastName && validEmail(friendEmail) && ['regular', 'dali'].includes(friendPriceType));
  if (!firstName || !lastName || !validEmail(email) || !['regular', 'dali'].includes(priceType) || !['yes', 'no'].includes(bringFriend) || !validFriend || body.participation !== true || body.privacy !== true || (safetyNote && body.healthConsent !== true)) {
    return res.status(400).json({ ok: false, error: 'Required fields missing' });
  }
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ ok: false, error: 'Delivery unavailable' });

  const basePrice = (type) => type === 'dali' ? 25 : 28;
  const formatPrice = (amount) => `${amount.toFixed(2).replace('.', ',')} €`;
  const categoryFor = (type) => type === 'dali' ? 'DALI Mitglied' : 'Regulär';
  const firstPrice = basePrice(priceType) * (hasFriend ? 0.9 : 1);
  const secondPrice = hasFriend ? basePrice(friendPriceType) * 0.9 : 0;
  const totalPrice = firstPrice + secondPrice;
  const category = categoryFor(priceType);
  const friendCategory = hasFriend ? categoryFor(friendPriceType) : '';
  const paymentEnv = !hasFriend
    ? (priceType === 'dali' ? 'RETURN_PAYMENT_URL_DALI' : 'RETURN_PAYMENT_URL_REGULAR')
    : (priceType === 'dali' && friendPriceType === 'dali'
      ? 'RETURN_PAYMENT_URL_FRIEND_DD'
      : (priceType === 'regular' && friendPriceType === 'regular' ? 'RETURN_PAYMENT_URL_FRIEND_RR' : 'RETURN_PAYMENT_URL_FRIEND_RD'));
  const notification = [
    'RETURN · PUBLIC SESSION REGISTRATION',
    'Session: 14.11.2026 · 18:00–19:30 · Sulzbach-Rosenberg · buffer until 20:00',
    `Participant 1: ${firstName} ${lastName}`,
    `Email 1: ${email}`,
    `Phone: ${phone || '—'}`,
    `Category 1: ${category}`,
    `Amount 1: ${formatPrice(firstPrice)}`,
    ...(hasFriend ? [
      `Participant 2: ${friendFirstName} ${friendLastName}`,
      `Email 2: ${friendEmail}`,
      `Category 2: ${friendCategory}`,
      `Amount 2: ${formatPrice(secondPrice)}`,
      'Bring-a-Friend discount: 10% per participant'
    ] : []),
    `Total: ${formatPrice(totalPrice)}`,
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
      ? `Hello ${firstName},\n\nthank you for registering for RETURN on 14 November 2026, 18:00–19:30 in Sulzbach-Rosenberg. Please keep time available until 20:00 for arrival and a calm close.\n\nYour registration has been received. Your place is not yet confirmed: it is secured only after payment has been completed and confirmed. We will send the secure payment route and, after confirmation, the exact location, what to bring, preparation and cancellation information.\n\nParticipant 1: ${category} · ${formatPrice(firstPrice)}${hasFriend ? `\nParticipant 2: ${friendFirstName} ${friendLastName} · ${friendCategory} · ${formatPrice(secondPrice)}\nBring-a-Friend discount: 10% per participant` : ''}\nTotal: ${formatPrice(totalPrice)}\n\nRETURN is voluntary. You can reduce breathing intensity, return to normal breathing or pause at any time. RETURN is not medical treatment or psychotherapy.\n\nMihira Ceremonia · Human Architecture\nhello@human-architecture.info`
      : `Hallo ${firstName},\n\nvielen Dank für deine Anmeldung zu RETURN am 14. November 2026 von 18:00–19:30 Uhr in Sulzbach-Rosenberg. Bitte halte dir für Ankommen und einen ruhigen Abschluss zeitlichen Puffer bis 20:00 Uhr frei.\n\nDeine Anmeldung ist eingegangen. Dein Platz ist noch nicht bestätigt: Er ist erst nach abgeschlossener und bestätigter Zahlung gesichert. Wir senden dir den sicheren Zahlungsweg und nach der Bestätigung den exakten Ort, Mitbringen, Vorbereitung und Stornoinformationen.\n\nTeilnehmer/in 1: ${category} · ${formatPrice(firstPrice)}${hasFriend ? `\nTeilnehmer/in 2: ${friendFirstName} ${friendLastName} · ${friendCategory} · ${formatPrice(secondPrice)}\nBring-a-Friend-Rabatt: 10 % pro Person` : ''}\nGesamt: ${formatPrice(totalPrice)}\n\nDie Teilnahme ist freiwillig. Du kannst die Atemintensität reduzieren, zur normalen Atmung zurückkehren oder jederzeit pausieren. RETURN ist keine medizinische Behandlung oder Psychotherapie.\n\nMihira Ceremonia · Human Architecture\nhello@human-architecture.info`;
    const { error: confirmationError } = await resend.emails.send({
      from: 'Mihira Ceremonia <hello@human-architecture.info>',
      to: [email],
      replyTo: 'hello@human-architecture.info',
      subject: language === 'en' ? 'We received your RETURN registration' : 'Deine RETURN Anmeldung ist eingegangen',
      text: confirmationText
    });
    if (confirmationError) console.error('RETURN acknowledgement failed', confirmationError);

    const paymentUrl = safePaymentUrl(process.env[paymentEnv]);
    return res.status(200).json({ ok: true, paymentUrl: paymentUrl || undefined, paymentConfigured: Boolean(paymentUrl) });
  } catch (error) {
    console.error('RETURN registration delivery failed', error);
    return res.status(500).json({ ok: false, error: 'Delivery failed' });
  }
};
