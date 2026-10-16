(function () {
  const card = ({ label, day, month, weekday, title, description, details, primary, secondary }) => {
    const article = document.createElement('article');
    article.className = 'event-card';
    article.innerHTML = `<div class="event-date"><span>${label}</span><strong>${day}<br>${month}</strong><p>${weekday} · 2026</p></div><div class="event-detail"><small>${title.kicker}</small><h2>${title.heading}</h2><p>${description}</p><ul class="event-meta">${details.map((detail) => `<li>${detail}</li>`).join('')}</ul><div class="event-actions"><a class="event-action" href="${primary.href}">${primary.label}</a>${secondary ? `<a class="event-action secondary" href="${secondary.href}">${secondary.label}</a>` : ''}</div></div>`;
    return article;
  };

  document.addEventListener('DOMContentLoaded', () => {
    const deepRestLink = document.querySelector('a[href^="mailto:hello@human-architecture.info?subject=DEEP"]');
    if (deepRestLink) {
      deepRestLink.href = '/events/deep-rest/';
      deepRestLink.textContent = 'Choose a ticket & reserve';
    }

    const events = document.querySelector('.events-list');
    if (!events || events.dataset.completeProgramme === 'true') return;
    events.dataset.completeProgramme = 'true';

    const returnCard = card({
        label: 'UPCOMING EVENING', day: '14', month: 'Nov', weekday: 'Saturday',
        title: { kicker: 'RETURN · BREATHWORK, YOGA NIDRA & DEEP REST', heading: 'Return to breath, body and rest.' },
        description: 'A guided group experience for breath, body awareness, regulation, Yoga Nidra and deep rest.',
        details: ['18:00–19:30 · allow time until 20:00', 'Sulzbach-Rosenberg', '€28 regular · DALI cash option', 'Bring a Friend: 10% for both'],
        primary: { href: '/mihira-ceremonia/return/', label: 'Register & continue to payment' }
      });
    const astrologyCard = card({
        label: 'LIVE ONLINE COURSE', day: '29', month: 'Nov', weekday: 'Four Sundays',
        title: { kicker: 'ADVENT OF ASTROLOGY', heading: 'Understand Western astrology.' },
        description: 'Four live online sessions with a digital workbook: a clear introduction to reading the foundations of a natal chart.',
        details: ['29 Nov · 6 Dec · 13 Dec · 20 Dec', '4 × 90 minutes · live online', '€220 individual', '€360 for two people'],
        primary: { href: '/kurse/westliche-astrologie/', label: 'Choose a place & pay' }
      });
    const bodyLanguageCard = Array.from(events.children).find((item) => item.textContent.includes('BODY LANGUAGE'));
    const deepRestCard = Array.from(events.children).find((item) => item.textContent.includes('DEEP REST'));
    events.insertBefore(returnCard, bodyLanguageCard || events.firstChild);
    events.insertBefore(astrologyCard, deepRestCard || null);
  });
})();
