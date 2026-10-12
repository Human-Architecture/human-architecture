const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'body-language/booking-config.js'), 'utf8'), context);
const config = context.window.BodyLanguageBooking;

assert.equal(config.status, 'configuration_required');
assert.equal(config.payment_provider, 'PayPal');
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

console.log('BODY LANGUAGE booking routes and payment-link configuration tests passed.');
