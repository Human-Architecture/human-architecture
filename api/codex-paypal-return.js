const { ensureSchema, captureReturn, requestBase } = require('../lib/codex-booking');

module.exports = async function handler(req, res) {
  const bookingId = String(req.query?.booking || '');
  const orderId = String(req.query?.token || '');
  if (!bookingId || !orderId) return res.redirect(302, '/codex/book/?payment=error');
  try {
    await ensureSchema();
    await captureReturn({ bookingId, orderId, base: requestBase(req) });
    return res.redirect(302, '/codex/payment/confirmed/');
  } catch (error) {
    console.error('CODEX PayPal return failed', error);
    return res.redirect(302, '/codex/book/?payment=error');
  }
};
