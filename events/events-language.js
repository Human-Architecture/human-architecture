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
  if (!german) {
    const deepRestDescription = document.querySelectorAll('.event-card')[3]?.querySelector('.event-detail > p');
    if (deepRestDescription) deepRestDescription.textContent = 'Guided breathwork, Yoga Nidra and live handpan sound in a small, held group setting.';
    return;
  }
  document.documentElement.lang = 'de';
  document.title = 'Kommende Events | Human Architecture';
  const set = (selector, text) => { const element = document.querySelector(selector); if (element) element.textContent = text; };
  const within = (parent, selector, text) => { const element = parent.querySelector(selector); if (element) element.textContent = text; };
  set('.skip', 'Direkt zu den kommenden Events');
  set('.topbar nav a[aria-current="page"]', 'Kommende Events');
  set('.topbar nav a[href="/search/"]', 'Suche');
  const search = document.querySelector('.site-search input'); if (search) search.placeholder = 'Website durchsuchen';
  set('.site-search button', 'Suchen');
  set('.events-eyebrow', 'HUMAN ARCHITECTURE® / KOMMENDE EVENTS');
  set('.events-wrap h1', 'Was als Nächstes stattfindet.');
  set('.events-lead', 'Hier findest du aktuelle Einstiegspunkte in Human Architecture und Mihira Ceremonia: Räume, um die Arbeit praktisch kennenzulernen – mit klarem Datum, Ort und nächstem Schritt. Jeder untenstehende Event ist bestätigt und bereit zur Reservierung.');
  const orientation = document.querySelector('.events-orientation');
  if (orientation) {
    orientation.setAttribute('aria-label', 'So nutzt du diese Seite');
    orientation.innerHTML = '<div><strong>01 / WÄHLE</strong><span>Finde das Format, das zu deiner aktuellen Frage, deinem Körper oder deiner Neugier passt.</span></div><div><strong>02 / INFORMIERE DICH</strong><span>Öffne die Eventseite für Einführung, Zeiten, Ort und alle Details zur Teilnahme.</span></div><div><strong>03 / RESERVIERE</strong><span>Buche direkt, wenn eine Zahlungsoption verfügbar ist, oder verschenke die Experience als Gutschein.</span></div>';
  }
  const content = [
    ['KOMMENDE SESSION','Samstag · 2026','MIHIRA CEREMONIA · RETURN','Atem, Yoga Nidra & tiefe Ruhe.','Ein geführter Abend für bewusstes Atmen, Körperwahrnehmung und die bewusste Rückkehr aus Aktivität in Ruhe.',['18:00–19:30','Sulzbach-Rosenberg','Bitte plane Zeit bis 20:00 ein','Ab 25 €'],'RETURN ansehen & Platz reservieren','RETURN als Gutschein verschenken'],
    ['KOMMENDER WORKSHOP','Samstag · 2026','BODY LANGUAGE | KÖRPERSPRACHE','Verstehe, was dein Training wirklich braucht.','Ein geführter Gruppenworkshop für Bewegung, Training und Körperbewusstsein. Du gehst mit drei persönlichen Fokusbereichen für deine nächsten Trainingsschritte.',['15:00–17:00','Clever Fit Kümmersbruck','90–120 Minuten','Ab 29 €'],'BODY LANGUAGE vor der Buchung entdecken','BODY LANGUAGE als Gutschein verschenken'],
    ['KOMMENDER ONLINEKURS','Sonntag · 2026','ADVENT OF ASTROLOGY','Vier Sonntage, um westliche Astrologie zu verstehen.','Ein Live-Onlinekurs mit vier 90-minütigen Sessions, digitalem Workbook und einer klaren, geerdeten Einführung in die westliche Astrologie.',['29. November · 6., 13. & 20. Dezember','Live online','4 × 90 Minuten','220 € · 360 € für zwei'],'Platz wählen & direkt zahlen','Den Kurs als Gutschein verschenken'],
    ['KOMMENDER ABEND','Freitag · 2026','DEEP REST · BREATHWORK · YOGA NIDRA · HANDPAN','Drei Elemente. Ein unbeschwerter Abend.','Geführtes Breathwork, Yoga Nidra und Live-Handpan-Sound in einer kleinen, gehaltenen Gruppe.',['Zen Space, Regensburg','Nur 18 Plätze','28 € pro Person','25 € pro Person bei Bring a Friend'],'DEEP REST entdecken & Ticket wählen','DEEP REST als Gutschein verschenken']
  ];
  document.querySelectorAll('.event-card').forEach((card, index) => {
    const copy = content[index]; if (!copy) return;
    within(card, '.event-date span', copy[0]); within(card, '.event-date p', copy[1]); within(card, '.event-detail small', copy[2]); within(card, 'h2', copy[3]); within(card, '.event-detail > p', copy[4]);
    card.querySelectorAll('.event-meta li').forEach((item, i) => { item.textContent = copy[5][i] || ''; });
    const actions = card.querySelectorAll('.event-action'); if (actions[0]) actions[0].textContent = copy[6]; if (actions[1]) actions[1].textContent = copy[7];
  });
  const deepRestDate = document.querySelectorAll('.event-card')[3]?.querySelector('.event-date strong');
  if (deepRestDate) deepRestDate.innerHTML = '11<br>Dez';
  const note = document.querySelector('.events-note');
  if (note) note.innerHTML = '<strong>Suchst du einen zukünftigen Termin?</strong> Weitere Workshops und Gastgeber-Kooperationen sind in Planung. <a href="mailto:hello@human-architecture.info?subject=Upcoming%20Human%20Architecture%20events">Sag uns, wo du teilnehmen möchtest</a>, oder entdecke <a href="/body-language/partners/">BODY LANGUAGE als Host-Format</a>.';
  document.querySelectorAll('.events-nav a').forEach((link, index) => { link.textContent = ['Workshop entdecken', 'Kooperationen', 'Website durchsuchen'][index]; });
});
