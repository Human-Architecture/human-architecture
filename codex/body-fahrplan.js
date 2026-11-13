(() => {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang') === 'en' ? 'en' : 'de';
  const pick = element => element.dataset[lang] || element.textContent;
  const render = (element, value) => {
    if (element.matches('.bf-enquiry-consent span')) {
      element.innerHTML = value;
      return;
    }
    const fragments = value.split('<br>');
    element.replaceChildren();
    fragments.forEach((fragment, index) => {
      if (index) element.append(document.createElement('br'));
      element.append(document.createTextNode(fragment));
    });
  };
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-de][data-en]').forEach(element => { render(element, pick(element)); });
  document.querySelectorAll('[data-de-placeholder][data-en-placeholder]').forEach(element => {
    element.placeholder = element.dataset[`${lang}Placeholder`];
  });
  document.querySelectorAll('[data-language-link]').forEach(link => {
    const next = lang === 'de' ? 'en' : 'de';
    link.href = `?lang=${next}`;
    link.textContent = next.toUpperCase();
  });
  document.title = lang === 'de' ? 'Body Fahrplan | Der Codex' : 'Body Fahrplan | The Codex';
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = lang === 'de'
    ? 'Body Fahrplan ist eine 12-wöchige, nicht-medizinische Kleingruppe für wiederkehrende Routine-Reibung und einen tragfähigen persönlichen Rahmen.'
    : 'Body Fahrplan is a 12-week, non-clinical small-group Codex for recurring routine friction and a more workable personal structure.';

  const form = document.querySelector('[data-bf-enquiry]');
  if (!form) return;
  const status = form.querySelector('.bf-enquiry-status');
  const submit = form.querySelector('button[type="submit"]');
  const copy = {
    sending: lang === 'de' ? 'Anfrage wird gesendet …' : 'Sending your enquiry…',
    success: lang === 'de' ? 'Danke. Deine Anfrage ist eingegangen. Wir melden uns persönlich mit einer klaren Rückmeldung zu Passung und nächstem Schritt.' : 'Thank you. Your enquiry has arrived. We will respond personally with a clear note on fit and the next step.',
    error: lang === 'de' ? 'Die Anfrage konnte gerade nicht gesendet werden. Bitte versuche es später erneut oder schreibe an hello@human-architecture.info.' : 'Your enquiry could not be sent right now. Please try again later or email hello@human-architecture.info.'
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || form.elements.website.value) return;
    submit.disabled = true;
    status.textContent = copy.sending;
    const availability = {
      yes: lang === 'de' ? 'Ja' : 'Yes',
      'need-details': lang === 'de' ? 'Grundsätzlich ja – Termin-Details nötig' : 'Generally yes — timing details needed',
      'not-sure': lang === 'de' ? 'Noch nicht sicher' : 'Not sure yet'
    }[form.elements.availability.value];
    const message = [
      `${lang === 'de' ? 'Was gerade präsent ist' : 'What is present now'}: ${form.elements.friction.value.trim()}`,
      `${lang === 'de' ? 'Gewünschte Klarheit nach 12 Wochen' : 'Desired clarity after 12 weeks'}: ${form.elements.intention.value.trim()}`,
      `${lang === 'de' ? 'Gruppenrhythmus' : 'Group rhythm'}: ${availability}`,
      `${lang === 'de' ? 'Zeitzone / mögliche Zeiten' : 'Time zone / workable times'}: ${form.elements.timing.value.trim() || (lang === 'de' ? 'Nicht angegeben' : 'Not provided')}`
    ].join('\n\n');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.elements.name.value.trim(),
          email: form.elements.email.value.trim(),
          context: 'Body Fahrplan cohort enquiry',
          message
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) throw new Error(result.message || copy.error);
      form.reset();
      status.textContent = copy.success;
    } catch (error) {
      status.textContent = error.message || copy.error;
    } finally {
      submit.disabled = false;
    }
  });
})();
