document.addEventListener('DOMContentLoaded', () => {
  const german = new URLSearchParams(window.location.search).get('lang') === 'de';
  const posters = [
    ['/assets/events/posters/return-poster.jpg', 'RETURN poster', german ? 'RETURN · Begleitung' : 'RETURN · Facilitation'],
    ['/assets/events/posters/body-language-poster.jpg', 'BODY LANGUAGE workshop poster', 'BODY LANGUAGE · Workshop'],
    ['/assets/events/posters/astrology-poster.jpg', 'Advent of Astrology course poster', 'Advent of Astrology · Live online'],
    ['/assets/events/posters/deep-rest-poster.svg', 'DEEP REST event poster', german ? 'DEEP REST · Atem, Ruhe & Klang' : 'DEEP REST · Breath, rest & sound']
  ];
  document.querySelectorAll('.event-card').forEach((card, index) => {
    const image = card.querySelector('.event-image');
    const poster = posters[index];
    if (!image || !poster) return;
    image.classList.add('event-poster');
    if (index === 3) {
      image.classList.add('event-poster--deep-rest');
      image.innerHTML = `<div class="deep-rest-poster" role="img" aria-label="${poster[1]}">
        <p class="deep-rest-poster__brand">HUMAN ARCHITECTURE®</p>
        <p class="deep-rest-poster__eyebrow">${german ? 'BREATHWORK · YOGA NIDRA · HANDPAN' : 'BREATHWORK · YOGA NIDRA · HANDPAN'}</p>
        <h3>DEEP<br>REST</h3>
        <p class="deep-rest-poster__line">${german ? 'Ankommen · Loslassen · Ruhen' : 'Arrive · Release · Rest'}</p>
        <div class="deep-rest-poster__details"><strong>${german ? 'FR 11. DEZ · 18:00–19:30 UHR' : 'FRI 11 DEC · 18:00–19:30'}</strong><span>${german ? 'ZEN CENTER · REGENSBURG' : 'ZEN CENTER · REGENSBURG'}</span></div>
      </div><figcaption>${poster[2]}</figcaption>`;
      return;
    }
    image.innerHTML = `<img src="${poster[0]}" alt="${poster[1]}" loading="lazy"><figcaption>${poster[2]}</figcaption>`;
  });
});
