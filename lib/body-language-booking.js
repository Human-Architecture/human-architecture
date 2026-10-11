const crypto = require('node:crypto');
const { neon } = require('@neondatabase/serverless');

const EVENT_KEY = 'body-language-2026-11-28';
const CAPACITY = 12;
const EVENT = Object.freeze({
  title: 'BODY LANGUAGE | KÖRPERSPRACHE',
  date: '2026-11-28',
  start: '15:00',
  end: '17:00',
  venue: 'Clever Fit Amberg-Kümmersbruck'
});
const OPTIONS = Object.freeze({
  member_single: { cents: 2900, seats: 1, de: 'Clever Fit Mitglied · 1 Person', en: 'Clever Fit member · 1 person' },
  member_pair: { cents: 5220, seats: 2, de: 'Zwei Clever Fit Mitglieder · gemeinsam', en: 'Two Clever Fit members · together' },
  non_member_single: { cents: 4900, seats: 1, de: 'Keine Clever Fit Mitgliedschaft · 1 Person', en: 'Not a Clever Fit member · 1 person' },
  member_plus_non_member: { cents: 7020, seats: 2, de: 'Eine:r mit, eine:r ohne Clever Fit Mitgliedschaft', en: 'One member and one non-member' },
  non_member_pair: { cents: 8820, seats: 2, de: 'Zwei Personen ohne Clever Fit Mitgliedschaft', en: 'Two non-members' }
});

