(function () {
  const form = document.querySelector('[data-orientation-form]');
  const result = document.querySelector('[data-orientation-result]');
  const title = document.querySelector('[data-result-title]');
  const summary = document.querySelector('[data-result-summary]');
  const link = document.querySelector('[data-result-link]');
  const label = document.querySelector('[data-result-label]');
  const toggle = document.querySelector('[data-language-toggle]');
  const textarea = document.querySelector('#orientation-message');
  let language = new URLSearchParams(window.location.search).get('lang') === 'de' || document.documentElement.lang === 'de' ? 'de' : 'en';

  function setBilingualText(selector, en, de) {
    const element = document.querySelector(selector);
    if (!element) return;
    element.dataset.en = en;
    element.dataset.de = de;
  }

  function applyClarityCopy() {
    setBilingualText('.orientation-lead', 'Name the context. The orientation guide maps it to one relevant Human Architecture pathway, with a defined scope and next step.', 'Benenne den Kontext. Der Orientierungsguide ordnet ihn einem passenden Human-Architecture-Weg mit klarem Umfang und nächstem Schritt zu.');
    setBilingualText('.orientation-panel__intro h2', 'What needs to become clear now?', 'Was soll jetzt klarer werden?');
    setBilingualText('.orientation-panel__intro h2 + p', 'One or two sentences are enough. You receive one proposed route, not a diagnosis or prescription.', 'Ein oder zwei Sätze reichen. Du erhältst einen vorgeschlagenen Weg — keine Diagnose und keine Vorgabe.');
    setBilingualText('.orientation-privacy', 'Do not enter medical, therapeutic, birth-chart or other highly sensitive information, or data about other people. Depending on the secure guide configuration, your short text is mapped locally or processed through OpenAI’s API solely to generate this non-binding orientation response.', 'Bitte gib keine medizinischen, therapeutischen, Geburts- oder sonstigen besonders sensiblen Angaben und keine Daten anderer Personen ein. Je nach sicherer Konfiguration wird dein kurzer Text lokal zugeordnet oder ausschließlich zur Erstellung dieser unverbindlichen Orientierung über die OpenAI-API verarbeitet.');
    setBilingualText('#paths-title', 'Choose the route you already recognise.', 'Wähle den Weg, den du bereits erkennst.');
  }

  function translate() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-en][data-de]').forEach((element) => {
      element.textContent = element.dataset[language];
    });
    const privacy = document.querySelector('.orientation-privacy');
    if (privacy) {
      privacy.append(' ');
      const privacyLink = document.createElement('a');
      privacyLink.href = '/datenschutz/';
      privacyLink.target = '_blank';
      privacyLink.rel = 'noopener';
      privacyLink.textContent = language === 'de' ? 'Datenschutzerklärung lesen' : 'Read the Privacy Notice';
      privacy.append(privacyLink, '.');
    }
    document.querySelectorAll('[data-en-placeholder][data-de-placeholder]').forEach((element) => {
      element.placeholder = element.dataset[`${language === 'de' ? 'de' : 'en'}Placeholder`];
    });
    toggle.textContent = language === 'en' ? 'DE' : 'EN';
    toggle.setAttribute('aria-label', language === 'en' ? 'Auf Deutsch wechseln' : 'Switch to English');
  }

  function showError(message) {
    title.textContent = language === 'de' ? 'Noch kein passender Einstieg' : 'No matching entry point yet';
    summary.textContent = message;
    link.href = '/angebote/';
    label.textContent = language === 'de' ? 'Alle Angebote ansehen' : 'Explore all offers';
    link.removeAttribute('target');
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  applyClarityCopy();
  document.querySelectorAll('[data-suggestion-en]').forEach((button) => {
    button.addEventListener('click', () => {
      textarea.value = button.dataset[`suggestion${language === 'de' ? 'De' : 'En'}`];
      textarea.focus();
    });
  });

  toggle.addEventListener('click', () => {
    language = language === 'en' ? 'de' : 'en';
    translate();
  });

  document.querySelector('[data-orientation-reset]').addEventListener('click', () => {
    result.hidden = true;
    textarea.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = textarea.value.trim();
    if (message.length < 8) {
      showError(language === 'de' ? 'Beschreibe deinen Kontext bitte in einem kurzen Satz.' : 'Please describe your context in one short sentence.');
      return;
    }

    const submit = form.querySelector('button[type=submit]');
    const original = submit.innerHTML;
    submit.disabled = true;
    submit.textContent = language === 'de' ? 'Orientierung wird erstellt …' : 'Mapping your direction …';
    try {
      const response = await fetch('/api/contact?orientation=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language, website: form.website.value })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Unavailable');
      title.textContent = data.title;
      summary.textContent = data.summary;
      link.href = data.href;
      label.textContent = data.label;
      if (data.external) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      } else {
        link.removeAttribute('target');
        link.removeAttribute('rel');
      }
      result.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      showError(error.message);
    } finally {
      submit.disabled = false;
      submit.innerHTML = original;
    }
  });

  translate();
}());
