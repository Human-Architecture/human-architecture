document.addEventListener('DOMContentLoaded', () => {
  const german = new URLSearchParams(window.location.search).get('lang') === 'de';
  const header = document.querySelector('.topbar');
  if (header && !header.querySelector('.events-language')) {
    const language = document.createElement('nav');
    language.className = 'events-language';
    language.setAttribute('aria-label', 'Language');
    language.innerHTML = `<a href="/events/"${german ? '' : ' aria-current="page"'}>EN</a><a href="/events/?lang=de"${german ? ' aria-current="page"' : ''}>DE</a>`;
    header.appendChild(language);
  }

  if (!german) return;

  document.documentElement.lang = 'de';
  document.title = 'Kommende Events | Human Architecture';
  const set = (selector, text) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  };
  set('.skip', 'Direkt zu den kommenden Events');
  set('.topbar nav a[aria-current="page"]', 'Kommende Events');
  set('.topbar nav a[href="/search/"]', 'Suche');
  const search = document.querySelector('.site-search input');
  if (search) search.placeholder = 'Website durchsuchen';
  set('.site-search button', 'Suchen');
  set('.events-eyebrow', 'HUMAN ARCHITECTURE / KOMMENDE EVENTS');
  set('.events-wrap h1', 'Was als Nächstes stattfindet.');

  const journeys = {
    'event-card--body-language': {
      detail: 'BODY LANGUAGE | KÖRPERSPRACHE',
      title: 'Verstehe, was dein Training wirklich braucht.',
      description: 'Ein geführter Gruppenworkshop für Bewegung, Training und Körperbewusstsein. Du gehst mit drei persönlichen Fokusbereichen für deine nächsten Trainingsschritte.',
      actions: ['BODY LANGUAGE entdecken', 'Platz wählen & direkt zahlen', 'Als Gutschein schenken']
    },
    'event-card--astrology': {
      detail: 'ADVENT OF ASTROLOGY',
      title: 'Vier Sonntage, um westliche Astrologie zu verstehen.',
      description: 'Ein Live-Onlinekurs mit vier 90-minütigen Sessions, digitalem Workbook und einer klaren, geerdeten Einführung in die westliche Astrologie.',
      actions: ['Kurs entdecken', 'Platz wählen & direkt zahlen', 'Als Gutschein schenken']
    },
    'event-card--deep-rest': {
      detail: 'DEEP REST · BREATHWORK · YOGA NIDRA · HANDPAN',
      title: 'Drei Elemente. Ein unbeschwerter Abend.',
      description: 'Geführtes Breathwork, Yoga Nidra und Live-Handpan-Sound in einer kleinen, gehaltenen Gruppe.',
      actions: ['DEEP REST entdecken', 'Ticket wählen & direkt zahlen', 'Als Gutschein schenken']
    }
  };

  Object.entries(journeys).forEach(([className, copy]) => {
    const card = document.querySelector(`.${className}`);
    if (!card) return;
    const detail = card.querySelector('.event-detail small');
    const title = card.querySelector('.event-detail h2');
    const description = card.querySelector('.event-detail > p');
    if (detail) detail.textContent = copy.detail;
    if (title) title.textContent = copy.title;
    if (description) description.textContent = copy.description;
    card.querySelectorAll('.event-action').forEach((action, index) => {
      if (copy.actions[index]) action.textContent = copy.actions[index];
    });
  });
});
