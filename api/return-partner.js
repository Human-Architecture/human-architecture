const { Resend } = require('resend');

const clean = (value, max = 1200) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'Method not allowed' }); }
  const body = req.body || {};
  if (body.website) return res.status(200).json({ ok: true });
  const fields = {
    name: clean(body.name, 120), organization: clean(body.organization, 160), email: clean(body.email, 180),
    phone: clean(body.phone, 80), organizationType: clean(body.organizationType, 40), location: clean(body.location, 160),
    groupSize: clean(body.groupSize, 80), format: clean(body.format, 20), timeframe: clean(body.timeframe, 160),
    intention: clean(body.intention), notes: clean(body.notes)
  };
  const required = ['name', 'organization', 'email', 'organizationType', 'location', 'groupSize', 'format', 'timeframe', 'intention'];
  if (required.some((key) => !fields[key]) || !validEmail(fields.email) || body.privacy !== true) return res.status(400).json({ ok: false, error: 'Required fields missing' });
  if (!['company', 'studio', 'hotel', 'retreat', 'community', 'private', 'other'].includes(fields.organizationType) || !['60', '90', '120', 'open'].includes(fields.format)) return res.status(400).json({ ok: false, error: 'Invalid selection' });
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ ok: false, error: 'Delivery unavailable' });

  const language = body.language === 'en' ? 'en' : 'de';
  const text = [
    'RETURN · PRIVATE / ORGANIZATION ENQUIRY',
    `Name: ${fields.name}`, `Organization: ${fields.organization}`, `Email: ${fields.email}`, `Phone: ${fields.phone || '—'}`,
    `Organization type: ${fields.organizationType}`, `Location: ${fields.location}`, `Estimated group size: ${fields.groupSize}`,
    `Preferred format: ${fields.format === 'open' ? 'Open / discuss' : `${fields.format} minutes`}`, `Timeframe: ${fields.timeframe}`,
    `Desired outcome: ${fields.intention}`, `Further information: ${fields.notes || '—'}`,
    `Language: ${language === 'en' ? 'English' : 'German'}`, 'Privacy consent: yes', 'Status: enquiry only; no booking confirmed.'
  ].join('\n\n');

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: notificationError } = await resend.emails.send({
      from: 'Mihira Ceremonia Website <website@human-architecture.info>',
      to: ['hello@human-architecture.info'],
      replyTo: fields.email,
      subject: `RETURN Anfrage · ${fields.organization} · ${fields.location}`,
      text
    });
    if (notificationError) throw new Error(notificationError.message || 'Email failed');

    const confirmationText = language === 'en'
      ? `Hello ${fields.name},\n\nthank you for your interest in bringing RETURN to ${fields.organization}. We have received your enquiry and will review the context, group size, location and preferred timeframe. We will respond with a suitable recommendation for duration, structure and scope.\n\nThis is an enquiry, not yet a confirmed booking. Format, date, fee, travel and responsibilities are agreed transparently before confirmation.\n\nMihira Ceremonia · Human Architecture\nhello@human-architecture.info`
      : `Hallo ${fields.name},\n\nvielen Dank für dein Interesse, RETURN zu ${fields.organization} zu bringen. Deine Anfrage ist eingegangen. Wir prüfen Kontext, Gruppengröße, Ort und gewünschten Zeitraum und melden uns mit einer passenden Empfehlung für Dauer, Aufbau und Rahmen.\n\nDies ist eine Anfrage, noch keine bestätigte Buchung. Format, Termin, Honorar, Reise und Verantwortlichkeiten werden vor einer Bestätigung transparent vereinbart.\n\nMihira Ceremonia · Human Architecture\nhello@human-architecture.info`;
    const { error: confirmationError } = await resend.emails.send({
      from: 'Mihira Ceremonia <hello@human-architecture.info>', to: [fields.email], replyTo: 'hello@human-architecture.info',
      subject: language === 'en' ? 'We received your RETURN enquiry' : 'Deine RETURN Anfrage ist eingegangen', text: confirmationText
    });
    if (confirmationError) console.error('RETURN partner acknowledgement failed', confirmationError);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('RETURN partner enquiry delivery failed', error);
    return res.status(500).json({ ok: false, error: 'Delivery failed' });
  }
};
