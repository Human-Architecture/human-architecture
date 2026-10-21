document.addEventListener('DOMContentLoaded', () => {
  const german = new URLSearchParams(window.location.search).get('lang') === 'de';
  const visuals = [
    ['↺', 'event-symbol--return', german ? 'RETURN · Begleitung' : 'RETURN · Facilitation'],
    ['◎', 'event-symbol--body', 'BODY LANGUAGE · Workshop'],
    ['✦', 'event-symbol--astrology', 'Advent of Astrology · Live online'],
    ['≈', 'event-symbol--rest', german ? 'DEEP REST · Klangreise' : 'DEEP REST · Sound journey']
  ];
  document.querySelectorAll('.event-card').forEach((card, index) => {
    const image = card.querySelector('.event-image');
    const visual = visuals[index];
    if (image && visual) image.outerHTML = `<figure class="event-symbol ${visual[1]}" aria-hidden="true"><span>${visual[0]}</span><figcaption>${visual[2]}</figcaption></figure>`;
  });
  const deepRestVenue = document.querySelectorAll('.event-card')[3]?.querySelector('.event-meta li');
  if (deepRestVenue) deepRestVenue.textContent = 'ZEN CENTER, Regensburg';
});
