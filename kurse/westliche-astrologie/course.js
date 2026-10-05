(() => {
  const root = document.documentElement;
  const languageButtons = [...document.querySelectorAll('[data-language]')];
  let language = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'de';

  const setLanguage = (next, updateUrl = true) => {
    language = next === 'en' ? 'en' : 'de';
    root.lang = language;
    document.querySelectorAll('[data-de][data-en]').forEach((element) => { element.textContent = element.dataset[language]; });
    document.querySelectorAll('[data-de-placeholder][data-en-placeholder]').forEach((element) => { element.placeholder = element.dataset[`${language}Placeholder`]; });
    languageButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    document.title = language === 'en'
      ? 'Learn Western Astrology | Live Online Course | Human Architecture®'
      : 'Westliche Astrologie lernen | Online-Kurs | Human Architecture®';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = language === 'en'
      ? 'Understand Western Astrology in four live online sessions covering planets, signs, houses, aspects and chart reading—including a workbook.'
      : 'Westliche Astrologie verstehen: vier Live-Online-Sessions zu Planeten, Zeichen, Häusern, Aspekten und Chart Reading – inklusive Workbook.';
    if (updateUrl) {
      const url = new URL(location.href);
      if (language === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
      history.replaceState(null, '', url);
    }
  };
  languageButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  setLanguage(language, false);

  const form = document.querySelector('#astrology-booking-form');
  if (!form) return;
  const pairFields = form.querySelector('#participant-two');
  const pairInputs = [...pairFields.querySelectorAll('input')];
  const bookingLabel = form.querySelector('#booking-label');
  const bookingTotal = form.querySelector('#booking-total');

  const syncTime = (timeName, unknownName, active = true) => {
    const time = form.elements[timeName];
    const unknown = form.elements[unknownName];
    time.disabled = active && unknown.checked;
    time.required = active && !unknown.checked;
    if (time.disabled) time.value = '';
  };

  const syncBooking = () => {
    const pair = form.elements.bookingOption.value === 'pair';
    pairFields.classList.toggle('is-visible', pair);
    pairFields.setAttribute('aria-hidden', String(!pair));
    pairInputs.forEach((input) => {
      if (input.type === 'checkbox') input.required = pair && input.name === 'friendConsent';
      else input.required = pair;
      input.disabled = !pair;
    });
    syncTime('birthTime', 'birthTimeUnknown');
    if (pair) syncTime('friendBirthTime', 'friendBirthTimeUnknown');
    bookingLabel.textContent = pair
      ? (language === 'en' ? 'Two people · complete course' : 'Zwei Personen · kompletter Kurs')
      : (language === 'en' ? 'One person · complete course' : 'Eine Person · kompletter Kurs');
    bookingTotal.textContent = pair ? '360,00 €' : '220,00 €';
  };

  form.addEventListener('change', (event) => {
    if (['bookingOption', 'birthTimeUnknown', 'friendBirthTimeUnknown'].includes(event.target.name)) syncBooking();
  });
  languageButtons.forEach((button) => button.addEventListener('click', syncBooking));
  form.addEventListener('reset', () => setTimeout(syncBooking, 0));
  syncBooking();

  const serialize = () => {
    const data = Object.fromEntries(new FormData(form).entries());
    form.querySelectorAll('input[type="checkbox"]').forEach((input) => { data[input.name] = input.checked; });
    data.language = language;
    return data;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    syncBooking();
    if (!form.reportValidity()) return;
    const status = form.querySelector('.form-status');
    const button = form.querySelector('.submit-button');
    status.className = 'form-status';
    status.textContent = language === 'en' ? 'Sending…' : 'Wird gesendet…';
    button.disabled = true;
    try {
      const response = await fetch('/api/astrology-course', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(serialize())
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || 'Submission failed');
      status.className = 'form-status success';
      status.textContent = language === 'en'
        ? 'Registration received. Check your email for the next step. Your place is secured after payment is confirmed.'
        : 'Anmeldung erhalten. Prüfe deine E-Mail für den nächsten Schritt. Dein Platz ist nach bestätigter Zahlung gesichert.';
      form.reset();
      if (result.paymentUrl) {
        status.textContent = language === 'en' ? 'Registration received. Opening secure payment…' : 'Anmeldung erhalten. Sichere Zahlung wird geöffnet…';
        setTimeout(() => window.location.assign(result.paymentUrl), 900);
      }
    } catch (error) {
      status.className = 'form-status error';
      status.textContent = language === 'en'
        ? 'The registration could not be sent. Please email hello@human-architecture.info.'
        : 'Die Anmeldung konnte nicht gesendet werden. Bitte schreibe an hello@human-architecture.info.';
    } finally {
      button.disabled = false;
    }
  });
})();
