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
      privacy.querySelectorAll('[data-privacy-link]').forEach((existingLink) => existingLink.remove());
      privacy.append(' ');
      const privacyLink = document.createElement('a');
      privacyLink.dataset.privacyLink = '';
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
    link.href = localizedHref('/angebote/');
    label.textContent = language === 'de' ? 'Alle Angebote ansehen' : 'Explore all offers';
    link.removeAttribute('target');
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const guidedRoutes = {
    codex: {
      href: '/codex/',
      label: { en: 'Explore The Codex', de: 'Den Codex entdecken' },
      title: { en: 'Begin with your personal framework', de: 'Beginne mit deinem persönlichen Rahmen' },
      summary: { en: 'The Codex is a clear first route when you want to understand recurring patterns, decisions or the wider context of your life more precisely.', de: 'Der Codex ist ein klarer erster Weg, wenn du wiederkehrende Muster, Entscheidungen oder deinen weiteren Lebenskontext präziser verstehen möchtest.' }
    },
    sessions: {
      href: '/sessions/',
      label: { en: 'Explore sessions', de: 'Sessions entdecken' },
      title: { en: 'Explore a body-centred route', de: 'Erkunde einen körpernahen Weg' },
      summary: { en: 'A session is the more relevant place to begin when your question is connected to body, regulation or a personal in-person format.', de: 'Eine Session ist der passendere Einstieg, wenn dein Anliegen mit Körper, Regulation oder einem persönlichen Präsenzformat verbunden ist.' }
    },
    mihira: {
      href: '/mihira-ceremonia/',
      label: { en: 'Explore Mihira Ceremonia', de: 'Mihira Ceremonia entdecken' },
      title: { en: 'A considered space for transition', de: 'Ein bewusster Raum für Übergang' },
      summary: { en: 'Mihira Ceremonia is the more fitting route when identity, relationship or a meaningful transition needs a held, deliberate frame.', de: 'Mihira Ceremonia ist der passendere Weg, wenn Identität, Beziehung oder ein bedeutsamer Übergang einen gehaltenen, bewussten Rahmen brauchen.' }
    },
    families: {
      href: '/familien/',
      label: { en: 'Explore families & parents', de: 'Familien & Eltern entdecken' },
      title: { en: 'A route for family context', de: 'Ein Weg für den Familienkontext' },
      summary: { en: 'For a question involving family life, parenting or a young person, the families route gives the clearest overview of the relevant formats.', de: 'Bei einem Anliegen rund um Familienalltag, Elternschaft oder junge Menschen bietet der Familienbereich den klarsten Überblick über passende Formate.' }
    },
    organizations: {
      href: '/organizations/',
      label: { en: 'For teams & organisations', de: 'Für Teams & Organisationen' },
      title: { en: 'A route for a shared work context', de: 'Ein Weg für einen gemeinsamen Arbeitskontext' },
      summary: { en: 'For a team, leadership or organisational question, the organisations route is the clearest place to understand the available shared formats.', de: 'Bei einem Team-, Führungs- oder Organisationsanliegen ist der Organisationsbereich der klarste Ort, um die verfügbaren gemeinsamen Formate zu verstehen.' }
    },
    animals: {
      href: '/mensch-und-tier/',
      label: { en: 'Explore people & animals', de: 'Mensch & Tier entdecken' },
      title: { en: 'A route for life with animals', de: 'Ein Weg für das Leben mit Tieren' },
      summary: { en: 'For a question about everyday life with an animal or an equestrian context, the people & animals route gives the clearest overview of the relevant formats.', de: 'Bei einem Anliegen rund um das Leben mit einem Tier oder den Reitsport bietet der Bereich Mensch & Tier den klarsten Überblick über passende Formate.' }
    }
  };

  function localizedHref(href) {
    const destination = new URL(href, window.location.origin);
    if (destination.origin === window.location.origin) destination.searchParams.set('lang', language);
    return destination.origin === window.location.origin
      ? `${destination.pathname}${destination.search}${destination.hash}`
      : href;
  }

  function localDirection(message) {
    const text = message.toLowerCase();
    const has = (terms) => terms.some((term) => text.includes(term));
    let route = null;
    if (has(['team', 'organisation', 'organization', 'leadership', 'führung', 'unternehmen', 'workplace'])) route = 'organizations';
    else if (has(['familie', 'family', 'parent', 'eltern', 'mama', 'baby', 'kind', 'child', 'jugend'])) route = 'families';
    else if (has(['pferd', 'horse', 'reiten', 'equestrian', 'hund', 'dog', 'katze', 'cat', 'tier', 'animal'])) route = 'animals';
    else if (has(['ceremony', 'ceremonia', 'transition', 'übergang', 'trauer', 'grief', 'hochzeit', 'wedding', 'identity', 'identität'])) route = 'mihira';
    else if (has(['massage', 'bodywork', 'körper', 'körperarbeit', 'touch', 'berührung', 'regulation', 'regulierung', 'in-person', 'vor ort'])) route = 'sessions';
    else if (has(['pattern', 'muster', 'understand', 'verstehen', 'codex', 'self', 'selbst', 'relationship', 'beziehung'])) route = 'codex';
    return route ? { route, ...guidedRoutes[route] } : null;
  }

  function renderQuestionnaire() {
    const labelNode = form.querySelector('label[for="orientation-message"]');
    if (!labelNode || form.querySelector('[data-orientation-questionnaire]')) return;
    const questionnaire = document.createElement('div');
    questionnaire.className = 'orientation-questionnaire';
    questionnaire.dataset.orientationQuestionnaire = '';
    questionnaire.innerHTML = `
      <p class="orientation-questionnaire__intro"><span data-en="Or choose the path that feels closest" data-de="Oder wähle den Weg, der deinem Anliegen am nächsten ist">Or choose the path that feels closest</span></p>
      <fieldset><legend><span data-en="1 · What is most present?" data-de="1 · Was ist gerade am präsentesten?">1 · What is most present?</span></legend>
        <div class="orientation-choice-grid">
          <label><input type="radio" name="guide-focus" value="codex"><span data-en="A recurring pattern or question about myself" data-de="Ein wiederkehrendes Muster oder eine Frage zu mir selbst">A recurring pattern or question about myself</span></label>
          <label><input type="radio" name="guide-focus" value="sessions"><span data-en="My body, regulation or a personal session" data-de="Mein Körper, Regulation oder eine persönliche Session">My body, regulation or a personal session</span></label>
          <label><input type="radio" name="guide-focus" value="mihira"><span data-en="Identity, relationship or a meaningful transition" data-de="Identität, Beziehung oder ein bedeutsamer Übergang">Identity, relationship or a meaningful transition</span></label>
          <label><input type="radio" name="guide-focus" value="families"><span data-en="Family life, parenting or a young person" data-de="Familienalltag, Elternschaft oder ein junger Mensch">Family life, parenting or a young person</span></label>
          <label><input type="radio" name="guide-focus" value="organizations"><span data-en="A team, leadership or organisational question" data-de="Eine Team-, Führungs- oder Organisationsfrage">A team, leadership or organisational question</span></label>
        </div>
      </fieldset>
      <fieldset><legend><span data-en="2 · Where does this belong?" data-de="2 · In welchem Kontext liegt es?">2 · Where does this belong?</span></legend>
        <div class="orientation-choice-grid orientation-choice-grid--compact">
          <label><input type="radio" name="guide-setting" value="personal"><span data-en="My personal life" data-de="Mein persönliches Leben">My personal life</span></label>
          <label><input type="radio" name="guide-setting" value="family"><span data-en="My family or partnership" data-de="Meine Familie oder Partnerschaft">My family or partnership</span></label>
          <label><input type="radio" name="guide-setting" value="work"><span data-en="My work or team" data-de="Meine Arbeit oder mein Team">My work or team</span></label>
        </div>
      </fieldset>`;
    labelNode.before(questionnaire);
  }

  function questionnaireDirection() {
    const focus = form.querySelector('input[name="guide-focus"]:checked')?.value;
    const setting = form.querySelector('input[name="guide-setting"]:checked')?.value;
    if (!focus || !setting) return null;
    const route = setting === 'work' ? 'organizations' : setting === 'family' && focus !== 'organizations' ? 'families' : focus;
    return guidedRoutes[route] ? { route, ...guidedRoutes[route] } : null;
  }

  function showGuidance(direction) {
    title.textContent = direction.title[language];
    summary.textContent = direction.summary[language];
    link.href = localizedHref(direction.href);
    label.textContent = direction.label[language];
    link.removeAttribute('target');
    link.removeAttribute('rel');
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  applyClarityCopy();
  renderQuestionnaire();
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
    form.reset();
    textarea.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = textarea.value.trim();
    const selectedDirection = questionnaireDirection();
    if (!message && !selectedDirection) {
      showError(language === 'de' ? 'Beschreibe dein Anliegen kurz oder beantworte die beiden Fragen.' : 'Briefly describe your context or answer the two questions.');
      return;
    }

    if (selectedDirection && !message) {
      showGuidance(selectedDirection);
      return;
    }
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
      link.href = localizedHref(data.href);
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
      const fallbackDirection = selectedDirection || localDirection(message);
      if (fallbackDirection) {
        showGuidance(fallbackDirection);
      } else {
        showError(language === 'de' ? 'Dein Anliegen braucht etwas mehr Raum. Sieh dir die Angebote an oder beschreibe es in einem kurzen Satz anders.' : 'Your context may need a little more space. Explore the offers or describe it again in one short sentence.');
      }
    } finally {
      submit.disabled = false;
      submit.innerHTML = original;
    }
  });

  translate();
}());
