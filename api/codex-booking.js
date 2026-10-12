const { clean, validEmail, offer, paymentEnabled, ensureSchema, requestBase, createBooking } = require('../lib/codex-booking');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  if (!paymentEnabled()) return res.status(503).json({ message: 'Direct booking is not open yet. Please contact us at hello@human-architecture.info.' });
  const name = clean(req.body?.name, 120);
  const email = clean(req.body?.email, 254).toLowerCase();
  const offerKey = clean(req.body?.offer, 80);
  if (!name || !validEmail(email) || !offer(offerKey) || req.body?.privacy !== true) return res.status(400).json({ message: 'Please complete your name, email, offer and privacy consent.' });
  try {
    await ensureSchema();
    const booking = await createBooking({ name, email, offerKey, base: requestBase(req) });
    return res.status(201).json({ approvalUrl: booking.approvalUrl });
  } catch (error) {
    console.error('CODEX booking failed', error);
    return res.status(400).json({ message: error.message || 'The booking could not be started.' });
  }
};
