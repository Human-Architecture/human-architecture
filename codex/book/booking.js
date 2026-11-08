(() => {
  const offers = { current_sky: { en: 'The Current Sky · €29', de: 'Current Sky · €29' }, personal_pattern: { en: 'The Personal Pattern · €49', de: 'Personal Pattern · €49' }, astrological_foundations: { en: 'Astrological Foundations · €59', de: 'Astrologische Grundlagen · €59' }, codex_2027_entry: { en: 'Codex 2027 · €222', de: 'Codex 2027 · €222' } };
  const params = new URLSearchParams(location.search); const key = params.get('offer'); const lang = params.get('lang') === 'de' ? 'de' : 'en'; const german = lang === 'de';
  const text = german ? { title: 'Sichere Codex-Buchung | Human Architecture', back: '← Zurück zum Codex', kicker: 'SICHERE BUCHUNG', heading: 'MIT DER PASSENDEN<br>INFORMATION BEGINNEN.', intro: 'Nach erfolgreicher Zahlung senden wir dir an die angegebene E-Mail-Adresse einen privaten Intake-Link. Bitte sende keine Geburtsdaten per E-Mail. Die Lieferzeit beginnt, sobald Zahlung und vollständiger privater Intake eingegangen sind.', name: 'Vollständiger Name', email: 'E-Mail-Adresse', privacy: 'Ich habe die <a href="/datenschutz/" target="_blank" rel="noopener">Datenschutzhinweise</a> gelesen und bin einverstanden, dass meine Angaben zur Bearbeitung dieser Buchung verwendet werden.', submit: 'Sicher bezahlen', choose: 'Wähle bitte zuerst eine Einstiegslesung.', cancelled: 'Die Zahlung wurde abgebrochen. Du kannst es erneut versuchen, wenn du bereit bist.', error: 'Die Zahlung konnte nicht bestätigt werden. Bitte versuche es erneut oder kontaktiere uns.', opening: 'Sichere Zahlung wird geöffnet …', unavailable: 'Die sichere Zahlung ist gerade nicht verfügbar. Bitte kontaktiere hello@human-architecture.info.', priorityTitle: 'Brauchst du die Lesung innerhalb von 24 Stunden?', priority: 'Bitte frage die Prioritätsbearbeitung nach Beginn deiner Buchung per E-Mail an. Wir bestätigen zuerst die Verfügbarkeit; der Zuschlag von 30 € wird nur fällig, wenn wir die Anfrage annehmen. Bitte sende keine Geburtsdaten per E-Mail.', priorityLink: 'Prioritätsbearbeitung per E-Mail anfragen ↗', steps: ['Sichere Zahlung', 'Privater Intake-Link per E-Mail', 'Intake privat ausfüllen', 'Schriftliche Lesung innerhalb der genannten Lieferzeit per E-Mail'] } : { title: 'Secure Codex booking | Human Architecture', back: '← Back to The Codex', kicker: 'SECURE BOOKING', heading: 'BEGIN WITH THE<br>RIGHT AMOUNT OF INFORMATION.', intro: 'After successful payment, we send a private intake link to the email address you provide. Please do not email birth information. The delivery timeframe begins once payment and your complete private intake have both been received.', name: 'Full name', email: 'Email address', privacy: 'I have read the <a href="/datenschutz/" target="_blank" rel="noopener">privacy information</a> and agree that my details may be used to process this booking.', submit: 'Continue to secure payment', choose: 'Please choose one of the introductory readings first.', cancelled: 'The payment was cancelled. You can try again when you are ready.', error: 'The payment could not be verified. Please try again or contact us.', opening: 'Opening secure payment…', unavailable: 'Secure checkout is not available right now. Please contact hello@human-architecture.info.', priorityTitle: 'Need a reading within 24 hours?', priority: 'Request priority delivery by email after you have started your booking. We confirm availability first; the €30 priority supplement is due only when we accept the request. Please do not send birth details by email.', priorityLink: 'Request priority delivery by email ↗', steps: ['Secure payment', 'Private intake link by email', 'Complete the intake privately', 'Written reading delivered by email within its stated timeframe'] };
  const form = document.querySelector('#booking-form'); const message = document.querySelector('#form-message');
  document.documentElement.lang = lang; document.title = text.title;
  document.querySelectorAll('[data-text]').forEach((element) => { const key = element.dataset.text; if (key === 'privacy') element.innerHTML = text[key]; else element.innerHTML = text[key]; });
  document.querySelectorAll('[data-step]').forEach((element, index) => { element.textContent = text.steps[index]; });
  if (!offers[key]) { form.hidden = true; message.textContent = text.choose; return; }
  document.querySelector('#offer-name').textContent = offers[key][lang];
  if (params.get('payment') === 'cancelled') message.textContent = text.cancelled;
  if (params.get('payment') === 'error') message.textContent = text.error;
  const submit = form.querySelector('button');
  fetch('/api/body-language-booking?codex=status').then(response => response.json()).then(result => {
    if (result.available) return;
    submit.disabled = true;
    message.textContent = text.unavailable;
  }).catch(() => {
    submit.disabled = true;
    message.textContent = text.unavailable;
  });
  form.addEventListener('submit', async event => {
    event.preventDefault(); message.textContent = text.opening;
    submit.disabled = true;
    try {
      const data = new FormData(form); const response = await fetch('/api/body-language-booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codex_booking: true, name: data.get('name'), email: data.get('email'), privacy: data.get('privacy') === 'on', offer: key, locale: lang }) });
      const result = await response.json(); if (!response.ok || !result.approvalUrl) throw new Error(result.message || 'Payment could not be opened.');
      location.assign(result.approvalUrl);
    } catch (error) {
      message.textContent = error.message === 'Direct booking is not open yet. Please contact us at hello@human-architecture.info.'
        ? text.unavailable
        : error.message;
      submit.disabled = false;
    }
  });
})();
