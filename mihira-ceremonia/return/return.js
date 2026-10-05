(() => {
  const root = document.documentElement;
  const languageButtons = [...document.querySelectorAll('[data-language]')];

  const setLanguage = (language, updateUrl = true) => {
    const lang = language === 'en' ? 'en' : 'de';
    root.lang = lang;
    document.querySelectorAll('[data-de][data-en]').forEach((element) => {
      element.textContent = element.dataset[lang];
    });
    document.querySelectorAll('[data-de-placeholder][data-en-placeholder]').forEach((element) => {
      element.placeholder = element.dataset[`${lang}Placeholder`];
    });
    languageButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.language === lang)));
    document.title = lang === 'en'
      ? 'RETURN · Breathwork, Yoga Nidra & Deep Rest | Mihira Ceremonia'
      : 'RETURN · Breathwork, Yoga Nidra & Deep Rest | Mihira Ceremonia';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = lang === 'en'
      ? 'RETURN is a guided group experience for breath, body awareness, regulation, Yoga Nidra and deep rest—available publicly or for private groups.'
      : 'RETURN ist eine geführte Gruppenerfahrung für Atem, Körperwahrnehmung, Regulation, Yoga Nidra und tiefe Ruhe – öffentlich oder privat buchbar.';
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
      history.replaceState(null, '', url);
    }
  };

  languageButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  const requestedLanguage = new URLSearchParams(location.search).get('lang');
  setLanguage(requestedLanguage === 'en' ? 'en' : 'de', false);

  const serialize = (form) => {
    const data = Object.fromEntries(new FormData(form).entries());
    form.querySelectorAll('input[type="checkbox"]').forEach((input) => { data[input.name] = input.checked; });
    data.language = root.lang;
    return data;
  };

  const submitForm = (form, endpoint, messages) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector('.form-status');
      const button = form.querySelector('.submit-button');
      if (!form.reportValidity()) return;
      status.className = 'form-status';
      status.textContent = root.lang === 'en' ? 'Sending…' : 'Wird gesendet…';
      button.disabled = true;
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serialize(form))
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok) throw new Error(result.error || 'Submission failed');
        status.className = 'form-status success';
        status.textContent = root.lang === 'en' ? messages.en : messages.de;
        form.reset();
        if (result.paymentUrl) {
          status.textContent = root.lang === 'en' ? 'Registration received. Opening secure payment…' : 'Anmeldung erhalten. Sichere Zahlung wird geöffnet…';
          setTimeout(() => { window.location.assign(result.paymentUrl); }, 900);
        }
      } catch (error) {
        status.className = 'form-status error';
        status.textContent = root.lang === 'en'
          ? 'This could not be sent. Please email hello@human-architecture.info.'
          : 'Das konnte nicht gesendet werden. Bitte schreibe an hello@human-architecture.info.';
      } finally {
        button.disabled = false;
      }
    });
  };

  const publicForm = document.querySelector('#public-booking-form');
  if (publicForm) {
    const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
    const friendFields = publicForm.querySelector('#friend-fields');
    const friendInputs = [...friendFields.querySelectorAll('input')];
    const primaryPrice = publicForm.querySelector('#primary-price');
    const friendPriceRow = publicForm.querySelector('#friend-price-row');
    const friendPrice = publicForm.querySelector('#friend-price');
    const totalPrice = publicForm.querySelector('#total-price');
    const discountNote = publicForm.querySelector('#discount-note');
    const basePrice = (type) => type === 'dali' ? 25 : type === 'regular' ? 28 : null;

    const syncBooking = () => {
      const hasFriend = publicForm.elements.bringFriend.value === 'yes';
      friendFields.classList.toggle('is-visible', hasFriend);
      friendFields.setAttribute('aria-hidden', String(!hasFriend));
      friendInputs.forEach((input) => { input.required = hasFriend; });
      friendPriceRow.hidden = !hasFriend;
      discountNote.hidden = !hasFriend;

      const primaryBase = basePrice(publicForm.elements.priceType.value);
      const secondaryBase = hasFriend ? basePrice(publicForm.elements.friendPriceType.value) : null;
      const primaryAmount = primaryBase === null ? null : primaryBase * (hasFriend ? 0.9 : 1);
      const secondaryAmount = secondaryBase === null ? null : secondaryBase * 0.9;
      primaryPrice.textContent = primaryAmount === null ? '–' : euro.format(primaryAmount);
      friendPrice.textContent = secondaryAmount === null ? '–' : euro.format(secondaryAmount);
      const total = primaryAmount === null || (hasFriend && secondaryAmount === null)
        ? null
        : primaryAmount + (secondaryAmount || 0);
      totalPrice.textContent = total === null ? '–' : euro.format(total);
    };

    publicForm.addEventListener('change', (event) => {
      if (['priceType', 'bringFriend', 'friendPriceType'].includes(event.target.name)) syncBooking();
    });
    publicForm.addEventListener('reset', () => setTimeout(syncBooking, 0));
    syncBooking();

    const safetyNote = publicForm.elements.safetyNote;
    const healthConsent = publicForm.elements.healthConsent;
    const syncHealthConsent = () => { healthConsent.required = Boolean(safetyNote.value.trim()); };
    safetyNote.addEventListener('input', syncHealthConsent);
    syncHealthConsent();
    submitForm(publicForm, '/api/return-public', {
      de: 'Deine Anmeldung ist eingegangen. Wir senden dir den sicheren Zahlungsweg und die nächsten Informationen. Dein Platz ist erst nach bestätigter Zahlung gesichert.',
      en: 'Your registration has been received. We will send the secure payment route and next information. Your place is secured only after payment is confirmed.'
    });
  }

  const organizationForm = document.querySelector('#organization-form');
  if (organizationForm) submitForm(organizationForm, '/api/return-partner', {
    de: 'Danke. Wir prüfen deine Anfrage und melden uns mit einer Empfehlung für Format, Aufbau und nächsten Schritt.',
    en: 'Thank you. We will review your enquiry and respond with a recommendation for format, structure and next step.'
  });
})();
