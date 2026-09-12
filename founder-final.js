document.addEventListener('DOMContentLoaded',()=>{
  const founder=document.querySelector('body.method-page #founder');
  if(!founder)return;

  const freshStyles=document.createElement('link');
  freshStyles.rel='stylesheet';
  freshStyles.href='/founder-update.css?v=13';
  document.head.appendChild(freshStyles);

  const portrait=founder.querySelector('.method-founder-figure img');
  if(portrait){
    portrait.src='/assets/founder/mel-mihira-founder.webp';
    portrait.width=1551;
    portrait.height=2000;
    portrait.alt='Mel Mihira, Founder and System Architect of Human Architecture';
  }

  founder.querySelectorAll('.method-founder-lightness').forEach(el=>el.remove());

  const block=document.createElement('div');
  block.className='method-founder-lightness';
  block.innerHTML=`<figure><div class="method-founder-lightness__image"><img src="/assets/founder/mel-mihira-banana-preview.jpg" alt="Mel Mihira laughing while holding a banana like a telephone" width="160" height="196" loading="lazy"></div></figure><blockquote><p>There is more than one angle on every reality. Let’s explore the lens through which you experience yours.</p><footer>Human Architecture</footer></blockquote>`;

  const valuesLink=[...founder.querySelectorAll(':scope > p')].find(p=>p.querySelector('a[href*="values"]'));
  founder.insertBefore(block,valuesLink||null);
});