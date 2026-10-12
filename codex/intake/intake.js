(() => {
  const params = new URLSearchParams(location.search); const booking = params.get('booking'); const token = params.get('token');
  const status = document.querySelector('#status'); const area = document.querySelector('#intake-area'); const form = document.querySelector('#intake-form'); const message = document.querySelector('#form-message');
  if (!booking || !token) { status.textContent = 'This private intake link is incomplete. Please use the link from your email.'; return; }
  history.replaceState({}, '', `/codex/intake/?booking=${encodeURIComponent(booking)}`);
  const access = () => `booking=${encodeURIComponent(booking)}&token=${encodeURIComponent(token)}`;
  fetch(`/api/body-language-paypal-return?codex=intake&${access()}`).then(async response => ({ response, result: await response.json() })).then(({ response, result }) => {
    if (!response.ok) throw new Error(result.message || 'This link is not available.');
    if (result.submitted) { status.textContent = 'Your private intake has already been received. Thank you.'; return; }
    status.textContent = 'Complete the details for your selected reading.'; area.hidden = false;
    if (result.offer === 'personal_pattern') { const field = document.querySelector('#theme-field'); field.hidden = false; field.querySelectorAll('input').forEach(input => input.required = true); }
  }).catch(error => { status.textContent = error.message; });
  form.addEventListener('submit', async event => {
    event.preventDefault(); const submit = form.querySelector('button'); submit.disabled = true; message.textContent = 'Saving your private intake…';
    try { const data = new FormData(form); const response = await fetch('/api/body-language-paypal-return?codex=intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ booking, token, birthDate: data.get('birthDate'), birthPlace: data.get('birthPlace'), birthTime: data.get('birthTime'), theme: data.get('theme'), question: data.get('question'), dataConsent: data.get('dataConsent') === 'on' }) }); const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Your intake could not be saved.'); form.hidden = true; message.textContent = 'Thank you. Your private intake has been received.'; } catch (error) { message.textContent = error.message; submit.disabled = false; }
  });
})();
