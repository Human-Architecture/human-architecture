(() => {
  const params = new URLSearchParams(window.location.search);
  const booking = params.get('booking');
  const token = params.get('token');
  const status = document.getElementById('intake-status');
  const area = document.getElementById('intake-area');
  const form = document.getElementById('intake-form');
  const message = document.getElementById('form-message');
  const birthTime = form.elements.birthTime;
  const birthTimeUnknown = form.elements.birthTimeUnknown;

  const fieldsets = {
    current_sky: document.getElementById('current-sky-fields'),
    personal_pattern: document.getElementById('personal-pattern-fields'),
    astrological_foundations: document.getElementById('foundations-fields'),
    codex_2027_entry: document.getElementById('annual-fields')
  };

  const requiredFields = {
    current_sky: ['currentSkyContext', 'currentSkyFocus'],
    personal_pattern: ['personalPatternTheme', 'personalPatternQuestion'],
    astrological_foundations: ['foundationsFocus', 'foundationsQuestion'],
    codex_2027_entry: ['annualIntention']
  };

  const offerCopy = {
    current_sky: 'Current Sky · birth details and one present focus',
    personal_pattern: 'Personal Pattern · birth details and your chosen theme',
    astrological_foundations: 'Astrological Foundations · birth details and your reading focus',
    codex_2027_entry: 'Codex 2027 · birth details and your annual intention'
  };

  function setBirthTimeState() {
    const unknown = birthTimeUnknown.checked;
    birthTime.disabled = unknown;
    if (unknown) birthTime.value = '';
  }

  function showFields(offerKey) {
    Object.entries(fieldsets).forEach(([key, fieldset]) => {
      const active = key === offerKey;
      fieldset.hidden = !active;
      fieldset.querySelectorAll('input, select, textarea').forEach((input) => {
        input.disabled = !active;
        input.required = active && requiredFields[offerKey].includes(input.name);
      });
    });
  }

  if (!booking || !token) {
    status.textContent = 'This private intake link is incomplete. Please use the link from your booking email.';
    return;
  }

  history.replaceState({}, '', window.location.pathname + '?booking=' + encodeURIComponent(booking));
  birthTimeUnknown.addEventListener('change', setBirthTimeState);
  setBirthTimeState();

  fetch('/api/body-language-paypal-return?codex=intake&booking=' + encodeURIComponent(booking) + '&token=' + encodeURIComponent(token))
    .then(async (response) => {
      let body;
      try { body = await response.json(); } catch (_) { body = { error: 'This private intake link is unavailable.' }; }
      return { response, body };
    })
    .then(({ response, body }) => {
      if (!response.ok || !body.ok || !fieldsets[body.offerKey]) {
        throw new Error(body.error || 'This private intake link is unavailable.');
      }
      showFields(body.offerKey);
      status.textContent = offerCopy[body.offerKey];
      area.hidden = false;
    })
    .catch((error) => {
      status.textContent = error.message || 'This private intake link is unavailable.';
    });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    message.textContent = 'Sending your private intake…';

    const payload = {
      booking,
      token,
      birthDate: form.elements.birthDate.value,
      birthPlace: form.elements.birthPlace.value,
      birthTime: birthTime.value,
      birthTimeUnknown: birthTimeUnknown.checked,
      currentSkyContext: form.elements.currentSkyContext.value,
      currentSkyFocus: form.elements.currentSkyFocus.value,
      personalPatternTheme: form.elements.personalPatternTheme.value,
      personalPatternQuestion: form.elements.personalPatternQuestion.value,
      foundationsFocus: form.elements.foundationsFocus.value,
      foundationsQuestion: form.elements.foundationsQuestion.value,
      annualIntention: form.elements.annualIntention.value,
      annualContext: form.elements.annualContext.value,
      dataConsent: form.elements.dataConsent.checked
    };

    try {
      const response = await fetch('/api/body-language-paypal-return?codex=intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      let result;
      try { result = await response.json(); } catch (_) { result = { error: 'Your intake could not be saved.' }; }
      if (!response.ok || !result.ok) throw new Error(result.error || 'Your intake could not be saved.');

      form.hidden = true;
      status.textContent = 'Thank you. Your private intake has been received. We will prepare your selected reading within the stated delivery time.';
    } catch (error) {
      message.textContent = error.message || 'Your intake could not be saved. Please try again.';
      submit.disabled = false;
    }
  });
})();
