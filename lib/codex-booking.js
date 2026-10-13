const crypto = require('node:crypto');
const { neon } = require('@neondatabase/serverless');
const { paypalRequest, requestBase, sendEmail } = require('./body-language-booking');

const OFFERS = Object.freeze({
  current_sky: { title: 'Current Sky', cents: 2900, delivery: 'within five working days' },
  personal_pattern: { title: 'Personal Pattern', cents: 4900, delivery: 'within seven working days' },
  astrological_foundations: { title: 'Astrological Foundations', cents: 5900, delivery: 'within seven working days' },
  private_introduction: { title: 'Private Codex Introduction', cents: 14900, delivery: 'after the appointment is agreed', bookable: false }
});

function databaseUrl() { return process.env.HA_POSTGRES_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || ''; }
function sql() { const url = databaseUrl(); if (!url) throw new Error('Database is not connected'); return neon(url); }
function clean(value, max = 300) { return typeof value === 'string' ? value.replace(/[\r\n\t]+/g, ' ').trim().slice(0, max) : ''; }
function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function offer(key) { return OFFERS[key] || null; }
function paymentEnabled() { return process.env.CODEX_BOOKING_ENABLED === 'true'; }
function encryptionKey() {
  const value = process.env.CODEX_INTAKE_ENCRYPTION_KEY || '';
  const key = Buffer.from(value, 'base64');
  if (key.length !== 32) throw new Error('Secure intake is not configured');
  return key;
}
function secureIntakeConfigured() {
  try { encryptionKey(); return true; } catch { return false; }
}
function encrypt(data) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
  return [iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), encrypted.toString('base64url')].join('.');
}
function decrypt(value) {
  const [iv, tag, payload] = String(value || '').split('.').map(part => Buffer.from(part, 'base64url'));
  if (!iv || !tag || !payload) throw new Error('Stored intake cannot be read');
  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(payload), decipher.final()]).toString('utf8'));
}
function tokenHash(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
function newToken() { return crypto.randomBytes(32).toString('base64url'); }
function intakeUrl(base, booking, token) { return `${base}/codex/intake/?booking=${booking.id}&token=${encodeURIComponent(token)}`; }
async function ensureSchema() {
  const query = sql();
  await query`CREATE TABLE IF NOT EXISTS codex_bookings (
    id uuid PRIMARY KEY,
    offer_key text NOT NULL,
    amount_cents integer NOT NULL,
    status text NOT NULL DEFAULT 'pending_payment',
    contact_encrypted text NOT NULL,
    intake_encrypted text,
    intake_access_encrypted text NOT NULL,
    intake_token_hash text NOT NULL UNIQUE,
    privacy_consented_at timestamptz NOT NULL,
    paypal_order_id text UNIQUE,
    paypal_capture_id text UNIQUE,
    paid_at timestamptz,
    intake_completed_at timestamptz,
    intake_email_sent_at timestamptz,
    delete_after timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await query`CREATE INDEX IF NOT EXISTS codex_bookings_status_idx ON codex_bookings(status, created_at)`;
}
async function getBooking(id) { const rows = await sql()`SELECT * FROM codex_bookings WHERE id=${id}::uuid`; return rows[0] || null; }
async function getBookingForToken(id, token) {
  const rows = await sql()`SELECT * FROM codex_bookings WHERE id=${id}::uuid AND intake_token_hash=${tokenHash(token)}`;
  return rows[0] || null;
}
async function createBooking({ name, email, offerKey, base }) {
  const selected = offer(offerKey);
  if (!selected || selected.bookable === false) throw new Error('This Codex format is arranged personally. Please send an enquiry first.');
  const id = crypto.randomUUID();
  const token = newToken();
  const query = sql();
  await query`INSERT INTO codex_bookings (id, offer_key, amount_cents, contact_encrypted, intake_access_encrypted, intake_token_hash, privacy_consented_at, delete_after)
    VALUES (${id}::uuid, ${offerKey}, ${selected.cents}, ${encrypt({ name, email })}, ${encrypt({ token })}, ${tokenHash(token)}, now(), now() + interval '90 days')`;
  try {
    const order = await paypalRequest('/v2/checkout/orders', { method: 'POST', headers: { 'PayPal-Request-Id': id }, body: JSON.stringify({
      intent: 'CAPTURE', purchase_units: [{ reference_id: id, custom_id: id, description: `The Codex | ${selected.title}`, amount: { currency_code: 'EUR', value: (selected.cents / 100).toFixed(2) } }],
      application_context: { brand_name: 'Human Architecture', user_action: 'PAY_NOW', return_url: `${base}/api/body-language-paypal-return?codex=return&booking=${id}`, cancel_url: `${base}/codex/book/?offer=${offerKey}&payment=cancelled` }
    }) });
    const approvalUrl = order.links?.find(link => link.rel === 'approve')?.href;
    if (!approvalUrl) throw new Error('PayPal approval link unavailable');
    await query`UPDATE codex_bookings SET paypal_order_id=${order.id}, updated_at=now() WHERE id=${id}::uuid`;
    return { id, approvalUrl };
  } catch (error) { await query`DELETE FROM codex_bookings WHERE id=${id}::uuid`; throw error; }
}
async function confirmPayment({ bookingId, orderId, captureId }) {
  const query = sql();
  const rows = await query`UPDATE codex_bookings SET status='paid', paypal_order_id=${orderId}, paypal_capture_id=${captureId}, paid_at=COALESCE(paid_at, now()), updated_at=now() WHERE id=${bookingId}::uuid AND (status='pending_payment' OR status='paid') RETURNING *`;
  return rows[0] || null;
}
async function sendIntakeOnce(booking, base) {
  const query = sql();
  const claimed = await query`UPDATE codex_bookings SET intake_email_sent_at=now() WHERE id=${booking.id}::uuid AND intake_email_sent_at IS NULL RETURNING *`;
  if (!claimed[0]) return false;
  try {
    const contact = decrypt(booking.contact_encrypted);
    const access = decrypt(booking.intake_access_encrypted);
    const selected = offer(booking.offer_key);
    await sendEmail({ to: contact.email, subject: `The Codex: your private intake link`, text: `Hello ${contact.name},\n\nYour payment for ${selected.title} has been received.\n\nPlease complete your private intake here:\n${intakeUrl(base, booking, access.token)}\n\nThis link is personal to your booking. Please do not forward it. We use the information only to prepare your selected Codex format.\n\nHuman Architecture\nhello@human-architecture.info` });
    return true;
  } catch (error) { await query`UPDATE codex_bookings SET intake_email_sent_at=NULL WHERE id=${booking.id}::uuid`; throw error; }
}
async function saveIntake({ booking, intake }) {
  const query = sql();
  const rows = await query`UPDATE codex_bookings SET intake_encrypted=${encrypt(intake)}, status='intake_complete', intake_completed_at=now(), updated_at=now() WHERE id=${booking.id}::uuid AND status IN ('paid','intake_complete') RETURNING *`;
  return rows[0] || null;
}
async function captureReturn({ bookingId, orderId, base }) {
  const booking = await getBooking(bookingId);
  if (!booking || booking.paypal_order_id !== orderId) throw new Error('Payment session not found');
  let order = await paypalRequest(`/v2/checkout/orders/${orderId}`);
  const unit = order.purchase_units?.[0];
  if (unit?.custom_id !== bookingId || unit?.amount?.currency_code !== 'EUR' || unit?.amount?.value !== (booking.amount_cents / 100).toFixed(2)) throw new Error('Payment details could not be verified');
  if (order.status === 'APPROVED') order = await paypalRequest(`/v2/checkout/orders/${orderId}/capture`, { method: 'POST', body: '{}' });
  const captureId = order.purchase_units?.[0]?.payments?.captures?.[0]?.id;
  if (order.status !== 'COMPLETED' || !captureId) throw new Error('Payment was not completed');
  const confirmed = await confirmPayment({ bookingId, orderId, captureId });
  if (!confirmed) throw new Error('Payment could not be recorded');
  try { await sendIntakeOnce(confirmed, base); } catch (error) { console.error('CODEX intake email retry needed', error); }
  return confirmed;
}
module.exports = { OFFERS, clean, validEmail, offer, paymentEnabled, secureIntakeConfigured, ensureSchema, requestBase, createBooking, getBookingForToken, saveIntake, captureReturn, getBooking, confirmPayment, sendIntakeOnce, decrypt, sql };
