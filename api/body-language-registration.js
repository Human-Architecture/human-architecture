const {Resend}=require('resend');
const {calculate}=require('../body-language/price');
const clean=(value,max=180)=>typeof value==='string'?value.replace(/[\r\n\t]+/g,' ').trim().slice(0,max):'';
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const euro=cents=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(cents/100);
const cutoff=Date.parse('2026-11-28T17:00:00+01:00');
module.exports=async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false});}
  if(Date.now()>=cutoff)return res.status(410).json({ok:false,error:'Event closed'});
  const b=req.body||{};
  if(b.website)return res.status(200).json({ok:true});
  const raw=[b.first,b.last,b.email,b.phone,b.friendFirst,b.friendLast,b.friendEmail];
  if(raw.some(v=>typeof v==='string'&&v.length>180))return res.status(400).json({ok:false,error:'Field too long'});
  const first=clean(b.first),last=clean(b.last),email=clean(b.email),phone=clean(b.phone);
  const friendFirst=clean(b.friendFirst),friendLast=clean(b.friendLast),friendEmail=clean(b.friendEmail);
  if(!first||!last||!emailPattern.test(email)||b.consent!==true||!['yes','no'].includes(b.member)||!['yes','no'].includes(b.friend))return res.status(400).json({ok:false,error:'Required fields missing'});
  if(b.friend==='yes'&&(!friendFirst||!friendLast||!emailPattern.test(friendEmail)||friendEmail.toLowerCase()===email.toLowerCase()||b.friendConsent!==true))return res.status(400).json({ok:false,error:'Friend details missing'});
  let amount;
  try{amount=calculate(b.member,b.friend,b.friendMember);}catch(_){return res.status(400).json({ok:false,error:'Invalid price selection'});}
  if(!process.env.RESEND_API_KEY)return res.status(503).json({ok:false,error:'Delivery unavailable'});
  const lines=[
    'BODY LANGUAGE – ANMELDEANFRAGE (KEINE RESERVIERUNG)',
    '28.11.2026 · 15:00–17:00 · Clever Fit Kümmersbruck',
    `Person 1: ${first} ${last} · ${email} · ${phone||'kein Telefon'} · Clever Fit Mitglied: ${b.member==='yes'?'Ja':'Nein'} · ${euro(amount.first)}`,
    ...(b.friend==='yes'?[`Person 2: ${friendFirst} ${friendLast} · ${friendEmail} · Clever Fit Mitglied: ${b.friendMember==='yes'?'Ja':'Nein'} · ${euro(amount.second)}`]:[]),
    `Bring a Friend: ${b.friend==='yes'?'Ja, 10 % Rabatt pro Person':'Nein'}`,
    `Gesamtbetrag bei Annahme: ${euro(amount.total)}`,
    'Zustimmung zur Kontaktaufnahme / Datenschutzhinweis: ja',
    `Einverständnis für Daten der zweiten Person: ${b.friend==='yes'?'ja':'nicht zutreffend'}`,
    'Keine Zahlung eingegangen. Kein Platz bestätigt.'
  ];
  try{
    const resend=new Resend(process.env.RESEND_API_KEY);
    const notification=await resend.emails.send({from:'Human Architecture Website <website@human-architecture.info>',to:['hello@human-architecture.info'],replyTo:email,subject:`BODY LANGUAGE · Anmeldeanfrage · ${first} ${last}`,text:lines.join('\n\n')});
    if(notification.error)throw new Error(notification.error.message||'Notification failed');
    const acknowledgement=await resend.emails.send({from:'Human Architecture <hello@human-architecture.info>',to:[email],replyTo:'hello@human-architecture.info',subject:'BODY LANGUAGE: Deine Anfrage ist eingegangen',text:`Hallo ${first},\n\nwir haben deine Anfrage für BODY LANGUAGE am 28. November 2026, 15:00–17:00 Uhr bei Clever Fit Kümmersbruck erhalten.\n\nVorgemerkte Personen: ${b.friend==='yes'?`${first} ${last} und ${friendFirst} ${friendLast}`:`${first} ${last}`}\nAngezeigter Gesamtbetrag: ${euro(amount.total)}. Es wurde noch nichts bezahlt. Deine Anfrage ist keine bestätigte Buchung oder Platzreservierung. Wir melden uns mit den nächsten Schritten.\n\nHuman Architecture®\nhello@human-architecture.info`});
    if(acknowledgement.error)console.error('BODY LANGUAGE acknowledgement failed',acknowledgement.error);
    return res.status(200).json({ok:true,status:'request_received',totalCents:amount.total,acknowledgementSent:!acknowledgement.error});
  }catch(error){console.error('BODY LANGUAGE registration delivery failed',error);return res.status(500).json({ok:false,error:'Delivery failed'});}
};
