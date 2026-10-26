document.addEventListener('DOMContentLoaded', () => {
  const q = new URLSearchParams(location.search);
  const isNewPage = document.body.classList.contains('ha-growth');
  const allowedSources = new Set(['familien','babymesse','gutscheine','codex','sessions','gruender','mihira-ceremonia','kooperationen']);
  const source = allowedSources.has(q.get('source')) ? q.get('source') : (document.body.dataset.page || 'website');
  let language = q.get('lang') === 'en' ? 'en' : (document.documentElement.lang || 'de');
  document.querySelectorAll('.ha-menu nav').forEach(nav => {
    if (nav.querySelector('a[href^="/angebote/"]')) return;
    const entry = document.createElement('a');
    entry.href = '/angebote/'; entry.className = 'ha-nav-link';
    entry.dataset.de = 'Angebote & Orientierung'; entry.dataset.en = 'Offers & orientation';
    entry.textContent = language === 'en' ? entry.dataset.en : entry.dataset.de;
    nav.prepend(entry);
  });
  const choices = {mama:'Mama Bodywork',baby:'Baby Codex — 189 €',familie:'Mama × Baby / Familien-Codex',codex:'Persönlicher Codex',persoenlich:'Persönliche Session',body_language:'BODY LANGUAGE Workshop',return:'RETURN · November Session',deep_rest:'DEEP REST · Sound Journey & Handpan',codex_2027:'Codex 2027 annual compass',offen:'Beratung zur Gutscheinwahl'};
  const voucherPayments = {body_language:'https://www.paypal.com/ncp/payment/3KLLWQT9J7SWC',return:'https://www.paypal.com/ncp/payment/JUWR5VTDJ5Z74',deep_rest:'https://www.paypal.com/ncp/payment/VUK9C4886BGCG',codex_2027:'https://www.paypal.com/ncp/payment/726WVHHFGVKRA',codex_2027_october:'https://www.paypal.com/ncp/payment/3JYEWHJDKD58G'};
  const voucher = document.getElementById('voucher-choice');
  const voucherLink = document.querySelector('.ha-voucher-link');

  if (document.body.classList.contains('method-page')) {
    const existingFounderCss = [...document.querySelectorAll('link[rel="stylesheet"]')].find(link => link.href.includes('founder-update.css'));
    if (existingFounderCss) existingFounderCss.href = '/founder-update.css?v=11';
    else {
      const founderStyles = document.createElement('link');
      founderStyles.rel = 'stylesheet';
      founderStyles.href = '/founder-update.css?v=11';
      document.head.appendChild(founderStyles);
    }

    const founder = document.getElementById('founder');
    if (founder) {
      let figure = founder.querySelector('.method-founder-figure');
      if (!figure) {
        figure = document.createElement('figure');
        figure.className = 'method-founder-figure';
        figure.innerHTML = '<img src="/assets/portraits/mel-organizations-founder-v2.png" alt="Mel Mihira, Founder and System Architect of Human Architecture" width="1122" height="1402" loading="lazy"><figcaption>Mel Mihira · Founder &amp; System Architect</figcaption>';
        founder.querySelector('h2')?.after(figure);
      }
      const founderImg = figure.querySelector('img');
      if (founderImg) founderImg.src = '/assets/portraits/mel-organizations-founder-v2.png';

      // The public method page uses the composed founder portrait only. An
      // informal secondary image would dilute the calm, professional context.
      if (document.body.dataset.showFounderLightness === 'true' && !founder.querySelector('.method-founder-lightness')) {
        const panel = document.createElement('div');
        panel.className = 'method-founder-lightness';
        panel.innerHTML = '<figure><div class="method-founder-lightness__image"><img src="data:image/jpeg;base64,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" alt="Mel Mihira laughing while holding a banana like a telephone" loading="lazy"></div></figure><blockquote><p>There is more than one angle on every reality. Let’s explore the lens through which you experience yours.</p><footer>Human Architecture</footer></blockquote></div>';
        const valuesLink = founder.querySelector('a[href*="values"]')?.closest('p');
        if (valuesLink) valuesLink.before(panel);
        else founder.appendChild(panel);
      }

      if (!founder.querySelector('.method-founder-links')) {
        const nextSteps = document.createElement('nav');
        nextSteps.className = 'method-founder-links';
        nextSteps.setAttribute('aria-label', 'Continue exploring Mel Mihira’s work');
        nextSteps.innerHTML = '<span class="method-founder-links__label">Continue exploring</span><a href="/mihira-ceremonia/">Explore Mihira Ceremonia <span aria-hidden="true">→</span></a><a href="/mihira-ceremonia/mel/#western-chart">View Mel’s personal chart <span aria-hidden="true">→</span></a>';
        founder.appendChild(nextSteps);
      }
    }
  }

  const founderPlaceholder = document.querySelector('#about .about__portrait-placeholder');
  if (founderPlaceholder) {
    const figure = document.createElement('figure');
    figure.className = 'about__portrait reveal is-visible';
    figure.innerHTML = '<img src="/assets/portraits/mel-organizations-founder-v2.png" alt="Mel Mihira, Founder and System Architect of Human Architecture" width="1122" height="1402" loading="lazy"><figcaption data-en="Mel Mihira · Founder &amp; System Architect" data-de="Mel Mihira · Gründerin &amp; Systemarchitektin">Mel Mihira · Founder &amp; System Architect</figcaption>';
    founderPlaceholder.replaceWith(figure);
  }

  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    const eyebrow = aboutSection.querySelector('.eyebrow');
    const title = aboutSection.querySelector('#about-title');
    const lead = aboutSection.querySelector('.lead');
    if (eyebrow) { eyebrow.dataset.en = 'Founder & Origin'; eyebrow.dataset.de = 'Gründerin & Entstehung'; eyebrow.textContent = language === 'de' ? eyebrow.dataset.de : eyebrow.dataset.en; }
    if (title) { title.dataset.en = 'Human Architecture begins with the human — and was built by Mel Mihira around that principle.'; title.dataset.de = 'Human Architecture beginnt beim Menschen – und wurde von Mel Mihira genau um dieses Prinzip herum entwickelt.'; title.textContent = language === 'de' ? title.dataset.de : title.dataset.en; }
    if (lead) { lead.dataset.en = 'Mel Mihira developed Human Architecture as an interdisciplinary system for understanding inherent structure, lived embodiment and human context without reducing a person to a single method.'; lead.dataset.de = 'Mel Mihira entwickelte Human Architecture als interdisziplinäres System, um angelegte Struktur, gelebte Verkörperung und menschlichen Kontext zu verstehen – ohne einen Menschen auf eine einzelne Methode zu reduzieren.'; lead.textContent = language === 'de' ? lead.dataset.de : lead.dataset.en; }
  }

  // Keep the organisation pathway explicit: a tailored yoga option belongs
  // alongside BODY LANGUAGE, RETURN and DEEP REST, not hidden inside Yoga Nidra.
  if (document.body.dataset.page === 'organizations') {
    const founderImage = document.querySelector('#begleitung .org-founder');
    if (founderImage) {
      founderImage.src = '/assets/portraits/mel-organizations-founder-v2.png';
      founderImage.alt = 'Mel Mihira, Founder and System Architect of Human Architecture';
      founderImage.width = 1122;
      founderImage.height = 1402;
      founderImage.style.objectPosition = 'center center';
    }
    const heroActions = document.querySelector('.org-hero .org-actions');
    if (heroActions && !heroActions.querySelector('[href="#erlebnisformate"]')) {
      const experienceRoute = document.createElement('a');
      experienceRoute.className = 'org-button org-button--ghost';
      experienceRoute.href = '#erlebnisformate';
      experienceRoute.dataset.de = 'Eventformate für Teamtage';
      experienceRoute.dataset.en = 'Hosted formats for team days';
      experienceRoute.textContent = language === 'en' ? experienceRoute.dataset.en : experienceRoute.dataset.de;
      heroActions.append(experienceRoute);
    }
    const experienceCard = document.querySelector('#erlebnisformate .org-card:nth-child(3)');
    const number = experienceCard?.querySelector('.org-card__num');
    const title = experienceCard?.querySelector('h3');
    const copy = experienceCard?.querySelector('p');
    const link = experienceCard?.querySelector('a');
    if (number && title && copy && link) {
      number.dataset.de = '03 · YOGA, NIDRA & KLANG';
      number.dataset.en = '03 · YOGA, NIDRA & SOUND';
      title.dataset.de = 'YOGA & DEEP REST';
      title.dataset.en = 'YOGA & DEEP REST';
      copy.dataset.de = 'Ein ruhig geführtes Gruppenformat mit Yoga oder angeleiteter Bewegung, Yoga Nidra und auf Wunsch Live-Handpan-Klang. Für interne Veranstaltungen, Retreats oder Räume, die einen entschleunigten Abschluss oder einen bewussten Übergang ermöglichen möchten.';
      copy.dataset.en = 'A calmly guided group format with yoga or guided movement, Yoga Nidra and optional live handpan sound. For internal events, retreats or spaces that want to offer an unhurried close or a deliberate transition.';
      link.dataset.de = 'YOGA & DEEP REST kennenlernen';
      link.dataset.en = 'Explore YOGA & DEEP REST';
      [number, title, copy, link].forEach(element => {
        element.textContent = language === 'en' ? element.dataset.en : element.dataset.de;
      });
    }
    const enquiry = document.querySelector('#erlebnisformate .org-actions a');
    if (enquiry) {
      const makeMailto = (subject, body) => `mailto:hello@human-architecture.info?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      enquiry.dataset.hrefDe = makeMailto(
        'Anfrage · Eventformat für Organisationen',
        'Organisation:\nGewünschtes Format (BODY LANGUAGE / RETURN / YOGA & DEEP REST / noch offen):\nGruppe und Anlass:\nOrt und gewünschter Zeitraum:\nErwarteter Rahmen (z. B. Teamtag, Offsite, internes Event):\n'
      );
      enquiry.dataset.hrefEn = makeMailto(
        'Enquiry · Hosted experience for an organisation',
        'Organisation:\nPreferred format (BODY LANGUAGE / RETURN / YOGA & DEEP REST / not yet decided):\nGroup and occasion:\nLocation and preferred timeframe:\nExpected setting (e.g. team day, offsite, internal event):\n'
      );
      enquiry.href = language === 'en' ? enquiry.dataset.hrefEn : enquiry.dataset.hrefDe;
    }
  }

  // The sessions overview has many valid formats. Make the first decision about
  // the visitor's intention, then keep each individual choice connected to a
  // prepared enquiry rather than asking them to decode the entire price list.
  if (document.body.dataset.page === 'sessions') {
    const sessionOverview = document.getElementById('schwerpunkte');
    if (sessionOverview && !document.querySelector('.ha-session-decision-guide')) {
      const guide = document.createElement('section');
      guide.className = 'ha-session-decision-guide';
      guide.setAttribute('aria-labelledby', 'session-decision-title');
      guide.innerHTML = `
        <p class="ha-eyebrow" data-de="DEIN AUSGANGSPUNKT" data-en="YOUR STARTING POINT">DEIN AUSGANGSPUNKT</p>
        <h2 id="session-decision-title" data-de="Du musst die Methode nicht selbst auswählen." data-en="You do not need to choose the method yourself.">Du musst die Methode nicht selbst auswählen.</h2>
        <p data-de="Beginne bei dem, was du gerade brauchst. Öffne bei jeder Session zuerst Mehr über diese Session, wenn du Ablauf und Rahmen genauer verstehen möchtest. Danach kannst du gezielt anfragen – oder dein Anliegen zuerst beschreiben." data-en="Begin with what you need right now. Open More about this session on any option when you want to understand its process and scope first. Then enquire specifically—or simply describe your situation first.">Beginne bei dem, was du gerade brauchst. Öffne bei jeder Session zuerst Mehr über diese Session, wenn du Ablauf und Rahmen genauer verstehen möchtest. Danach kannst du gezielt anfragen – oder dein Anliegen zuerst beschreiben.</p>
        <div class="ha-session-decision-grid">
          <a href="#struktur"><strong data-de="Klarheit über deinen Fokus" data-en="Clarity about your focus">Klarheit über deinen Fokus</strong><span data-de="Für Orientierung und einen strukturierten Blick auf dein Anliegen." data-en="For orientation and a structured view of what brings you here.">Für Orientierung und einen strukturierten Blick auf dein Anliegen.</span></a>
          <a href="#koerperarbeit"><strong data-de="Hands-on Körperarbeit" data-en="Hands-on bodywork">Hands-on Körperarbeit</strong><span data-de="Für vereinbarte Berührung, Massage oder manuelle Arbeit am Körper." data-en="For agreed touch, massage or manual work with the body.">Für vereinbarte Berührung, Massage oder manuelle Arbeit am Körper.</span></a>
          <a href="#regulation"><strong data-de="Ruhe, Atem &amp; Wahrnehmung" data-en="Rest, breath &amp; awareness">Ruhe, Atem &amp; Wahrnehmung</strong><span data-de="Für einen ruhigeren, angeleiteten Rahmen ohne Leistungsdruck." data-en="For a calmer guided setting without performance pressure.">Für einen ruhigeren, angeleiteten Rahmen ohne Leistungsdruck.</span></a>
          <a href="#bewegung"><strong data-de="Bewegung integrieren" data-en="Integrate movement">Bewegung integrieren</strong><span data-de="Für individuell angeleitete Bewegung, Koordination und Praxis im Alltag." data-en="For individual guided movement, coordination and everyday practice.">Für individuell angeleitete Bewegung, Koordination und Praxis im Alltag.</span></a>
        </div>
        <p class="ha-session-decision-note" data-de="Noch unsicher? Das ist ausdrücklich in Ordnung: Beschreibe einfach dein Anliegen – die passende Session wird vor einer Buchung abgestimmt." data-en="Not sure yet? That is completely fine: simply describe your situation — the right session is agreed before any booking.">Noch unsicher? Das ist ausdrücklich in Ordnung: Beschreibe einfach dein Anliegen – die passende Session wird vor einer Buchung abgestimmt.</p>
        <aside class="ha-session-calendar" aria-label="Dezember-Termine / December appointments">
          <p class="ha-eyebrow" data-de="DEZEMBER · VOR ORT IN REGENSBURG" data-en="DECEMBER · IN PERSON IN REGENSBURG">DEZEMBER · VOR ORT IN REGENSBURG</p>
          <h3 data-de="Mittwochs Zeit für deinen Körper reservieren." data-en="Reserve dedicated time for your body on Wednesdays.">Mittwochs Zeit für deinen Körper reservieren.</h3>
          <p data-de="Im Dezember sind persönliche 60-Minuten-Sessions mittwochs von 14:00 bis 20:00 Uhr geöffnet. Sichere zuerst deine Terminreservierung mit der Anzahlung von 50 €. Danach wählst du deinen passenden Zeitpunkt; den konkreten Schwerpunkt und Gesamtpreis stimmen wir vorab transparent mit dir ab." data-en="In December, personal 60-minute sessions are open on Wednesdays from 14:00 to 20:00. First secure your appointment reservation with the €50 deposit. Then choose a suitable time; we agree the exact focus and total price transparently with you in advance.">Im Dezember sind persönliche 60-Minuten-Sessions mittwochs von 14:00 bis 20:00 Uhr geöffnet. Sichere zuerst deine Terminreservierung mit der Anzahlung von 50 €. Danach wählst du deinen passenden Zeitpunkt; den konkreten Schwerpunkt und Gesamtpreis stimmen wir vorab transparent mit dir ab.</p>
          <a class="ha-button" href="https://www.paypal.com/ncp/payment/VUNMZJSTF7RKL" target="_blank" rel="noopener noreferrer" data-de="50-€-Anzahlung sicher bezahlen" data-en="Pay €50 reservation deposit securely">50-€-Anzahlung sicher bezahlen</a>
          <p class="ha-session-calendar__step" data-de="Nach der Zahlung: Wähle unten deinen Termin im Kalender." data-en="After payment: choose your appointment below in the calendar.">Nach der Zahlung: Wähle unten deinen Termin im Kalender.</p>
          <span class="ha-calendar-button" data-google-calendar-button aria-live="polite"></span>
          <a class="ha-button" data-calendar-fallback href="https://calendar.app.google/gEQVX4PvnKgXKvE7A" target="_blank" rel="noopener noreferrer" data-de="Nach Anzahlung: 60-Minuten-Termin wählen" data-en="After deposit: choose a 60-minute appointment">Nach Anzahlung: 60-Minuten-Termin wählen</a>
        </aside>
      `;
      sessionOverview.before(guide);
    }

    const sessionExplanations = {
      'Strukturelle Analyse': {
        de: 'Eine orientierende Session, wenn du zuerst verstehen möchtest, was du im Alltag oder beim Bewegen wahrnimmst. Wir halten fest, welcher Schwerpunkt für dich sinnvoll ist; daraus entsteht keine medizinische Diagnose.',
        en: 'An orienting session for when you first want to understand what you notice in everyday life or movement. We identify a useful focus together; this is not a medical diagnosis.'
      },
      'Strukturelle manuelle Körperarbeit': {
        de: 'Für vereinbarte Berührung und sanfte Mobilisation. Vor Beginn klären wir Bereiche, Position, Druck und dein Einverständnis; währenddessen kannst du alles jederzeit verändern.',
        en: 'For agreed touch and gentle mobilisation. Before starting, we clarify areas, position, pressure and consent; you can change any of these at any time.'
      },
      'Fasziales Scraping': {
        de: 'Eine instrumentengestützte Form der Körperarbeit. Ablauf, mögliche vorübergehende Hautspuren und die Frage, ob dieser Ansatz gerade passend ist, werden vorher transparent besprochen.',
        en: 'A tool-assisted form of bodywork. The process, possible temporary skin marks and whether this approach fits your situation are discussed transparently beforehand.'
      },
      'Chi Nei Tsang': {
        de: 'Eine körperorientierte Session mit Fokus auf den Bauchraum. Wir sprechen vorab über Berührung, Intensität und mögliche Gründe, diesen Bereich nicht einzubeziehen.',
        en: 'A body-focused session centred on the abdominal area. We discuss touch, intensity and any reason not to include this area beforehand.'
      },
      'Craniosacrale Körperarbeit': {
        de: 'Ein ruhiger, sanfter Berührungsrahmen mit Raum für Wahrnehmung und Entspannung. Er dient nicht der Behandlung neurologischer oder anderer Erkrankungen.',
        en: 'A calm, gentle touch-based setting with room for awareness and rest. It is not treatment for neurological or other conditions.'
      },
      'Massage': {
        de: 'Manuelle Körperarbeit für einen gemeinsam gewählten Bereich. Du bestimmst mit, welche Intensität sich stimmig anfühlt und welche Bereiche nicht einbezogen werden sollen.',
        en: 'Hands-on bodywork for an area chosen together. You help determine the intensity that feels right and any areas that should not be included.'
      },
      'Cupping': {
        de: 'Eine Anwendung an vorab vereinbarten Bereichen. Wir besprechen Ablauf, mögliche Hautspuren und ob die Anwendung für dich gerade in Frage kommt.',
        en: 'An application to areas agreed in advance. We discuss the process, possible skin marks and whether it is appropriate for you at this time.'
      },
      'Breathwork': {
        de: 'Angeleitete Atem- und Wahrnehmungsübungen in einem abgestimmten Tempo. Vorher wird geklärt, welche Technik und welcher Rahmen zu dir passen.',
        en: 'Guided breathing and awareness practices at an agreed pace. We clarify beforehand which technique and scope fit you.'
      },
      'Yoga Nidra': {
        de: 'Eine angeleitete Ruhepraxis im Liegen oder einer anderen passenden Position. Du musst nichts leisten; wir finden eine Lagerung, in der du gut bleiben kannst.',
        en: 'A guided rest practice lying down or in another suitable position. There is nothing to perform; we find a position you can comfortably stay in.'
      },
      'Klangsession': {
        de: 'Ein ruhiger Raum für Klang und Wahrnehmung. Instrumente, Lautstärke, Position und der gewünschte Rahmen werden vorab gemeinsam abgestimmt.',
        en: 'A calm space for sound and awareness. Instruments, volume, position and the desired scope are agreed together beforehand.'
      },
      'Strukturelle Yoga-Integration': {
        de: 'Individuell angeleitete Bewegung mit Fokus auf Mobilität, Koordination und alltagstaugliche Praxis. Übungen werden an deinen aktuellen Rahmen angepasst.',
        en: 'Individually guided movement focused on mobility, coordination and practical everyday use. Movements are adapted to your current context.'
      },
      'Calamus Ceremony': {
        de: 'Ein eigener, bewusst abgegrenzter Rahmen mit äußerlicher botanischer Anwendung. Bestandteile, Hautkontakt, Ablauf und Eignung werden vor einer Buchung ausführlich erklärt.',
        en: 'A separate, deliberately bounded format involving external botanical application. Components, skin contact, process and suitability are explained in detail before booking.'
      },
      'Human Architecture® Intensive': {
        de: 'Ein längerer Termin für ein Anliegen, das mehr Zeit und einen klar abgestimmten Rahmen braucht. Welche Ansätze verbunden werden und ob ein Codex sinnvoll ist, klären wir im Vorgespräch.',
        en: 'An extended appointment for a situation that needs more time and a clearly agreed scope. We clarify in advance which approaches may be combined and whether a Codex is useful.'
      }
    };

    document.querySelectorAll('.ha-session-row').forEach(row => {
      if (row.querySelector('.ha-session-request')) return;
      const title = row.querySelector('h4');
      if (!title) return;
      const name = title.textContent.trim();
      const content = sessionExplanations[name];
      const copy = row.querySelector('div');
      if (content && copy) {
        const details = document.createElement('details');
        details.className = 'ha-session-more';
        details.innerHTML = `<summary data-de="Mehr über diese Session" data-en="More about this session">Mehr über diese Session</summary><p data-de="${content.de}" data-en="${content.en}">${language === 'en' ? content.en : content.de}</p>${row.closest('#koerperarbeit') ? '<a class="ha-session-info-link" href="/sessions/koerperarbeit/" data-de="Ablauf, Einverständnis &amp; praktische Informationen" data-en="Process, consent &amp; practical information">Ablauf, Einverständnis &amp; praktische Informationen</a>' : ''}`;
        copy.appendChild(details);
      }
      const link = document.createElement('a');
      link.className = 'ha-session-request ha-text-link';
      link.href = `mailto:hello@human-architecture.info?subject=${encodeURIComponent(`Anfrage: ${name}`)}&body=${encodeURIComponent(`Ich interessiere mich für ${name}.\n\nMein Anliegen / meine Frage:\n\nGewünschter Zeitraum:\n\n` )}`;
      link.dataset.de = 'Diese Session anfragen';
      link.dataset.en = 'Enquire about this session';
      link.textContent = language === 'en' ? link.dataset.en : link.dataset.de;
      copy?.appendChild(link);
    });
  }

  if (location.pathname.includes('/sessions/koerperarbeit/') && !document.querySelector('.ha-session-calendar')) {
    const enquiry = document.getElementById('anfragen');
    if (enquiry) {
      const calendar = document.createElement('aside');
      calendar.className = 'ha-session-calendar';
      calendar.innerHTML = `
        <p class="ha-eyebrow" data-de="DEZEMBER · VOR ORT IN REGENSBURG" data-en="DECEMBER · IN PERSON IN REGENSBURG">DEZEMBER · VOR ORT IN REGENSBURG</p>
        <h3 data-de="Direkt einen 60-Minuten-Termin wählen." data-en="Choose a 60-minute appointment directly.">Direkt einen 60-Minuten-Termin wählen.</h3>
        <p data-de="Für Dezember sind persönliche 60-Minuten-Sessions mittwochs zwischen 14:00 und 20:00 Uhr geöffnet. Sichere zuerst deine Terminreservierung mit der Anzahlung von 50 €. Danach wählst du deinen Termin; Fokus und Gesamtpreis stimmen wir vorab transparent mit dir ab." data-en="For December, personal 60-minute sessions are open on Wednesdays from 14:00 to 20:00. First secure your appointment reservation with the €50 deposit. Then choose your time; we agree the focus and total price transparently with you in advance.">Für Dezember sind persönliche 60-Minuten-Sessions mittwochs zwischen 14:00 und 20:00 Uhr geöffnet. Sichere zuerst deine Terminreservierung mit der Anzahlung von 50 €. Danach wählst du deinen Termin; Fokus und Gesamtpreis stimmen wir vorab transparent mit dir ab.</p>
        <a class="ha-button" href="https://www.paypal.com/ncp/payment/VUNMZJSTF7RKL" target="_blank" rel="noopener noreferrer" data-de="50-€-Anzahlung sicher bezahlen" data-en="Pay €50 reservation deposit securely">50-€-Anzahlung sicher bezahlen</a>
        <p class="ha-session-calendar__step" data-de="Nach der Zahlung: Wähle unten deinen Termin im Kalender." data-en="After payment: choose your appointment below in the calendar.">Nach der Zahlung: Wähle unten deinen Termin im Kalender.</p>
        <span class="ha-calendar-button" data-google-calendar-button aria-live="polite"></span>
        <a class="ha-button" data-calendar-fallback href="https://calendar.app.google/gEQVX4PvnKgXKvE7A" target="_blank" rel="noopener noreferrer" data-de="Nach Anzahlung: 60-Minuten-Termin wählen" data-en="After deposit: choose a 60-minute appointment">Nach Anzahlung: 60-Minuten-Termin wählen</a>
      `;
      enquiry.querySelector('p')?.after(calendar);
    }
  }

  // Google Calendar's approved appointment-scheduling popup. The normal link
  // remains in the markup as a reliable fallback if a visitor blocks third-party scripts.
  const calendarTargets = [...document.querySelectorAll('[data-google-calendar-button]')];
  if (calendarTargets.length) {
    const calendarUrl = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2uorW7EkFDVLcQXqHF1__AJDN6SlfsK9mhFuL4yCyPJ47yKL45NXYh_YO_ILd8hKs6PHIDy30V?gv=true';
    const renderCalendarButtons = () => {
      if (!window.calendar?.schedulingButton?.load) return;
      calendarTargets.forEach(target => {
        if (target.dataset.calendarLoaded) return;
        window.calendar.schedulingButton.load({
          url: calendarUrl,
          color: '#063442',
          label: 'Nach Anzahlung Termin wählen / Choose time after deposit',
          target
        });
        target.dataset.calendarLoaded = 'true';
        const fallback = target.parentElement?.querySelector('[data-calendar-fallback]');
        if (fallback) fallback.hidden = true;
      });
    };

    if (window.calendar?.schedulingButton?.load) {
      renderCalendarButtons();
    } else if (!document.getElementById('google-calendar-scheduling-script')) {
      const calendarStyle = document.createElement('link');
      calendarStyle.rel = 'stylesheet';
      calendarStyle.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
      document.head.appendChild(calendarStyle);

      const calendarScript = document.createElement('script');
      calendarScript.id = 'google-calendar-scheduling-script';
      calendarScript.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
      calendarScript.async = true;
      calendarScript.addEventListener('load', renderCalendarButtons);
      document.head.appendChild(calendarScript);
    }
  }

  document.querySelectorAll('footer').forEach(footer => {
    if (footer.querySelector('a[href*="impressum"]')) return;
    const legal = document.createElement('nav');
    legal.className = 'ha-legal-links';
    legal.setAttribute('aria-label', 'Rechtliche Navigation');
    const legalHref = route => location.protocol === 'file:' ? new URL(`../${route}/index.html`, document.baseURI).href : `/${route}/`;
    legal.innerHTML = `<a href="${legalHref('impressum')}">Impressum</a><a href="${legalHref('datenschutz')}">Datenschutz</a>`;
    footer.appendChild(legal);
  });

  function enquiryUrl(context, offer) {
    const target = new URL('../index.html', document.baseURI);
    if (location.protocol !== 'file:') target.pathname = '/';
    target.search = new URLSearchParams({context,offer,source,lang:language}).toString();
    target.hash = 'contact';
    return target.href;
  }
  function updateVoucher(){
    if(!voucher || !voucherLink) return;
    const paymentUrl = voucherPayments[voucher.value];
    voucherLink.href = paymentUrl || enquiryUrl('voucher',choices[voucher.value]);
    voucherLink.dataset.de = paymentUrl ? 'Sicher bezahlen & Gutschein anfordern' : 'Unverbindlich anfragen';
    voucherLink.dataset.en = paymentUrl ? 'Pay securely & request voucher' : 'Send a non-binding enquiry';
    voucherLink.textContent = language === 'en' ? voucherLink.dataset.en : voucherLink.dataset.de;
  }
  function setLanguage(lang){
    language = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-de][data-en]').forEach(el => {el.textContent=el.dataset[lang];});
    document.querySelectorAll('[data-language]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.language === lang)));
    document.querySelectorAll('a[data-href-de][data-href-en]').forEach(el => { el.setAttribute('href', el.dataset['href'+(lang === 'en' ? 'En' : 'De')]); });
    document.querySelectorAll('a[href]').forEach(el=>{
      const raw=el.getAttribute('href');
      if(!raw || raw.startsWith('#') || /^(mailto:|tel:)/.test(raw))return;
      const u=new URL(el.href,document.baseURI);
      if(u.origin===location.origin && !u.pathname.includes('/what-is-human-architecture/')){u.searchParams.set('lang',lang);el.href=u.href;}
    });
    updateVoucher();
  }

  if(isNewPage){
    document.querySelectorAll('[data-language]').forEach(el => el.addEventListener('click',()=>setLanguage(el.dataset.language)));
    if(location.protocol==='file:')document.querySelectorAll('a[href]').forEach(el=>{
      const raw=el.getAttribute('href');
      if(!raw || raw.startsWith('#') || /^(https?:|mailto:|tel:)/.test(raw))return;
      const u=new URL(raw,document.baseURI);
      if(u.pathname.endsWith('/'))u.pathname+='index.html';
      el.href=u.href;
    });
    if(voucher){
      if(Object.hasOwn(choices,q.get('voucher')))voucher.value=q.get('voucher');
      voucher.addEventListener('change',updateVoucher);
      document.querySelectorAll('a[href*="voucher="]').forEach(el=>{ const u=new URL(el.href);u.searchParams.set('source',source);el.href=u.href; });
    }
    setLanguage(language);
  } else {
    if(location.protocol==='file:') {
      const nested=document.body.classList.contains('method-page') || location.pathname.includes('/babymesse/');
      const root=new URL(nested?'../':'./',document.baseURI);
      document.querySelectorAll('a[href^="/"]').forEach(el=>{
        const raw=el.getAttribute('href');if(raw.startsWith('//'))return;
        const parsed=new URL(raw,'https://preview.invalid');
        let route=parsed.pathname.slice(1);if(!route || route.endsWith('/'))route+='index.html';
        el.href=new URL(route+parsed.search+parsed.hash,root).href;
      });
    }
    if(q.get('lang'))document.querySelector('.lang-button[data-lang="'+(q.get('lang')==='de'?'de':'en')+'"]')?.click();
    const select=document.getElementById('context');
    const message=document.getElementById('message');
    const context=q.get('context');
    if(select && [...select.options].some(o=>o.value===context))select.value=context;
    const offer=(q.get('offer') || '').replace(/[\r\n<>]/g,' ').slice(0,120);
    if(message && !message.value && offer){
      message.value=language==='de' ? 'Ich interessiere mich für: '+offer+'.\nBitte sendet mir Informationen zu Umfang, Preis und Verfügbarkeit.\n\nMein Anliegen: \n\nGefunden über: '+source : 'I am interested in: '+offer+'.\nPlease share the scope, price and availability.\n\nMy enquiry: \n\nFound through: '+source;
    }
  }
});
