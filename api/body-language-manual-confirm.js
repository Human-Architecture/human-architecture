const { ensureSchema, clean, sql, confirmManualBooking, sendConfirmationOnce } = require('../lib/body-language-booking');

const page = ({ title, body }) => `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{font:16px/1.55 Arial,sans-serif;background:#f5f1e9;color:#063442;margin:0;padding:48px 20px}.card{max-width:680px;margin:auto;background:#fffefa;padding:32px;border-top:3px solid #b69b77}button{background:#063442;color:#fff;border:0;padding:12px 18px;font:inherit;font-weight:700;cursor:pointer}dt{font-weight:700}dd{margin:0 0 12px}</style><main class="card"><h1>${title}</h1>${body}</main>`;
const escape = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

module.exports = async function handler(req, res) {
  const bookingId = clean(req.query.booking, 64);
  const token = clean(req.query.token, 128);
  if (!bookingId || !token) return res.status(400).send(page({ title: 'Ungültiger Link', body: '<p>Dieser Bestätigungslink ist unvollständig.</p>' }));
  try {
    await ensureSchema();
    const query = sql();
    const rows = await query`SELECT participant_name,email,phone,payment_option,amount_cents,seats,payment_method,status FROM body_language_bookings WHERE id=${bookingId}::uuid AND manual_confirmation_token=${token}`;
    const booking = rows[0];
    if (!booking) return res.status(404).send(page({ title: 'Buchung nicht gefunden', body: '<p>Dieser Link ist ungültig oder wurde ersetzt.</p>' }));
    if (req.method === 'GET') {
      return res.status(200).send(page({ title: 'Zahlung zuordnen', body: `<p>Bitte prüfe die Zahlung erst im PayPal-Konto oder im Studio. Dieser Schritt bestätigt anschließend den Platz und stoppt Erinnerungen.</p><dl><dt>Name</dt><dd>${escape(booking.participant_name)}</dd><dt>E-Mail</dt><dd>${escape(booking.email)}</dd><dt>Telefon / WhatsApp</dt><dd>${escape(booking.phone || '—')}</dd><dt>Zahlungsweg</dt><dd>${booking.payment_method === 'studio_cash' ? 'Barzahlung im Clever Fit' : 'Online PayPal / Karte'}</dd><dt>Betrag</dt><dd>${(booking.amount_cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</dd><dt>Status</dt><dd>${escape(booking.status)}</dd></dl><form method="post"><button type="submit">Zahlung zuordnen und Platz bestätigen</button></form>` }));
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).send('Method not allowed'); }
    const confirmed = await confirmManualBooking({ bookingId, token });
    if (!confirmed) return res.status(409).send(page({ title: 'Bestätigung nicht möglich', body: '<p>Die Buchung wurde bereits bestätigt, ist nicht mehr offen oder der Workshop ist inzwischen voll.</p>' }));
    await sendConfirmationOnce(confirmed);
    return res.status(200).send(page({ title: 'Platz bestätigt', body: `<p>Die Zahlung wurde zugeordnet. Die Bestätigung wurde an ${escape(confirmed.email)} gesendet.</p>` }));
  } catch (error) {
    console.error('BODY LANGUAGE manual confirmation failed', error);
    return res.status(500).send(page({ title: 'Bitte erneut versuchen', body: '<p>Die Bestätigung konnte nicht abgeschlossen werden. Bitte kontaktiere hello@human-architecture.info.</p>' }));
  }
};
