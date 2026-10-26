document.addEventListener('DOMContentLoaded', () => {
  const entry = document.querySelector('#find-your-way');
  if (!entry || entry.dataset.threeDomainHierarchy === 'true') return;

  const german = new URLSearchParams(location.search).get('lang') === 'de';
  entry.dataset.threeDomainHierarchy = 'true';

  const eyebrow = entry.querySelector('.ha-entry-eyebrow');
  const heading = entry.querySelector('#ha-entry-title');
  const introduction = entry.querySelector('.ha-entry-intro > p:not(.ha-entry-eyebrow)');
  if (eyebrow) {
    eyebrow.dataset.de = 'DREI WEGE HINEIN';
    eyebrow.dataset.en = 'THREE WAYS IN';
    eyebrow.textContent = german ? eyebrow.dataset.de : eyebrow.dataset.en;
  }
  if (heading) {
    heading.dataset.de = 'Beginne mit dem, was gerade da ist.';
    heading.dataset.en = 'Start with what is most present.';
    heading.textContent = german ? heading.dataset.de : heading.dataset.en;
  }
  if (introduction) {
    introduction.dataset.de = 'Du musst nicht zuerst alle Angebote vergleichen. Beginne mit dem Bereich, der gerade am meisten Präsenz hat. Von dort aus siehst du passende Formate und deinen nächsten Schritt.';
    introduction.dataset.en = 'You do not need to compare every offer first. Begin with the area that feels most present now. From there, you can see the relevant formats and your next step.';
    introduction.textContent = german ? introduction.dataset.de : introduction.dataset.en;
  }

  const cards = [
    {
      href: '/codex/',
      title: german ? 'Ich möchte mich selbst besser verstehen.' : 'I want to understand myself.',
      label: german ? 'BLUEPRINT · CODEX' : 'BLUEPRINT · CODEX',
      copy: german ? 'Erkunde wiederkehrende Muster, Entscheidungen und deinen aktuellen Kontext.' : 'Explore recurring patterns, decisions and your current context.'
    },
    {
      href: '/sessions/',
      title: german ? 'Ich möchte wieder mit meinem Körper in Verbindung kommen.' : 'I want to reconnect with my body.',
      label: german ? 'KÖRPER & REGULATION' : 'BODY & REGULATION',
      copy: german ? 'Finde einen passenden Rahmen für Körperarbeit, Bewegung, Regulation und Erholung.' : 'Find an appropriate setting for bodywork, movement, regulation and recovery.'
    },
    {
      href: '/mihira-ceremonia/',
      title: german ? 'Ich befinde mich in einem Übergang.' : 'I am navigating a transition.',
      label: german ? 'IDENTITÄT & ÜBERGANG' : 'IDENTITY & TRANSITION',
      copy: german ? 'Erkunde einen bedeutsamen Übergang mit Raum für Identität, Bedeutung und Integration.' : 'Explore a meaningful transition with room for identity, meaning and integration.'
    }
  ];

  const grid = entry.querySelector('.ha-entry-grid');
  if (grid) {
    grid.innerHTML = cards.map(card => `<a class="ha-entry-card" href="${card.href}"><p class="ha-entry-card__domain">${card.label}</p><h3>${card.title}</h3><p>${card.copy}</p><span>${german ? 'Diesen Bereich entdecken →' : 'Explore this domain →'}</span></a>`).join('');
  }

  const bottom = entry.querySelector('.ha-entry-bottom');
  if (bottom) {
    const organisationRoute = german ? '/organizations/?lang=de' : '/organizations/international/';
    bottom.innerHTML = `<a href="/angebote/">${german ? 'Alle Angebote und Kontexte ansehen' : 'Explore all offers and contexts'}</a><a href="${organisationRoute}">${german ? 'Für Teams, Schulen und Organisationen' : 'For teams, schools and organisations'}</a>`;
  }
});
