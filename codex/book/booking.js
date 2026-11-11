(() => {
  const german = new URLSearchParams(location.search).get('lang') === 'de';
  const copy = german ? {
    offers: { current_sky: 'Current Sky · €29', personal_pattern: 'Personal Pattern · €49', astrological_foundations: 'Astrologische Grundlagen · €59', codex_2027_entry: 'Codex 2027 · €222' },
    unavailable: 'Der sichere Checkout wird gerade vorbereitet. Für diese Ausarbeitung schreibe bitte an hello@human-architecture.info.',
    unavailableNow: 'Der sichere Checkout ist gerade nicht verfügbar. Bitte schreibe an hello@human-architecture.info.',
    cancelled: 'Die Zahlung wurde abgebrochen. Du kannst es erneut versuchen, wenn du bereit bist.',
    error: 'Die Zahlung konnte nicht bestätigt werden. Bitte versuche es erneut oder kontaktiere uns.',
    opening: 'Sichere Zahlung wird geöffnet …', missing: 'Bitte wähle zuerst eine der Einstiegslesungen.',
    directNotOpen: 'Direkte Buchung ist noch nicht geöffnet. Bitte schreibe an hello@human-architecture.info.'
  } : {
    offers: { current_sky: 'The Current Sky · €29', personal_pattern: 'The Personal Pattern · €49', astrological_foundations: 'Astrological Foundations · €59', codex_2027_entry: 'Codex 2027 · €222' },
    unavailable: 'Secure checkout is being prepared. To request this reading, please contact hello@human-architecture.info.',
    unavailableNow: 'Secure checkout is not available right now. Please contact hello@human-architecture.info.',
    cancelled: 'The payment was cancelled. You can try again when you are ready.',
    error: 'The payment could not be verified. Please try again or contact us.',
    opening: 'Opening secure payment…', missing: 'Please choose one of the introductory readings first.',
    directNotOpen: 'Direct booking is not open yet. Please contact us at hello@human-architecture.info.'
  };
  const params = new URLSearchParams(location.search);
  const key = params.get('offer');
  const promo = (params.get('promo') || '').toUpperCase();
  const form = document.querySelector('#booking-form');
  const message = document.querySelector('#form-message');

  if (german) {
    document.documentElement.lang = 'de';
    document.title = 'Sichere Codex-Buchung | Human Architecture';
    document.querySelector('.cr-brand').textContent = 'Mihira Ceremonia · Der Codex';
    document.querySelector('.cr-back').textContent = '← Zurück zum Codex';
    document.querySelector('.cr-kicker').textContent = 'SICHERE BUCHUNG';
    document.querySelector('h1').innerHTML = 'BEGINNE MIT DER<br>PASSENDEN INFORMATIONSTIEFE.';
    document.querySelectorAll('.cr-offer-grid > div > p')[1].textContent = 'Nach erfolgreicher Zahlung erhältst du deinen privaten Intake-Link. Bitte sende Geburtsdaten nicht per E-Mail.';
    const labels = form.querySelectorAll('label');
    labels[0].childNodes[0].nodeValue = 'Vollständiger Name';
    labels[1].childNodes[0].nodeValue = 'E-Mail-Adresse';
    labels[2].lastChild.nodeValue = ' Ich habe die Datenschutzinformationen gelesen und stimme zu, dass meine Angaben zur Bearbeitung dieser Buchung verwendet werden dürfen.';
    form.querySelector('button').textContent = 'Weiter zur sicheren Zahlung';
    const steps = document.querySelectorAll('.cr-facts li');
    steps[0].innerHTML = '<b>Schritt 1</b>Sichere Zahlung';
    steps[1].innerHTML = '<b>Schritt 2</b>Privater Intake-Link per E-Mail';
    steps[2].innerHTML = '<b>Schritt 3</b>Schriftliche Ausarbeitung per E-Mail';
  }

  if (!copy.offers[key]) { form.hidden = true; message.textContent = copy.missing; return; }
  if (key === 'codex_2027_entry') {
    const label = document.createElement('label');
    label.innerHTML = german
      ? 'Oktober-Code <small>(optional)</small><input name="promo_code" autocomplete="off" maxlength="40">'
      : 'October code <small>(optional)</small><input name="promo_code" autocomplete="off" maxlength="40">';
    form.querySelector('.cr-check').before(label);
    label.querySelector('input').value = promo;
  }
  document.querySelector('#offer-name').textContent = key === 'codex_2027_entry' && promo === 'MELMIHIRA27'
    ? (german ? 'Codex 2027 · Oktober-Einstieg €111' : 'Codex 2027 · €111 October entry')
    : copy.offers[key];
  if (params.get('payment') === 'cancelled') message.textContent = copy.cancelled;
  if (params.get('payment') === 'error') message.textContent = copy.error;
  const submit = form.querySelector('button');

  fetch('/api/body-language-booking?codex=status').then(response => response.json()).then(result => {
    if (result.available) return;
    submit.disabled = true; message.textContent = copy.unavailable;
  }).catch(() => { submit.disabled = true; message.textContent = copy.unavailableNow; });

  form.addEventListener('submit', async event => {
    event.preventDefault(); message.textContent = copy.opening; submit.disabled = true;
    try {
      const data = new FormData(form);
      const response = await fetch('/api/body-language-booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codex_booking: true, name: data.get('name'), email: data.get('email'), privacy: data.get('privacy') === 'on', promo_code: data.get('promo_code'), offer: key }) });
      const result = await response.json();
      if (!response.ok || !result.approvalUrl) throw new Error(result.message || copy.error);
      location.assign(result.approvalUrl);
    } catch (error) {
      message.textContent = error.message === 'Direct booking is not open yet. Please contact us at hello@human-architecture.info.' ? copy.directNotOpen : error.message;
      submit.disabled = false;
    }
  });
})();
