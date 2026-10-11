const assert = require('node:assert/strict');
const { received, confirmed } = require('../body-language/booking-email');

const booking = {participantName: 'Mara', paymentLabel: 'Clever Fit Mitglied · 1 Person', amount: '29,00 €', locale: 'de'};
assert.match(received(booking).subject, /Buchungsdaten/);
assert.match(received(booking).text, /noch keine Buchungsbestätigung/);
assert.match(confirmed(booking).subject, /bestätigt/);
assert.match(confirmed(booking).text, /28\. November 2026/);
assert.match(confirmed({...booking, locale: 'en'}).text, /payment has been verified/);
console.log('BODY LANGUAGE booking email templates passed.');
