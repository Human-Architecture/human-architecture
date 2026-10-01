const assert=require('node:assert/strict');
const Module=require('node:module');
const {calculate}=require('../body-language/price');
assert.deepEqual(calculate('yes','no'),{first:2900,second:0,total:2900,discountApplied:false});
assert.deepEqual(calculate('no','no'),{first:4900,second:0,total:4900,discountApplied:false});
assert.deepEqual(calculate('yes','yes','yes'),{first:2610,second:2610,total:5220,discountApplied:true});
assert.deepEqual(calculate('no','yes','no'),{first:4410,second:4410,total:8820,discountApplied:true});
assert.deepEqual(calculate('yes','yes','no'),{first:2610,second:4410,total:7020,discountApplied:true});
assert.deepEqual(calculate('no','yes','yes'),{first:4410,second:2610,total:7020,discountApplied:true});
assert.throws(()=>calculate('yes','yes'),/Invalid/);
const sent=[];const original=Module._load;
Module._load=function(request,...args){if(request==='resend')return {Resend:class {emails={send:async data=>{sent.push(data);return {data:{id:`test-${sent.length}`},error:null};}}}};return original.call(this,request,...args)};
const handler=require('../api/body-language-registration');
Module._load=original;
function response(){return {code:200,headers:{},setHeader(k,v){this.headers[k]=v;return this},status(n){this.code=n;return this},json(v){this.body=v;return this}}}
const base={first:'Mel',last:'Test',email:'mel@example.org',member:'yes',friend:'no',consent:true};
(async()=>{
  process.env.RESEND_API_KEY='test-key';
  let res=response();await handler({method:'POST',body:base},res);assert.equal(res.code,200);assert.equal(res.body.totalCents,2900);assert.equal(res.body.status,'request_received');assert.equal(sent.length,2);assert.equal(sent[0].to[0],'hello@human-architecture.info');assert.match(sent[0].text,/Keine Zahlung eingegangen/);assert.match(sent[1].text,/keine bestätigte Buchung/);
  res=response();await handler({method:'POST',body:{...base,friend:'yes',friendFirst:'Alex',friendLast:'Sample',friendEmail:'alex@example.org',friendMember:'no',friendConsent:true,expectedTotalCents:1}},res);assert.equal(res.code,200);assert.equal(res.body.totalCents,7020);assert.match(sent[2].text,/70,20/);
  res=response();await handler({method:'POST',body:{...base,friend:'yes',friendFirst:'Alex',friendLast:'Sample',friendEmail:'alex@example.org',friendMember:'no'}},res);assert.equal(res.code,400);
  res=response();await handler({method:'POST',body:{...base,first:'A'.repeat(181)}},res);assert.equal(res.code,400);
  res=response();await handler({method:'GET',body:{}},res);assert.equal(res.code,405);
  delete process.env.RESEND_API_KEY;res=response();await handler({method:'POST',body:base},res);assert.equal(res.code,503);
  console.log('BODY LANGUAGE pricing and registration request tests passed');
})().catch(e=>{console.error(e);process.exitCode=1});
