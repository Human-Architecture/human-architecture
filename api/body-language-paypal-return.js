const { ensureSchema, sql, paypalRequest, confirmBooking, sendConfirmationOnce } = require('../lib/body-language-booking');

function redirect(res, path) { res.statusCode = 303; res.setHeader('Location', path); res.end(); }
module.exports = async function handler(req, res) {
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
