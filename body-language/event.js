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
  const summary = form.querySelector('#bl-price-summary');
  const status = form.querySelector('#bl-form-status');
  const submit = form.querySelector('button[type=submit]');
  const member = () => form.querySelector('input[name=member]:checked')?.value;
  const friend = () => form.querySelector('input[name=friend]:checked')?.value;
  const friendMember = () => form.querySelector('input[name=friendMember]:checked')?.value;
  const euro = cents => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(cents/100);
  function update() {
    const together = friend() === 'yes';
    friendFields.hidden = !together;
    friendFields.querySelectorAll('[data-friend-required]').forEach(el => { el.required = together; if (!together && el.type === 'radio') el.checked = false; });
    if (!together) friendFields.querySelectorAll('input:not([type=radio])').forEach(el => { el.value = ''; });
    try {
      const price = BodyLanguagePrice.calculate(member(),friend(),friendMember());
      summary.innerHTML = `<div><span>BODY LANGUAGE · 28.11.2026 · 15:00–17:00<br>Clever Fit Kümmersbruck</span></div><div><span>Dein Preis${together?' · 10 % Rabatt':''}</span><strong>${euro(price.first)}</strong></div>${together?`<div><span>Preis Freund:in · 10 % Rabatt</span><strong>${euro(price.second)}</strong></div><div class="bl-total"><span>Gesamt für zwei Personen</span><strong>${euro(price.total)}</strong></div>`:''}<p>Dies ist eine Anfrage. Noch keine Zahlung und keine bestätigte Platzreservierung.</p>`;
    } catch (_) {
      summary.innerHTML = '<p>Wähle deinen Mitgliedsstatus und ob du dich mit einer weiteren Person anmeldest. Danach siehst du den genauen Preis.</p>';
    }
  }
  form.addEventListener('change', update);
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
      if (!response.ok || !result.ok) throw new Error('Submission failed');
      form.hidden=true;
      const success=document.querySelector('#bl-request-success');
      success.hidden=false; success.focus();
    } catch (_) {
      status.textContent='Die Anfrage konnte nicht gesendet werden. Bitte schreibe an hello@human-architecture.info.';
      submit.disabled=false; submit.textContent='Anmeldung anfragen';
    }
  });
})();
