(() => {
  const isGerman = new URLSearchParams(location.search).get('lang') === 'de';
  const text = (selector, value, index = 0) => {
    const node = document.querySelectorAll(selector)[index];
    if (node) node.textContent = value;
  };
  const html = (selector, value, index = 0) => {
    const node = document.querySelectorAll(selector)[index];
    if (node) node.innerHTML = value;
  };

  document.documentElement.lang = isGerman ? 'de' : 'en';
  document.title = isGerman ? 'Mihira Ceremonia — Private Praxis' : 'Mihira Ceremonia — Private practice';
  const heroPortrait = document.querySelector('.hero-image');
  if (heroPortrait) {
    heroPortrait.src = '/assets/portraits/mel-mihira-private-practice-outdoor.jpeg';
    heroPortrait.alt = 'Mel Mihira outdoors with a notebook and phone';
    heroPortrait.width = 1241;
    heroPortrait.height = 1600;
  }

  const primaryNav = document.querySelector('.site-header > nav[aria-label="Primary navigation"]');
  if (primaryNav && !primaryNav.querySelector('.mc-language-switch')) {
    const switcher = document.createElement('span');
    switcher.className = 'mc-language-switch';
    switcher.setAttribute('aria-label', isGerman ? 'Sprache wählen' : 'Choose language');
    switcher.innerHTML = `<a href="?lang=en"${isGerman ? '' : ' aria-current="page"'}>EN</a><i>/</i><a href="?lang=de"${isGerman ? ' aria-current="page"' : ''}>DE</a>`;
    primaryNav.prepend(switcher);
  }
  const mobileNav = document.querySelector('.mobile-menu nav');
  if (mobileNav && !mobileNav.querySelector('.mc-language-switch')) {
    const switcher = document.createElement('span');
    switcher.className = 'mc-language-switch mc-language-switch--mobile';
    switcher.setAttribute('aria-label', isGerman ? 'Sprache wählen' : 'Choose language');
    switcher.innerHTML = `<a href="?lang=en"${isGerman ? '' : ' aria-current="page"'}>EN</a><i>/</i><a href="?lang=de"${isGerman ? ' aria-current="page"' : ''}>DE</a>`;
    mobileNav.append(switcher);
  }
  if (!isGerman) return;

  const labels = [
    ['.site-header > nav a[href="/mihira-ceremonia/about"]', 'Die Praxis'],
    ['.site-header > nav a[href="/mihira-ceremonia/private-work"]', 'Private Begleitung'],
    ['.mobile-menu summary', 'Menü'],
    ['.mobile-menu a[href="/mihira-ceremonia/about"]', 'Die Praxis'],
    ['.mobile-menu a[href="/mihira-ceremonia/private-work"]', 'Private Begleitung'],
    ['.mobile-menu a[href="/mihira-ceremonia/private-work#begin"]', 'Einstieg'],
    ['.nav-cta', 'Einstieg in die Begleitung'],
    ['.hero .eyebrow', 'Mihira Ceremonia / Private Praxis'],
    ['.hero-intro', 'Für Menschen an entscheidenden Schwellen, die wissen: Die sichtbare Frage ist nicht mehr die ganze Frage.'],
    ['.hero-actions .button', 'Private Begleitung entdecken'],
    ['.vertical-note', 'HUMAN ARCHITECTURE FÜR LEBEN MIT TRAGWEITE'],
    ['.manifesto .section-index', '01 / Die Praxis'],
    ['.manifesto .lead-copy', 'Mihira Ceremonia beginnt in den Momenten, in denen jemand nicht länger die Person bleiben kann, die er oder sie werden musste.'],
    ['.manifesto-grid > div > p', 'Wir arbeiten unterhalb der sichtbaren Entscheidung: mit den Identitäten, Anpassungen, Loyalitäten, Wünschen und Bindungsstrukturen, die prägen, wie ein Mensch wählt, sich bezieht, führt und gestaltet.'],
    ['.dark-aside p', 'DIE MIHIRA-DIFFERENZ'],
    ['.dark-main .eyebrow', 'Die Arbeit unter der Arbeit'],
    ['.dark-main blockquote', '„Wir helfen dir nicht, ein überholtes Leben erfolgreicher zu vollziehen.“'],
    ['.dark-main > p:not(.eyebrow)', 'Wir betrachten, worauf das Leben, die Entscheidung, die Beziehung oder das Streben aufgebaut ist—besonders dann, wenn unbewusst weiterzumachen zu teuer geworden ist.'],
    ['.framework .section-index', '02 / Human Architecture'],
    ['.framework-copy p', 'Human Architecture ist die Disziplin unterhalb der Praxis. Sie untersucht unsichtbare Muster, die menschliche Ergebnisse prägen, ohne den Menschen auf ein Etikett, eine Formel oder Vorschrift zu reduzieren.'],
    ['.threshold .section-index', '03 / Die Schwelle'],
    ['.threshold-card p', 'Private Begleitung ist für den Moment, in dem die sichtbare Frage nicht mehr die ganze Frage ist.'],
    ['.threshold-card .button', 'Ein privates Gespräch beginnen'],
    ['.footer-brand > p', 'Human Architecture für Leben mit Tragweite.']
  ];
  labels.forEach(([selector, value]) => text(selector, value));

  html('.hero h1', 'Beginne unterhalb<br>des Sichtbaren.');
  html('.hero-actions .text-link', 'Human Architecture entdecken <span>→</span>');
  html('.image-note', 'Mel Mihira<br><span>Gründerin / Human Architecture</span>');
  html('.manifesto h2', 'Was wäre, wenn die Antwort nicht damit beginnt, was sich ändern muss—<em>sondern mit dem Verständnis des Menschen, der es lebt?</em>');
  html('.manifesto .arrow-link', 'Die Praxis betreten<span>↗</span>');
  html('.dark-main .arrow-link', 'Private Begleitung entdecken<span>↗</span>');
  html('.framework h2', 'Beim Menschen beginnen.<br>Die Architektur erkennen.<br>Dem folgen, was sie hervorbringt.');
  html('.framework .arrow-link', 'Die Disziplin entdecken<span>↗</span>');
  html('.threshold h2', 'Das alte Leben funktioniert vielleicht noch.<br><em>Das Problem ist: Du selbst nicht mehr.</em>');

  [
    ['Identität', 'Wer musstest du werden—und ist diese Identität noch wahr?'],
    ['Zugehörigkeit', 'Was musst du von dir entfernen, um hier bleiben zu können?'],
    ['Übergang', 'Was zeigt diese Schwelle, dem Stabilität dir auszuweichen erlaubte?'],
    ['Kraft', 'Was wird möglich, wenn Wunsch, Wut und Autorität zu Information werden?']
  ].forEach(([heading, copy], index) => {
    text('.territory h3', heading, index);
    text('.territory p', copy, index);
  });

  const footer = [
    ['Erkunden', 'Die Praxis', 'Human Architecture', 'Private Begleitung'],
    ['Beginnen', 'Private Anfrage', 'Mihira per E-Mail schreiben', 'Angebote & Preise', 'Mentoring', 'Zur Human-Architecture-Startseite']
  ];
  document.querySelectorAll('.footer-links > div').forEach((group, groupIndex) => {
    group.querySelectorAll('p, a').forEach((node, index) => { node.textContent = footer[groupIndex][index]; });
  });
  text('.footer-bottom span', '© 2026 Mihira Ceremonia', 0);
  text('.footer-bottom span', 'Beim Menschen beginnen.', 1);
})();
