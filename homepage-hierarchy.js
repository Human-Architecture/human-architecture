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

  // The homepage is the orientation layer. The compact bar is useful on
  // interior pages, but duplicates the main navigation here.
  document.querySelector('.site-header + .ha-wayfinding')?.remove();

  // Keep a route for visitors who are still unsure, without asking them to
  // make the same three-domain choice for a second time further down the page.
  const guidedOrientation = document.querySelector('#entry-point');
  if (guidedOrientation) {
    guidedOrientation.classList.add('entry--compact-orientation');
    guidedOrientation.querySelector('.entry-domain-selector')?.remove();
    guidedOrientation.querySelectorAll('[data-entry-detail], [data-entry-result]').forEach(element => element.remove());

    const marker = guidedOrientation.querySelector('.section-marker p');
    const title = guidedOrientation.querySelector('#entry-title');
    const copy = [...guidedOrientation.querySelectorAll('.entry__heading > p')]
      .find(paragraph => !paragraph.querySelector('a'));
    const link = guidedOrientation.querySelector('.entry__heading .line-link');

    if (marker) {
      marker.dataset.de = 'NOCH UNSICHER?';
      marker.dataset.en = 'NOT SURE YET?';
      marker.textContent = german ? marker.dataset.de : marker.dataset.en;
    }
    if (title) {
      title.dataset.de = 'Finde deinen passenden nächsten Schritt.';
      title.dataset.en = 'Find the next step that fits.';
      title.textContent = german ? title.dataset.de : title.dataset.en;
    }
    if (copy) {
      copy.dataset.de = 'Wenn keiner der drei Wege oben ganz passt, führt dich eine kurze Orientierung zu einem klaren, passenden Einstieg.';
      copy.dataset.en = 'If none of the three pathways above feels quite right, a short orientation will guide you to one clear, appropriate starting point.';
      copy.textContent = german ? copy.dataset.de : copy.dataset.en;
    }
    if (link) {
      link.textContent = german ? 'Geführte Orientierung starten →' : 'Start the guided orientation →';
    }
  }

  // Keep detailed formats and specialist contexts in their own destinations.
  // On the homepage they become one quiet bridge, rather than another long
  // set of choices after the visitor has already chosen a primary domain.
  const deeperSections = ['#domains', '#offerings', '#life-contexts', '#partnerships'];
  const firstDeeperSection = document.querySelector(deeperSections[0]);
  deeperSections.forEach(selector => document.querySelector(selector)?.remove());

  if (firstDeeperSection) {
    const routes = [
      {
        href: '/angebote/',
        eyebrow: german ? 'FORMATE & ANGEBOTE' : 'FORMATS & OFFERS',
        title: german ? 'Alle Möglichkeiten im Überblick.' : 'See every format in one place.',
        copy: german ? 'Für einen ruhigen Vergleich der einzelnen Angebote und Einstiege.' : 'For a calm comparison of individual offers and points of entry.',
        action: german ? 'Alle Angebote ansehen →' : 'Explore all offers →'
      },
      {
        href: german ? '/organizations/?lang=de' : '/organizations/international/',
        eyebrow: german ? 'ORGANISATIONEN & SCHULEN' : 'ORGANISATIONS & SCHOOLS',
        title: german ? 'Für Teams, Schulen und Arbeitskontexte.' : 'For teams, schools and working contexts.',
        copy: german ? 'Workshops und Begleitung, die am konkreten Kontext einer Gruppe ansetzen.' : 'Workshops and support that begin with the specific context of a group.',
        action: german ? 'Organisationen entdecken →' : 'Explore organisations →'
      },
      {
        href: '/kooperationen/',
        eyebrow: german ? 'KOOPERATIONEN' : 'PARTNERSHIPS',
        title: german ? 'Für gemeinsame Vorhaben.' : 'For shared initiatives.',
        copy: german ? 'Für Orte, Projekte und Menschen, die eine Zusammenarbeit ausloten möchten.' : 'For places, projects and people who would like to explore a collaboration.',
        action: german ? 'Kooperationen ansehen →' : 'Explore partnerships →'
      }
    ];

    const bridge = document.createElement('section');
    bridge.className = 'section homepage-deeper-routes';
    bridge.setAttribute('aria-labelledby', 'deeper-routes-title');
    bridge.innerHTML = `<div class="homepage-deeper-routes__inner"><div class="homepage-deeper-routes__intro"><p>${german ? 'WEITERE WEGE' : 'FURTHER ROUTES'}</p><h2 id="deeper-routes-title">${german ? 'Vertiefe dort, wo es für dich relevant wird.' : 'Go deeper where it becomes relevant to you.'}</h2><p>${german ? 'Die Hauptorientierung beginnt oben. Diese Wege sind für besondere Kontexte, gemeinsame Vorhaben oder einen genaueren Vergleich da.' : 'The main orientation begins above. These routes are here for specific contexts, shared initiatives or a closer comparison.'}</p></div><div class="homepage-deeper-routes__grid">${routes.map(route => `<a href="${route.href}"><p>${route.eyebrow}</p><h3>${route.title}</h3><span>${route.copy}</span><strong>${route.action}</strong></a>`).join('')}</div></div>`;
    guidedOrientation?.insertAdjacentElement('afterend', bridge);
  }

  // Current events are a more immediate next step than gifting, while the
  // voucher remains close by for visitors who arrive with that intention.
  const events = document.querySelector('.homepage-events');
  const voucher = document.querySelector('.homepage-voucher');
  if (events && voucher) events.insertAdjacentElement('afterend', voucher);
});
