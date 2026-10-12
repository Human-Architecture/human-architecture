const { ensureSchema, sql, paypalRequest, confirmBooking, sendConfirmationOnce } = require('../lib/body-language-booking');

async function readWebhookBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1024 * 1024) throw new Error('Webhook payload is too large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  try {
    if (!process.env.PAYPAL_WEBHOOK_ID) return res.status(503).end();
    const webhookEvent = await readWebhookBody(req);
    const verification = await paypalRequest('/v1/notifications/verify-webhook-signature', {
      method: 'POST',
      body: JSON.stringify({
        auth_algo: req.headers['paypal-auth-algo'], cert_url: req.headers['paypal-cert-url'], transmission_id: req.headers['paypal-transmission-id'],
        transmission_sig: req.headers['paypal-transmission-sig'], transmission_time: req.headers['paypal-transmission-time'], webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: webhookEvent
      })
    });
    if (verification.verification_status !== 'SUCCESS') return res.status(400).end();
    if (webhookEvent.event_type !== 'PAYMENT.CAPTURE.COMPLETED') return res.status(200).end();
    const orderId = webhookEvent.resource?.supplementary_data?.related_ids?.order_id;
    const captureId = webhookEvent.resource?.id;
    if (!orderId || !captureId) return res.status(400).end();
    await ensureSchema();
    const query = sql();
    const rows = await query`SELECT * FROM body_language_bookings WHERE paypal_order_id = ${orderId}`;
    const booking = rows[0];
    if (!booking) return res.status(200).end();
    const confirmed = await confirmBooking({ bookingId: booking.id, paypalOrderId: orderId, paypalCaptureId: captureId });
    if (confirmed) { try { await sendConfirmationOnce(confirmed); } catch (error) { console.error('BODY LANGUAGE webhook email retry needed', error); } }
    return res.status(200).end();
  } catch (error) { console.error('BODY LANGUAGE PayPal webhook failed', error); return res.status(500).end(); }
}

module.exports = handler;
module.exports.config = { api: { bodyParser: false } };
