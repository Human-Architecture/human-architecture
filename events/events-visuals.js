document.addEventListener('DOMContentLoaded', () => {
  const german = new URLSearchParams(window.location.search).get('lang') === 'de';
  const posters = [
    ['/assets/events/posters/return-poster.jpg', 'RETURN poster', german ? 'RETURN · Begleitung' : 'RETURN · Facilitation'],
    ['/assets/events/posters/body-language-poster.jpg', 'BODY LANGUAGE workshop poster', 'BODY LANGUAGE · Workshop'],
    ['/assets/events/posters/astrology-poster.jpg', 'Advent of Astrology course poster', 'Advent of Astrology · Live online']
  ];
  document.querySelectorAll('.event-card').forEach((card, index) => {
    const image = card.querySelector('.event-image');
    const poster = posters[index];
    if (!image || !poster) return;
    image.classList.add('event-poster');
    image.innerHTML = `<img src="${poster[0]}" alt="${poster[1]}" loading="lazy"><figcaption>${poster[2]}</figcaption>`;
  });
  const deepRestVenue = document.querySelectorAll('.event-card')[3]?.querySelector('.event-meta li');
  if (deepRestVenue) deepRestVenue.textContent = 'ZEN CENTER, Regensburg';
});
