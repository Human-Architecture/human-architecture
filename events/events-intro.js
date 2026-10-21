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
