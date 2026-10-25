document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.homepage-event__details span').forEach((element)=>{
    if(element.textContent.includes('Zen Space')) element.textContent=element.textContent.replace('Zen Space','ZEN CENTER');
  });
  const founder=document.querySelector('body.method-page #founder');
  if(!founder)return;

  const freshStyles=document.createElement('link');
  freshStyles.rel='stylesheet';
  freshStyles.href='/founder-update.css?v=16';
  document.head.appendChild(freshStyles);

  // Use the composed founder portrait wherever the page establishes authority.
  const portrait=founder.querySelector('.method-founder-figure img');
  if(portrait){
    portrait.src='/assets/portraits/mel-organizations-founder-v2.png?v=16';
    portrait.alt='Mel Mihira — Founder and System Architect of Human Architecture';
    portrait.loading='eager';
    portrait.decoding='async';
  }

  // Keep the reflection while the approved second portrait is unavailable.
  founder.querySelectorAll('.method-founder-lightness').forEach(el=>el.remove());
  const block=document.createElement('div');
  block.className='method-founder-lightness method-founder-lightness--quote';
  block.innerHTML=`<blockquote><p>There is more than one angle on every reality. Let’s explore the lens through which you experience yours.</p><footer>Human Architecture</footer></blockquote>`;

  const valuesLink=[...founder.querySelectorAll(':scope > p')].find(p=>p.querySelector('a[href*="values"]'));
  founder.insertBefore(block,valuesLink||null);
});
