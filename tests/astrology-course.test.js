const assert = require('node:assert/strict');
const Module = require('node:module');

const sent = [];
const original = Module._load;
Module._load = function (request, ...args) {
  if (request === 'resend') return {Resend: class { emails = {send: async (data) => { sent.push(data); return {data:{id:`test-${sent.length}`},error:null}; }}; }};
  return original.call(this, request, ...args);
};
const handler = require('../api/astrology-course');
Module._load = original;

const response = () => ({code:200,headers:{},setHeader(key,value){this.headers[key]=value;return this;},status(code){this.code=code;return this;},json(body){this.body=body;return this;}});
const solo = {bookingOption:'solo',firstName:'Test',lastName:'Person',email:'test@example.org',birthDate:'1990-01-01',birthTime:'12:30',birthTimeUnknown:false,birthPlace:'Berlin, Germany',privacy:true,language:'de'};

(async () => {
  process.env.RESEND_API_KEY = 'test-key';
  process.env.ASTROLOGY_PAYMENT_URL_SOLO = 'https://pay.example.org/solo';
  process.env.ASTROLOGY_PAYMENT_URL_PAIR = 'https://pay.example.org/pair';

  let res = response();
  await handler({method:'POST',body:solo},res);
  assert.equal(res.code,200);
  assert.equal(res.body.paymentConfigured,true);
  assert.equal(res.body.paymentUrl,'https://pay.example.org/solo');
  assert.equal(sent.length,2);
  assert.match(sent[0].text,/220,00 €/);
  assert.match(sent[1].text,/Platz ist gesichert, sobald die Zahlung/);

  res = response();
  await handler({method:'POST',body:{...solo,bookingOption:'pair',friendFirstName:'Second',friendLastName:'Person',friendEmail:'second@example.org',friendBirthDate:'1991-02-02',friendBirthTimeUnknown:true,friendBirthPlace:'Vienna, Austria',friendConsent:true}},res);
  assert.equal(res.code,200);
  assert.equal(res.body.paymentUrl,'https://pay.example.org/pair');
  assert.equal(sent.length,5);
  assert.match(sent[2].text,/360,00 € gesamt · 180,00 € p. P./);
  assert.match(sent[2].text,/Birth data 2: 1991-02-02 · unbekannt · Vienna, Austria/);

  res = response();
  await handler({method:'POST',body:{...solo,bookingOption:'pair'}},res);
  assert.equal(res.code,400);

  res = response();
  await handler({method:'POST',body:{...solo,birthDate:'01.01.1990'}},res);
  assert.equal(res.code,400);

  delete process.env.RESEND_API_KEY;
  res = response();
  await handler({method:'POST',body:solo},res);
  assert.equal(res.code,503);
  console.log('Astrology course registration, pair pricing, consent and payment-link tests passed.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
