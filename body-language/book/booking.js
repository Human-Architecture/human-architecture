(() => {
  const locale = document.documentElement.lang === 'en' ? 'en' : 'de';
  const c = window.BodyLanguageBooking;
  const copy = locale === 'de' ? {
    tbc: 'Wird noch bestätigt', date: 'Termin', venue: 'Ort', duration: 'Dauer', price: 'Preis',
    select: 'Weiter zur Anmeldung', back: 'Zurück', review: 'Angaben prüfen', pay: 'Weiter zur Zahlung',
    payment: 'Dein Platz wird erst nach erfolgreich verifizierter Zahlung bestätigt. Eine Zahlung allein garantiert keinen Platz, wenn das Event zwischenzeitlich ausgebucht ist.',
    required: 'Bitte fülle die markierten Pflichtfelder aus und wähle maximal drei Fokusbereiche.',
    privacy: 'Ich habe die Datenschutzhinweise gelesen. *', terms: 'Ich akzeptiere die Teilnahmebedingungen. *',
    unavailable: 'Buchung wird vorbereitet', route: 'BODY LANGUAGE · Buchung'
  } : {
    tbc: 'To be configured', date: 'Date & time', venue: 'Venue', duration: 'Duration', price: 'Price',
    select: 'Continue to booking', back: 'Back', review: 'Review your details', pay: 'Continue to payment',
    payment: 'Your place is confirmed only after payment has been successfully verified. Payment alone does not guarantee a place if the event becomes sold out in the meantime.',
    required: 'Please complete the required fields and choose no more than three focus areas.',
    privacy: 'I have read the privacy information. *', terms: 'I accept the participation terms. *',
    unavailable: 'Booking is being prepared', route: 'BODY LANGUAGE · Booking'
  };
  const $ = s => document.querySelector(s);
  const eventDate = c.date && c.start_time ? `${new Intl.DateTimeFormat(locale,{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${c.date}T12:00:00`))} · ${c.start_time}${c.end_time ? `–${c.end_time}` : ''}` : copy.tbc;
  $('#event-date').textContent = eventDate;
  $('#event-venue').textContent = c.venue_name || copy.tbc;
  $('#event-duration').textContent = '90–120 min';
  const money = value => new Intl.NumberFormat(locale,{style:'currency',currency:c.currency}).format(value);
  $('#event-price').textContent = c.prices ? `${money(c.prices.member_single)} ${locale==='de'?'Mitglied · ':'member · '}${money(c.prices.non_member_single)} ${locale==='de'?'regulär':'regular'}` : (c.price ? money(c.price) : copy.tbc);
  document.querySelectorAll('[data-payment-note]').forEach(el => { el.textContent = copy.payment; });
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
  Object.entries(saved).forEach(([key,value]) => form.querySelectorAll(`[name="${key}"]`).forEach(el => { if (el.type === 'checkbox') el.checked = Array.isArray(value) ? value.includes(el.value) : Boolean(value); else el.value = value; }));
  function save(){ const data={}; new FormData(form).forEach((v,k)=>{ if(data[k]) data[k]=[].concat(data[k],v); else data[k]=v; }); form.querySelectorAll('input[type=checkbox]').forEach(el=>{ if(!el.checked && !data[el.name]) data[el.name]=[]; }); sessionStorage.setItem(storageKey,JSON.stringify(data)); }
  form.addEventListener('input',save); form.addEventListener('change',save);
  // Preserve the visitor's reading position as they move through the form.
  function show(n){ document.querySelectorAll('.form-step').forEach((el,i)=>el.hidden=i!==n); document.querySelectorAll('.progress span').forEach((el,i)=>el.classList.toggle('active',i===n)); }
  $('#to-intake').addEventListener('click',()=>show(1));
  $('#to-overview').addEventListener('click',()=>show(0));
  $('#to-review').addEventListener('click',()=>{ const chosen=form.querySelectorAll('input[name="exploration_areas"]:checked').length; const reasons=form.querySelectorAll('input[name="reasons"]:checked').length; if(!form.reportValidity() || !reasons || chosen<1 || chosen>3){ $('#form-error').textContent=copy.required; return; } $('#form-error').textContent=''; save(); const data=new FormData(form); $('#review-content').replaceChildren(...['name','email','movement_context'].map(key=>{const p=document.createElement('p');p.textContent=`${key.replace('_',' ')}: ${data.get(key)||'—'}`;return p;})); show(2); });
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
  $('#payment').disabled=false;
  $('#payment').addEventListener('click',async()=>{ 
    if(!$('#privacy').checked || !$('#terms').checked){ $('#review-error').textContent=copy.required; return; }
    const option=choice.querySelector('input:checked');
    if(!option){ $('#review-error').textContent=locale==='de'?'Bitte wähle eine verfügbare Zahlungsoption.':'Please select an available payment option.'; return; }
    if(c.status!=='booking_open'){ $('#review-error').textContent=locale==='de'?'Die sichere Buchung wird gerade freigeschaltet.':'Secure booking is being activated.'; return; }
    const button=$('#payment');
    button.disabled=true;
    button.textContent=locale==='de'?'Sichere Zahlung wird vorbereitet …':'Preparing secure payment …';
    try{
      const payload=Object.fromEntries(new FormData(form).entries());
      payload.reasons=[...form.querySelectorAll('input[name="reasons"]:checked')].map(input=>input.value);
      payload.exploration_areas=[...form.querySelectorAll('input[name="exploration_areas"]:checked')].map(input=>input.value);
      payload.payment_option=option.value;
      payload.locale=locale;
      const response=await fetch('/api/body-language-booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok || !result.approvalUrl) throw new Error(result.message||'payment_unavailable');
      sessionStorage.setItem('body-language-booking-id',result.bookingId||'');
      window.location.assign(result.approvalUrl);
    }catch(error){
      $('#review-error').textContent=locale==='de'?'Die Zahlung konnte gerade nicht sicher vorbereitet werden. Bitte versuche es erneut oder schreibe uns an hello@human-architecture.info.':'Secure payment could not be prepared right now. Please try again or contact hello@human-architecture.info.';
      button.disabled=false;
      button.textContent=copy.pay;
    }
  });
})();
