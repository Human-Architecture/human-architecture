document.addEventListener('DOMContentLoaded', () => {
  const german = new URLSearchParams(window.location.search).get('lang') === 'de';
  const posters = {
    'event-card--body-language': ['/assets/events/posters/body-language-poster.jpg', 'BODY LANGUAGE workshop poster', 'BODY LANGUAGE · Workshop'],
    'event-card--astrology': ['/assets/events/posters/astrology-poster.jpg', 'Advent of Astrology course poster', 'Advent of Astrology · Live online'],
    'event-card--deep-rest': ['/assets/events/deep-rest-poster-client-facing.jpg', 'DEEP REST event poster', german ? 'DEEP REST · Atem, Ruhe & Klang' : 'DEEP REST · Breath, rest & sound']
  };

  Object.entries(posters).forEach(([cardClass, poster]) => {
    const image = document.querySelector(`.${cardClass} .event-image`);
    if (!image) return;
    image.classList.add('event-poster');
    image.innerHTML = `<img src="${poster[0]}" alt="${poster[1]}" loading="lazy"><figcaption>${poster[2]}</figcaption>`;
  });
});
