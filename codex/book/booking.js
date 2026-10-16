(() => {
  const offers = { current_sky: 'The Current Sky · €29', personal_pattern: 'The Personal Pattern · €49', astrological_foundations: 'Astrological Foundations · €59', codex_2027_entry: 'Codex 2027 · €222' };
  const params = new URLSearchParams(location.search); const key = params.get('offer');
  const form = document.querySelector('#booking-form'); const message = document.querySelector('#form-message');
  if (!offers[key]) { form.hidden = true; message.textContent = 'Please choose one of the introductory readings first.'; return; }
  const promo = (params.get('promo') || '').toUpperCase();
  if (key === 'codex_2027_entry') {
    const label = document.createElement('label');
    label.innerHTML = 'October code <small>(optional)</small><input name="promo_code" autocomplete="off" maxlength="40">';
    form.querySelector('.cr-check').before(label);
  }
  const promoField = form.querySelector('[name="promo_code"]');
  if (promoField) promoField.value = promo;
  document.querySelector('#offer-name').textContent = key === 'codex_2027_entry' && promo === 'MELMIHIRA27' ? 'Codex 2027 · €111 October entry' : offers[key];
  if (params.get('payment') === 'cancelled') message.textContent = 'The payment was cancelled. You can try again when you are ready.';
  if (params.get('payment') === 'error') message.textContent = 'The payment could not be verified. Please try again or contact us.';
  const submit = form.querySelector('button');
  fetch('/api/body-language-booking?codex=status').then(response => response.json()).then(result => {
    if (result.available) return;
    submit.disabled = true;
    message.textContent = 'Secure checkout is being prepared. To request this reading, please contact hello@human-architecture.info.';
  }).catch(() => {
    submit.disabled = true;
    message.textContent = 'Secure checkout is not available right now. Please contact hello@human-architecture.info.';
  });
  form.addEventListener('submit', async event => {
    event.preventDefault(); message.textContent = 'Opening secure payment…';
    submit.disabled = true;
    try {
      const data = new FormData(form); const response = await fetch('/api/body-language-booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codex_booking: true, name: data.get('name'), email: data.get('email'), privacy: data.get('privacy') === 'on', promo_code: data.get('promo_code'), offer: key }) });
      const result = await response.json(); if (!response.ok || !result.approvalUrl) throw new Error(result.message || 'Payment could not be opened.');
      location.assign(result.approvalUrl);
    } catch (error) {
      message.textContent = error.message === 'Direct booking is not open yet. Please contact us at hello@human-architecture.info.'
        ? 'Secure checkout is being prepared. To request this reading, please contact hello@human-architecture.info.'
        : error.message;
      submit.disabled = false;
    }
  });
})();
