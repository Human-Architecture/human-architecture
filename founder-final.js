document.addEventListener('DOMContentLoaded',()=>{
  const founder=document.querySelector('body.method-page #founder');
  if(!founder)return;

  const freshStyles=document.createElement('link');
  freshStyles.rel='stylesheet';
  freshStyles.href='/founder-update.css?v=14';
  document.head.appendChild(freshStyles);

  // Founder image: the leaning-forward black-dress portrait selected for the authority/origin block.
  const portrait=founder.querySelector('.method-founder-figure img');
  if(portrait){
    portrait.src='/assets/founder/mel-mihira-founder.webp?v=14';
    portrait.width=1551;
    portrait.height=2000;
    portrait.alt='Mel Mihira — Founder and System Architect of Human Architecture';
    portrait.loading='eager';
    portrait.decoding='async';
  }

  // Second image: deliberately lighter banana portrait to loosen the visual tone after the founder story.
  founder.querySelectorAll('.method-founder-lightness').forEach(el=>el.remove());
  const block=document.createElement('div');
  block.className='method-founder-lightness';
  block.innerHTML=`<figure><div class="method-founder-lightness__image"><img src="/assets/founder/mel-mihira-banana-preview.jpg?v=14" alt="Mel Mihira laughing while holding a banana like a telephone" width="640" height="800" loading="lazy" decoding="async"></div></figure><blockquote><p>There is more than one angle on every reality. Let’s explore the lens through which you experience yours.</p><footer>Human Architecture</footer></blockquote>`;

  const valuesLink=[...founder.querySelectorAll(':scope > p')].find(p=>p.querySelector('a[href*="values"]'));
  founder.insertBefore(block,valuesLink||null);
});