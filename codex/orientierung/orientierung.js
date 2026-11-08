(() => {
  const params = new URLSearchParams(location.search);
  const lang = params.get('lang') === 'en' ? 'en' : 'de';
  document.documentElement.lang = lang;
  const render = (element, value) => {
    if (!value.includes('<br>')) { element.textContent = value; return; }
    element.replaceChildren();
    value.split('<br>').forEach((part, index) => {
      if (index) element.append(document.createElement('br'));
      element.append(document.createTextNode(part));
    });
  };
  document.querySelectorAll('[data-de][data-en]').forEach(element => { render(element, element.dataset[lang]); });
  document.querySelectorAll('[data-language-link]').forEach(link => { link.href = `?lang=${lang === 'de' ? 'en' : 'de'}`; link.textContent = lang === 'de' ? 'EN' : 'DE'; });
  document.title = lang === 'de' ? 'Finde deinen Codex | Human Architecture' : 'Find your Codex | Human Architecture';
  const choices = {};
  const result = document.querySelector('.codex-orientation-result');
  const resultTitle = result.querySelector('h2');
  const resultCopy = result.querySelector('p:not(.cr-kicker):not(.cr-draft)');
  const resultLink = result.querySelector('.cr-button');
  const copy = {
    current: { title: ['Current Sky', 'The Current Sky'], text: ['Für ein oder zwei Themen, die im Moment präsent sind: eine kurze, persönliche schriftliche Einordnung.', 'For one or two themes that are present now: a concise personal written perspective.'], href: '/codex/current-sky/', link: ['Current Sky ansehen · €29', 'Explore Current Sky · €29'] },
    recurring: { title: ['Personal Pattern', 'The Personal Pattern'], text: ['Für ein wiederkehrendes Thema in Beziehung, Ausdruck oder Ausrichtung: eine fokussierte schriftliche Ausarbeitung.', 'For a recurring theme in relationship, expression or direction: a focused written exploration.'], href: '/codex/personal-pattern/', link: ['Personal Pattern ansehen · €49', 'Explore Personal Pattern · €49'] },
    foundations: { title: ['Astrologische Grundlagen', 'Astrological Foundations'], text: ['Für einen breiteren, zusammenhängenden Einstieg in ausgewählte Grundlagen deines Geburtshoroskops.', 'For a wider, connected introduction to selected foundations of your birth chart.'], href: '/codex/astrological-foundations/', link: ['Astrologische Grundlagen ansehen · €59', 'Explore Astrological Foundations · €59'] },
    year: { title: ['Codex 2027', 'Codex 2027'], text: ['Für einen persönlichen Jahreskompass mit klaren monatlichen Rückkehrpunkten.', 'For a personal annual compass with clear monthly return points.'], href: '/codex/2027/', link: ['Codex 2027 ansehen · €222', 'Explore Codex 2027 · €222'] },
    routine: { title: ['Body Fahrplan', 'Body Fahrplan'], text: ['Für wiederkehrende Alltags- und Routine-Reibung in einem klaren, nicht-medizinischen Gruppenrahmen.', 'For recurring everyday and routine friction within a clear, non-clinical group framework.'], href: '/codex/body-fahrplan/', link: ['Body Fahrplan anfragen', 'Enquire about Body Fahrplan'] },
    connected: { title: ['Vertiefende Codex-Arbeit', 'Deeper Codex work'], text: ['Für mehrere zusammenhängende Fragen oder wenn der passende Rahmen erst persönlich geklärt werden soll.', 'For several connected questions, or when the appropriate frame needs to be clarified personally first.'], href: '/codex/angebote/', link: ['Vertiefende Formate ansehen', 'Explore deeper formats'] },
    conversation: { title: ['Private Codex-Einführung', 'Private Codex Introduction'], text: ['Ein fokussiertes Gespräch kann der passendere Einstieg sein, wenn du eine konkrete Frage persönlich betrachten möchtest.', 'A focused conversation can be the more fitting entry when you want to consider one concrete question personally.'], href: '/codex/private-introduction/', link: ['Private Einführung ansehen · €149', 'Explore private introduction · €149'] }
  };
  const renderRecommendation = () => {
    if (!choices.focus || !choices.depth || !choices.scope) return;
    let recommendation = choices.focus;
    if (choices.depth === 'conversation' && !['year', 'routine'].includes(choices.focus)) recommendation = choices.scope === 'one' ? 'conversation' : 'connected';
    if (choices.scope === 'several' && !['year', 'routine'].includes(choices.focus)) recommendation = 'connected';
    const option = copy[recommendation];
    resultTitle.textContent = option.title[lang === 'de' ? 0 : 1]; resultCopy.textContent = option.text[lang === 'de' ? 0 : 1]; resultLink.href = option.href; resultLink.textContent = option.link[lang === 'de' ? 0 : 1]; result.hidden = false;
  };
  document.querySelectorAll('[data-question] button').forEach(button => button.addEventListener('click', () => {
    const group = button.closest('[data-question]'); group.querySelectorAll('button').forEach(choice => choice.setAttribute('aria-pressed', 'false')); button.setAttribute('aria-pressed', 'true'); choices[group.dataset.question] = button.dataset.value; renderRecommendation();
  }));
})();
