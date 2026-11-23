const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'body-language/booking-config.js'), 'utf8'), context);
const config = context.window.BodyLanguageBooking;

assert.equal(config.status, 'manual_verification');
assert.equal(config.payment_provider, 'PayPal');
assert.equal(config.booking_closes_at, '2026-11-28T17:00:00+01:00');
assert.equal(config.studio_payment_venue, 'Clever Fit Amberg-Kümmersbruck');
assert.equal(config.booking_confirmation_email, 'hello@human-architecture.info');
assert.equal(config.terms_url, '/body-language/terms/');
assert.equal(config.date, '2026-11-28');
assert.equal(config.capacity, 12);
assert.equal(config.internal_max_capacity, 15);
assert.equal(config.start_time, '15:00');
assert.equal(config.end_time, '17:00');
assert.equal(config.prices.member_single, 29);
assert.equal(config.prices.non_member_single, 49);
assert.equal(config.prices.member_pair, 52.2);
assert.equal(config.prices.member_plus_non_member, 70.2);
assert.equal(config.prices.non_member_pair, 88.2);
for (const key of ['member_single', 'member_pair', 'non_member_single', 'member_plus_non_member', 'non_member_pair']) {
  assert.match(config.payment_links[key], /^https:\/\/www\.paypal\.com\/ncp\/payment\/[A-Z0-9]+$/);
}
assert.ok(fs.existsSync(path.join(root, 'body-language/terms/index.html')));

for (const page of ['body-language/book/index.html', 'body-language/en/book/index.html']) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  assert.match(html, /<form id="intake"/);
  assert.match(html, /name="exploration_areas"/);
  assert.match(html, /type="radio" name="reasons"/);
  assert.match(html, /name="birth_date"/);
  assert.match(html, /name="health_notes"/);
  assert.match(html, /name="health_consent"/);
  assert.match(html, /name="phone"[^>]*required/);
  assert.doesNotMatch(html, /event-availability/);
  assert.doesNotMatch(html, /name="group_participation"/);
  assert.match(html, /id="privacy"/);
  assert.match(html, /id="terms"/);
  assert.match(html, /booking\.js/);
}

const bookingScript = fs.readFileSync(path.join(root, 'body-language/book/booking.js'), 'utf8');
assert.doesNotMatch(bookingScript, /window\.scrollTo/);
assert.match(bookingScript, /manual_verification/);
assert.match(bookingScript, /payment_method/);
assert.match(bookingScript, /studio_cash/);
assert.match(bookingScript, /PayPal or card/);
assert.match(bookingScript, /href="\/impressum\/"/);
assert.match(bookingScript, /href="\/widerruf\/"/);

const astrologyScript = fs.readFileSync(path.join(root, 'kurse/westliche-astrologie/course.js'), 'utf8');
assert.match(astrologyScript, /href="\/impressum\/"/);
assert.match(astrologyScript, /href="\/datenschutz\/"/);
assert.match(astrologyScript, /href="\/widerruf\/"/);

const codexBookingScript = fs.readFileSync(path.join(root, 'codex/book/booking.js'), 'utf8');
assert.match(codexBookingScript, /href="\/impressum\/"/);
assert.match(codexBookingScript, /href="\/datenschutz\/"/);
assert.match(codexBookingScript, /href="\/widerruf\/"/);

const bookingApi = fs.readFileSync(path.join(root, 'api/body-language-booking.js'), 'utf8');
assert.match(bookingApi, /MANUAL_PAYMENT_LINKS/);
assert.match(bookingApi, /payment_pending/);
assert.match(bookingApi, /manualVerification: true/);
assert.match(bookingApi, /BOOKING_CLOSES_AT/);
assert.match(bookingApi, /manual_confirmation_token/);
assert.match(bookingApi, /28 November 2026/);
assert.doesNotMatch(bookingApi, /14 November 2026/);

const reminderApi = fs.readFileSync(path.join(root, 'api/body-language-payment-reminders.js'), 'utf8');
assert.match(reminderApi, /CRON_SECRET/);
assert.match(reminderApi, /status='payment_pending'/);
assert.match(reminderApi, /28 November 2026/);
assert.doesNotMatch(reminderApi, /14 November 2026/);

const confirmationApi = fs.readFileSync(path.join(root, 'api/body-language-manual-confirm.js'), 'utf8');
assert.match(confirmationApi, /Zahlung zuordnen und Platz bestätigen/);
assert.match(confirmationApi, /confirmManualBooking/);

console.log('BODY LANGUAGE booking routes and payment-link configuration tests passed.');
