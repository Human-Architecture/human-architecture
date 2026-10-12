const { clean, ensureSchema, getBookingForToken, saveIntake } = require('../lib/codex-booking');

function validDate(value) { const date = new Date(`${value}T12:00:00Z`); return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value; }
function validTime(value) { if (value === '') return true; if (!/^\d{2}:\d{2}$/.test(value)) return false; const [hours, minutes] = value.split(':').map(Number); return hours < 24 && minutes < 60; }
function readAccess(req) { return { booking: clean(req.method === 'GET' ? req.query?.booking : req.body?.booking, 80), token: clean(req.method === 'GET' ? req.query?.token : req.body?.token, 200) }; }

module.exports = async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return res.status(405).end(); }
  const { booking: bookingId, token } = readAccess(req);
  try {
    await ensureSchema();
    const booking = await getBookingForToken(bookingId, token);
    if (!booking || !['paid', 'intake_complete'].includes(booking.status)) return res.status(404).json({ message: 'This private intake link is not available.' });
    if (req.method === 'GET') return res.status(200).json({ offer: booking.offer_key, submitted: Boolean(booking.intake_completed_at) });
    const birthDate = clean(req.body?.birthDate, 10);
    const birthPlace = clean(req.body?.birthPlace, 120);
    const birthTime = clean(req.body?.birthTime, 5);
    const theme = clean(req.body?.theme, 120);
    const question = clean(req.body?.question, 700);
    if (!validDate(birthDate) || !birthPlace || !validTime(birthTime) || req.body?.dataConsent !== true) return res.status(400).json({ message: 'Please complete the required details and consent.' });
    if (booking.offer_key === 'personal_pattern' && !['Love & Relationships', 'Identity & Expression', 'Direction & Responsibility'].includes(theme)) return res.status(400).json({ message: 'Please select the area you would like to explore.' });
    if (booking.offer_key === 'private_introduction' && !question) return res.status(400).json({ message: 'Please add your question for the private introduction.' });
    await saveIntake({ booking, intake: { birthDate, birthPlace, birthTime: birthTime || 'unknown', theme, question, dataConsentedAt: new Date().toISOString() } });
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('CODEX intake failed', error);
    return res.status(400).json({ message: error.message || 'Your intake could not be saved.' });
  }
};
