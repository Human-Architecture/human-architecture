document.addEventListener('DOMContentLoaded', () => {
  const lead = document.querySelector('.events-lead');
  if (!lead || document.querySelector('.events-orientation')) return;
  const german = new URLSearchParams(window.location.search).get('lang') === 'de';

  lead.textContent = german
    ? 'Hier findest du aktuelle Einstiegspunkte in Human Architecture und Mihira Ceremonia: Räume, um die Arbeit praktisch kennenzulernen – mit klarem Datum, Ort und nächstem Schritt. Jeder untenstehende Event ist bestätigt und bereit zur Reservierung.'
    : 'These are live entry points into Human Architecture and Mihira Ceremonia: spaces to meet the work in practice, with a clear date, setting and next step. Each event below is confirmed and ready to reserve.';

  const orientation = document.createElement('section');
  orientation.className = 'events-orientation';
  orientation.setAttribute('aria-label', german ? 'So nutzt du diese Seite' : 'How to use this page');
  orientation.innerHTML = german
    ? '<div><strong>01 / WÄHLE</strong><span>Finde das Format, das zu deiner aktuellen Frage, deinem Körper oder deiner Neugier passt.</span></div><div><strong>02 / INFORMIERE DICH</strong><span>Öffne die Eventseite für Einführung, Zeiten, Ort und alle Details zur Teilnahme.</span></div><div><strong>03 / RESERVIERE</strong><span>Buche direkt, wenn eine Zahlungsoption verfügbar ist, oder verschenke die Experience als Gutschein.</span></div>'
    : '<div><strong>01 / CHOOSE</strong><span>Find the format that fits your present question, body or curiosity.</span></div><div><strong>02 / REVIEW</strong><span>Open the event page for the full introduction, timing, place and participation details.</span></div><div><strong>03 / RESERVE</strong><span>Book directly where a payment route is available, or give the experience as a voucher.</span></div>';
  lead.insertAdjacentElement('afterend', orientation);

  const eventJourneys = [
    {
      selector: '.event-card--return',
      info: '/mihira-ceremonia/return/',
      book: '/mihira-ceremonia/return/#booking',
      voucher: '/gutscheine/?voucher=return#anfrage',
      labels: german
        ? ['RETURN entdecken', 'Platz reservieren', 'RETURN als Gutschein schenken']
        : ['Explore RETURN', 'Reserve a place', 'Give RETURN as a voucher']
    },
    {
      selector: '.event-card--body-language',
      info: '/body-language/',
      book: '/body-language/book/',
      voucher: '/gutscheine/?voucher=body_language#anfrage',
      labels: german
        ? ['BODY LANGUAGE entdecken', 'Platz wählen & bezahlen', 'BODY LANGUAGE als Gutschein schenken']
        : ['Explore BODY LANGUAGE', 'Choose a place & pay', 'Give BODY LANGUAGE as a voucher']
    },
    {
      selector: '.event-card--astrology',
      info: '/kurse/westliche-astrologie/',
      book: '/kurse/westliche-astrologie/#anmeldung',
      voucher: '/gutscheine/?voucher=astrology#anfrage',
      labels: german
        ? ['Kurs entdecken', 'Platz wählen & bezahlen', 'Kurs als Gutschein schenken']
        : ['Explore the course', 'Choose a place & pay', 'Give the course as a voucher']
    },
    {
      selector: '.event-card--deep-rest',
      info: '/events/deep-rest/',
      book: '/events/deep-rest/#tickets',
      voucher: '/gutscheine/?voucher=deep_rest#anfrage',
      labels: german
        ? ['DEEP REST entdecken', 'Ticket wählen & bezahlen', 'DEEP REST als Gutschein schenken']
        : ['Explore DEEP REST', 'Choose a ticket & pay', 'Give DEEP REST as a voucher']
    }
  ];

  eventJourneys.forEach(({ selector, info, book, voucher, labels }) => {
    const actions = document.querySelector(`${selector} .event-actions`);
    if (!actions) return;
    actions.replaceChildren();
    [[info, labels[0], 'secondary'], [book, labels[1], ''], [voucher, labels[2], 'secondary']].forEach(([href, label, variant]) => {
      const link = document.createElement('a');
      link.className = `event-action ${variant}`.trim();
      link.href = href;
      link.textContent = label;
      actions.append(link);
    });
  });

  const eventList = document.querySelector('.events-list');
  if (eventList && !document.querySelector('.events-participation-policy')) {
    const policy = document.createElement('aside');
    policy.className = 'events-note events-participation-policy';
    policy.innerHTML = german
      ? '<strong>Flexible Teilnahme bei allen öffentlichen Formaten</strong> Du kannst deinen Platz oder dein Ticket an eine andere Person übertragen. Bei schriftlicher Absage bis spätestens 7 Kalendertage vor Beginn des jeweiligen Events – beim Kurs vor der ersten Live-Session – erstatten wir 70 % des gezahlten Betrags. Danach ist keine Rückerstattung möglich. <a href="mailto:hello@human-architecture.info?subject=Teilnahme%20%C3%BCbertragen%20oder%20stornieren">Übertragung oder Absage per E-Mail anfragen</a>.'
      : '<strong>Flexible participation across all public formats</strong> You may transfer your place or ticket to another person. If you cancel in writing at least 7 calendar days before the start of the relevant event – or before the first live session for the course – we refund 70% of the amount paid. After that deadline, refunds are not possible. <a href="mailto:hello@human-architecture.info?subject=Transfer%20or%20cancellation">Request a transfer or cancellation by email</a>.';
    eventList.insertAdjacentElement('afterend', policy);
  }
});
