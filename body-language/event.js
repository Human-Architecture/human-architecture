(() => {
  const event = document.querySelector('[data-body-language-event]');
  const form = document.querySelector('#bl-registration');
  if (!event || !form) return;
  const expired = Date.now() >= Date.parse('2026-11-28T17:00:00+01:00');
  if (expired) {
    document.querySelectorAll('[data-event-promo]').forEach(el => { el.hidden = true; });
    document.querySelector('.bl-form-layout').hidden = true;
    document.querySelector('#bl-event-title').textContent='Weitere Workshops entdecken.';
    document.querySelector('#bl-event-intro').textContent='Dieser Termin ist vorbei. BODY LANGUAGE bleibt als Workshopformat verfügbar; frag nach dem nächsten Termin.';
    document.querySelector('#bl-event-closed').hidden = false;
    return;
  }
  const friendFields = form.querySelector('#bl-friend-fields');
  const summary = document.querySelector('#bl-price-summary');
  const status = form.querySelector('#bl-form-status');
  const submit = form.querySelector('button[type=submit]');
  const member = () => form.querySelector('input[name=member]:checked')?.value;
  const friend = () => form.querySelector('input[name=friend]:checked')?.value;
  const friendMember = () => form.querySelector('input[name=friendMember]:checked')?.value;
  const euro = cents => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(cents/100);
  function row(label, value, className) {
    const div=document.createElement('div');
    if(className) div.className=className;
    const name=document.createElement('span'); name.textContent=label;
    div.append(name);
    if(value!==undefined){const amount=document.createElement('strong'); amount.textContent=value; div.append(amount);}
    summary.append(div);
  }
  function update() {
    const together = friend() === 'yes';
    friendFields.hidden = !together;
    friendFields.querySelectorAll('[data-friend-required]').forEach(el => { el.required = together; if (!together && el.type === 'radio') el.checked = false; });
    if (!together) friendFields.querySelectorAll('input:not([type=radio])').forEach(el => { el.value = ''; });
    summary.replaceChildren();
    row('BODY LANGUAGE · 28. November 2026 · 15:00–17:00 Uhr · Clever Fit Kümmersbruck');
    try {
      const price = BodyLanguagePrice.calculate(member(),friend(),friendMember());
      const firstName=[form.elements.first.value.trim(),form.elements.last.value.trim()].filter(Boolean).join(' ');
      row(`Teilnehmer 1${firstName?' · '+firstName:''} · ${member()==='yes'?'Clever Fit Mitglied':'Extern'}`,euro(price.first));
      if(together){
        const secondName=[form.elements.friendFirst.value.trim(),form.elements.friendLast.value.trim()].filter(Boolean).join(' ');
        row(`Teilnehmer 2${secondName?' · '+secondName:''} · ${friendMember()==='yes'?'Clever Fit Mitglied':'Extern'}`,euro(price.second));
        row('Bring-a-Friend Rabatt · –10 % je Teilnehmer');
        row('GESAMT',euro(price.total),'bl-total');
      }else row('GESAMT',euro(price.total),'bl-total');
    } catch (_) {
      const prompt=document.createElement('p');prompt.textContent='Wähle deinen Mitgliedsstatus und ob du dich mit einer weiteren Person anmeldest. Danach siehst du den genauen Preis.';summary.append(prompt);
    }
    const notice=document.createElement('p');notice.textContent='Dies ist eine Anfrage. Noch keine Zahlung und keine bestätigte Platzreservierung.';summary.append(notice);
  }
  form.addEventListener('change', update);
  form.addEventListener('input', e => { if (['first','last','friendFirst','friendLast'].includes(e.target.name)) update(); });
  update();
  form.addEventListener('submit', async e => {
    e.preventDefault(); status.textContent = '';
    if (!form.reportValidity()) return;
    let price;
    try { price=BodyLanguagePrice.calculate(member(),friend(),friendMember()); }
    catch (_) { status.textContent='Bitte wähle Mitgliedsstatus und Anmeldeart aus.'; return; }
    const data=Object.fromEntries(new FormData(form).entries());
    data.expectedTotalCents=price.total;
    data.consent=form.elements.consent.checked;
    data.friendConsent=form.elements.friendConsent.checked;
    submit.disabled=true; submit.textContent='Wird gesendet …';
    try {
      const response=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const result=await response.json();
      if (!response.ok || !result.ok) throw new Error(response.status===400 ? 'validation' : 'delivery');
      form.hidden=true;
      const success=document.querySelector('#bl-request-success');
      success.hidden=false; success.focus();
    } catch (error) {
      status.replaceChildren();
      const message=document.createElement('span');
      message.textContent=error.message==='validation' ? 'Bitte prüfe deine Angaben und versuche es erneut. ' : 'Die Anfrage wurde nicht bestätigt. Bitte versuche es erneut oder schreib uns direkt: ';
      const link=document.createElement('a');link.href='mailto:hello@human-architecture.info?subject=BODY%20LANGUAGE%20%7C%2028.11.2026%20Anmeldung';link.textContent='hello@human-architecture.info';
      status.append(message,link);
      status.focus();
      submit.disabled=false; submit.textContent='Anfrage an Human Architecture senden';
    }
  });
})();
