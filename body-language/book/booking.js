(() => {
  const locale = document.documentElement.lang === 'en' ? 'en' : 'de';
  const c = window.BodyLanguageBooking;
  const copy = locale === 'de' ? {
    tbc: 'Wird noch bestätigt', date: 'Termin', venue: 'Ort', duration: 'Dauer', price: 'Preis',
    select: 'Weiter zur Anmeldung', back: 'Zurück', review: 'Angaben prüfen', pay: 'Zahlungsweg fortsetzen',
    payment: 'Wähle nach deiner Anmeldung, ob du online über PayPal oder Karte zahlst oder bar im Clever Fit Amberg-Kümmersbruck. Dein Platz wird bestätigt, sobald wir die Zahlung deiner Anmeldung zugeordnet haben.',
    required: 'Bitte fülle die markierten Pflichtfelder aus und wähle maximal drei Fokusbereiche.',
    privacy: 'Ich habe die Datenschutzhinweise gelesen. *', terms: 'Ich akzeptiere die Teilnahmebedingungen. *',
    unavailable: 'Buchung wird vorbereitet', route: 'BODY LANGUAGE · Buchung', close: 'Anmeldungen und Zahlungen sind bis einschließlich 14. November 2026 möglich. Danach schließen die Buchungen – zwei Wochen vor dem Workshop.'
  } : {
    tbc: 'To be configured', date: 'Date & time', venue: 'Venue', duration: 'Duration', price: 'Price',
    select: 'Continue to booking', back: 'Back', review: 'Review your details', pay: 'Continue with payment',
    payment: 'After registering, choose whether to pay online via PayPal or card, or in cash at Clever Fit Amberg-Kümmersbruck. Your place is confirmed once we match the payment to your booking.',
    required: 'Please complete the required fields and choose no more than three focus areas.',
    privacy: 'I have read the privacy information. *', terms: 'I accept the participation terms. *',
    unavailable: 'Booking is being prepared', route: 'BODY LANGUAGE · Booking', close: 'Bookings and payments are open through 14 November 2026. They close two weeks before the workshop.'
  };
  const $ = s => document.querySelector(s);
  const eventDate = c.date && c.start_time ? `${new Intl.DateTimeFormat(locale,{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${c.date}T12:00:00`))} · ${c.start_time}${c.end_time ? `–${c.end_time}` : ''}` : copy.tbc;
  $('#event-date').textContent = eventDate;
  $('#event-venue').textContent = c.venue_name || copy.tbc;
  $('#event-duration').textContent = '90–120 min';
  const money = value => new Intl.NumberFormat(locale,{style:'currency',currency:c.currency}).format(value);
  $('#event-price').textContent = c.prices ? `${money(c.prices.member_single)} ${locale==='de'?'Mitglied · ':'member · '}${money(c.prices.non_member_single)} ${locale==='de'?'regulär':'regular'}` : (c.price ? money(c.price) : copy.tbc);
  document.querySelectorAll('[data-payment-note]').forEach(el => { el.textContent = copy.payment; });
  document.querySelectorAll('[data-booking-close]').forEach(el => { el.textContent = copy.close; });
  if (!document.querySelector('[data-booking-close]')) {
    const notice = document.createElement('p'); notice.className = 'notice'; notice.dataset.bookingClose = ''; notice.textContent = copy.close;
    document.querySelector('.booking-card').querySelector('[data-payment-note]').before(notice);
  }
  $('#privacy-label').textContent = copy.privacy;
  $('#terms-label').textContent = copy.terms;
  if (c.terms_url) {
    const termsLink = document.createElement('a');
    termsLink.href = c.terms_url;
    termsLink.textContent = locale === 'de' ? 'Teilnahmebedingungen' : 'participation terms';
    $('#terms-label').append(' ', termsLink);
  }
  // One draft survives a language switch; labels change, the participant's choices do not.
  const storageKey = 'body-language-booking-draft';
  const form = $('#intake');
  const saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
  Object.entries(saved).forEach(([key,value]) => form.querySelectorAll(`[name="${key}"]`).forEach(el => { if (el.type === 'checkbox') el.checked = Array.isArray(value) ? value.includes(el.value) : Boolean(value); else if (el.type === 'radio') el.checked = el.value === value; else el.value = value; }));
  function save(){ const data={}; new FormData(form).forEach((v,k)=>{ if(data[k]) data[k]=[].concat(data[k],v); else data[k]=v; }); form.querySelectorAll('input[type=checkbox]').forEach(el=>{ if(!el.checked && !data[el.name]) data[el.name]=[]; }); sessionStorage.setItem(storageKey,JSON.stringify(data)); }
  const healthInputs = () => [...form.querySelectorAll('input[name="health_notes"]:checked')];
  const healthConsentRow = $('#health-consent-row');
  const healthConsent = form.elements.health_consent;
  function updateHealthConsent(){
    const relevant = healthInputs().some(input => input.value !== 'none') || form.elements.health_detail.value.trim();
    healthConsentRow.hidden = !relevant;
    if (!relevant) healthConsent.checked = false;
  }
  form.addEventListener('input',()=>{ updateHealthConsent(); save(); });
  form.addEventListener('change',event=>{
    if (event.target.name === 'health_notes') {
      const none = form.querySelector('input[name="health_notes"][value="none"]');
      if (event.target.value === 'none' && event.target.checked) healthInputs().filter(input => input !== event.target).forEach(input => input.checked = false);
      if (event.target.value !== 'none' && event.target.checked) none.checked = false;
    }
    updateHealthConsent(); save();
  });
  updateHealthConsent();
  // Preserve the visitor's reading position as they move through the form.
  function show(n){ document.querySelectorAll('.form-step').forEach((el,i)=>el.hidden=i!==n); document.querySelectorAll('.progress span').forEach((el,i)=>el.classList.toggle('active',i===n)); }
  $('#to-intake').addEventListener('click',()=>show(1));
  $('#to-overview').addEventListener('click',()=>show(0));
  $('#to-review').addEventListener('click',()=>{ const chosen=form.querySelectorAll('input[name="exploration_areas"]:checked').length; const reasons=form.querySelectorAll('input[name="reasons"]:checked').length; const healthRelevant=healthInputs().some(input=>input.value!=='none') || form.elements.health_detail.value.trim(); if(!form.reportValidity() || !reasons || chosen<1 || chosen>3 || (healthRelevant && !healthConsent.checked)){ $('#form-error').textContent=copy.required; return; } $('#form-error').textContent=''; save(); const data=new FormData(form); const labels=locale==='de'?{name:'Name',email:'E-Mail',phone:'Telefon / WhatsApp',birth_date:'Geburtsdatum',movement_context:'Bewegung / Training'}:{name:'Name',email:'Email',phone:'Phone / WhatsApp',birth_date:'Date of birth',movement_context:'Movement / training'}; $('#review-content').replaceChildren(...Object.keys(labels).map(key=>{const p=document.createElement('p');p.textContent=`${labels[key]}: ${data.get(key)||'—'}`;return p;})); show(2); });
  $('#to-intake-back').addEventListener('click',()=>show(1));
  const paymentOptions = locale === 'de' ? [
    ['member_single','Clever Fit Mitglied · 1 Person'], ['member_pair','Zwei Clever Fit Mitglieder · gemeinsam'],
    ['non_member_single','Kein Clever Fit Mitglied · 1 Person'], ['member_plus_non_member','Eine:r mit, eine:r ohne Clever Fit Mitgliedschaft'],
    ['non_member_pair','Zwei Personen ohne Clever Fit Mitgliedschaft']
  ] : [
    ['member_single','Clever Fit member · 1 person'], ['member_pair','Two Clever Fit members · together'],
    ['non_member_single','Not a Clever Fit member · 1 person'], ['member_plus_non_member','One member and one non-member'],
    ['non_member_pair','Two non-members']
  ];
  const choice = document.createElement('fieldset'); choice.className='group';
  const legend=document.createElement('legend'); legend.textContent=locale==='de'?'Wähle deine Zahlungsoption':'Choose your payment option'; choice.append(legend);
  paymentOptions.forEach(([key,label])=>{ const item=document.createElement('label');item.className='option'; const input=document.createElement('input');input.type='radio';input.name='payment_option';input.value=key;input.disabled=!c.payment_links?.[key]; const text=document.createElement('span');text.textContent= c.payment_links?.[key] ? `${label} · ${c.prices?.[key] ? money(c.prices[key]) : copy.tbc}` : `${label} · ${copy.tbc}`; item.append(input,text);choice.append(item); });
  $('#payment').before(choice);
  const paymentRoute = document.createElement('fieldset'); paymentRoute.className='group';
  const routeLegend=document.createElement('legend'); routeLegend.textContent=locale==='de'?'Wie möchtest du bezahlen?':'How would you like to pay?'; paymentRoute.append(routeLegend);
  const routes = locale === 'de' ? [
    ['paypal_link','Online über PayPal oder Karte','Apple Pay wird angezeigt, wenn PayPal es für deine Zahlung anbieten kann.'],
    ['studio_cash','Bar im Clever Fit Amberg-Kümmersbruck','Bitte nenne im Studio deinen vollständigen Namen und deine Buchungsreferenz.']
  ] : [
    ['paypal_link','Online via PayPal or card','Apple Pay is shown only when PayPal can offer it for your payment.'],
    ['studio_cash','Cash at Clever Fit Amberg-Kümmersbruck','Please give your full name and booking reference at the studio.']
  ];
  routes.forEach(([value,label,hint])=>{ const item=document.createElement('label');item.className='option'; const input=document.createElement('input');input.type='radio';input.name='payment_method';input.value=value;input.required=true; const text=document.createElement('span');text.textContent=label; const detail=document.createElement('small');detail.textContent=hint; detail.style.display='block'; detail.style.margin='4px 0 0 26px'; item.append(input,text,detail);paymentRoute.append(item); });
  $('#payment').before(paymentRoute);
  const closed = c.booking_closes_at && new Date() > new Date(c.booking_closes_at);
  if (closed) { $('#to-intake').disabled=true; $('#to-intake').textContent=locale==='de'?'Buchung geschlossen':'Booking closed'; }
  $('#payment').disabled=false;
  $('#payment').addEventListener('click',async()=>{ 
    if(!$('#privacy').checked || !$('#terms').checked){ $('#review-error').textContent=copy.required; return; }
    const option=choice.querySelector('input:checked');
    const route=paymentRoute.querySelector('input:checked');
    if(!option || !route){ $('#review-error').textContent=locale==='de'?'Bitte wähle Preisoption und Zahlungsweg.':'Please select a price option and payment route.'; return; }
    if(!['booking_open','manual_verification'].includes(c.status)){ $('#review-error').textContent=locale==='de'?'Die Buchung wird gerade vorbereitet.':'Booking is being prepared.'; return; }
    const button=$('#payment');
    button.disabled=true;
    button.textContent=route.value==='studio_cash' ? (locale==='de'?'Buchung wird vorbereitet …':'Preparing booking …') : (locale==='de'?'PayPal wird geöffnet …':'Opening PayPal …');
    try{
      const payload=Object.fromEntries(new FormData(form).entries());
      payload.reasons=[...form.querySelectorAll('input[name="reasons"]:checked')].map(input=>input.value);
      payload.exploration_areas=[...form.querySelectorAll('input[name="exploration_areas"]:checked')].map(input=>input.value);
      payload.health_notes=healthInputs().map(input=>input.value);
      payload.payment_option=option.value;
      payload.payment_method=route.value;
      payload.locale=locale;
      payload.payment_mode=c.status;
      const response=await fetch('/api/body-language-booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(result.message||'payment_unavailable');
      sessionStorage.setItem('body-language-booking-id',result.bookingId||'');
      if (result.approvalUrl) window.location.assign(result.approvalUrl);
      else { $('#review-error').textContent=locale==='de'?'Danke. Wir haben dir die Hinweise zur Barzahlung im Studio per E-Mail gesendet. Dein Platz wird nach Zuordnung der Zahlung bestätigt.':'Thank you. We have emailed your cash-payment instructions for the studio. Your place is confirmed once payment is matched.'; button.hidden=true; }
    }catch(error){
      $('#review-error').textContent=locale==='de'?'Die Zahlung konnte gerade nicht sicher vorbereitet werden. Bitte versuche es erneut oder schreibe uns an hello@human-architecture.info.':'Secure payment could not be prepared right now. Please try again or contact hello@human-architecture.info.';
      button.disabled=false;
      button.textContent=copy.pay;
    }
  });
})();