function databaseUrl() {
  return process.env.HA_POSTGRES_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
}
function sql() {
  const url = databaseUrl();
  if (!url) throw new Error('Database is not connected');
  return neon(url);
}
async function ensureSchema() {
  const query = sql();
  await query`CREATE TABLE IF NOT EXISTS body_language_bookings (
    id uuid PRIMARY KEY,
    event_key text NOT NULL,
    locale text NOT NULL DEFAULT 'de',
    participant_name text NOT NULL,
    email text NOT NULL,
    phone text,
    intake jsonb NOT NULL,
    payment_option text NOT NULL,
    amount_cents integer NOT NULL,
    seats integer NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    reservation_expires_at timestamptz,
    paypal_order_id text UNIQUE,
    paypal_capture_id text UNIQUE,
    confirmed_at timestamptz,
    confirmation_email_sent_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await query`CREATE INDEX IF NOT EXISTS body_language_bookings_event_status_idx ON body_language_bookings(event_key, status)`;
  await query`ALTER TABLE body_language_bookings ADD COLUMN IF NOT EXISTS confirmation_email_sent_at timestamptz`;
}
function clean(value, max = 400) {
  return typeof value === 'string' ? value.replace(/[\r\n\t]+/g, ' ').trim().slice(0, max) : '';
}
function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function array(value, max = 8) { return Array.isArray(value) ? value.filter(v => typeof v === 'string').map(v => clean(v, 100)).filter(Boolean).slice(0, max) : []; }
function option(key) { return OPTIONS[key] || null; }
function formatAmount(cents, locale = 'de') { return new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100); }
function requestBase(req) { return process.env.SITE_URL || `https://${req.headers['x-forwarded-host'] || req.headers.host}`; }
function paypalBase() { return process.env.PAYPAL_ENVIRONMENT === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'; }
async function paypalToken() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) throw new Error('PayPal is not connected');
  const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${paypalBase()}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
  const body = await response.json();
  if (!response.ok || !body.access_token) throw new Error('PayPal access could not be established');
  return body.access_token;
}
async function paypalRequest(path, init = {}) {
  const token = await paypalToken();
  const response = await fetch(`${paypalBase()}${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(init.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'PayPal request failed');
  return body;
}
async function sendEmail({ to, subject, text }) {
  if (!process.env.RESEND_API_KEY) throw new Error('Email delivery is not connected');
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({ from: process.env.BODY_LANGUAGE_FROM_EMAIL || 'Human Architecture <hello@human-architecture.info>', to: [to], replyTo: 'hello@human-architecture.info', subject, text });
  if (result.error) throw new Error(result.error.message || 'Email delivery failed');
}
function confirmationText(booking) {
  const english = booking.locale === 'en';
  const label = OPTIONS[booking.payment_option][english ? 'en' : 'de'];
  if (english) return { subject: 'BODY LANGUAGE: your place is confirmed', text: `Hello ${booking.participant_name},\n\nyour payment has been verified and your ${booking.seats === 1 ? 'place is' : 'places are'} confirmed.\n\n${EVENT.title}\n28 November 2026 · 15:00–17:00\n${EVENT.venue}\n${booking.seats} ${booking.seats === 1 ? 'place' : 'places'} · ${label}\nPaid: ${formatAmount(booking.amount_cents, 'en')}\n\nIf you cannot attend, you may transfer your place to another person up to and including 7 calendar days before the workshop. Please email hello@human-architecture.info with the replacement person’s full name and email. No refunds are offered for personal cancellations.\n\nHuman Architecture®\nhello@human-architecture.info` };
  return { subject: 'BODY LANGUAGE: Dein Platz ist bestätigt', text: `Hallo ${booking.participant_name},\n\ndeine Zahlung wurde verifiziert und dein ${booking.seats === 1 ? 'Platz ist' : 'Plätze sind'} verbindlich bestätigt.\n\n${EVENT.title}\n28. November 2026 · 15:00–17:00 Uhr\n${EVENT.venue}\n${booking.seats} ${booking.seats === 1 ? 'Platz' : 'Plätze'} · ${label}\nBezahlt: ${formatAmount(booking.amount_cents, 'de')}\n\nWenn du nicht teilnehmen kannst, darfst du deinen Platz bis einschließlich 7 Kalendertage vor dem Workshop auf eine andere Person übertragen. Bitte sende uns dafür den vollständigen Namen und die E-Mail-Adresse der Ersatzperson an hello@human-architecture.info. Für persönliche Absagen gibt es keine Rückerstattung.\n\nHuman Architecture®\nhello@human-architecture.info` };
}
async function confirmBooking({ bookingId, paypalOrderId, paypalCaptureId }) {
  const query = sql();
  const rows = await query`
    WITH booking AS (
      SELECT * FROM body_language_bookings WHERE id = ${bookingId}::uuid AND event_key = ${EVENT_KEY}
    ), locked AS (
      SELECT pg_advisory_xact_lock(hashtext(${EVENT_KEY}))
    ), used AS (
      SELECT COALESCE(SUM(seats) FILTER (WHERE status = 'confirmed' AND id <> ${bookingId}::uuid), 0)::int AS seats FROM body_language_bookings, locked WHERE event_key = ${EVENT_KEY}
    )
    UPDATE body_language_bookings AS target
    SET status = 'confirmed', paypal_order_id = ${paypalOrderId}, paypal_capture_id = ${paypalCaptureId}, confirmed_at = COALESCE(confirmed_at, now()), updated_at = now()
    FROM booking, used
    WHERE target.id = booking.id
      AND (target.status = 'confirmed' OR (target.status = 'pending' AND target.reservation_expires_at > now() AND used.seats + target.seats <= ${CAPACITY}))
    RETURNING target.*`;
  return rows[0] || null;
}
async function sendConfirmationOnce(booking) {
  const query = sql();
  const claimed = await query`UPDATE body_language_bookings SET confirmation_email_sent_at = now() WHERE id = ${booking.id}::uuid AND confirmation_email_sent_at IS NULL RETURNING *`;
  if (!claimed[0]) return false;
  try {
    const email = confirmationText(booking);
    await sendEmail({ to: booking.email, ...email });
    return true;
  } catch (error) {
    await query`UPDATE body_language_bookings SET confirmation_email_sent_at = NULL WHERE id = ${booking.id}::uuid`;
    throw error;
  }
}
module.exports = { EVENT_KEY, CAPACITY, EVENT, OPTIONS, sql, ensureSchema, clean, validEmail, array, option, formatAmount, requestBase, paypalRequest, sendEmail, confirmationText, confirmBooking, sendConfirmationOnce, crypto };
