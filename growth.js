document.addEventListener('DOMContentLoaded', () => {
  const q = new URLSearchParams(location.search);
  const isNewPage = document.body.classList.contains('ha-growth');
  const allowedSources = new Set(['familien','babymesse','gutscheine','codex','sessions','gruender','mihira-ceremonia','kooperationen']);
  const source = allowedSources.has(q.get('source')) ? q.get('source') : (document.body.dataset.page || 'website');
  let language = q.get('lang') === 'en' ? 'en' : (document.documentElement.lang || 'de');
  const choices = {mama:'Mama Bodywork',baby:'Baby Codex — 189 €',familie:'Mama × Baby / Familien-Codex',codex:'Persönlicher Codex',persoenlich:'Persönliche Session',offen:'Beratung zur Gutscheinwahl'};
  const voucher = document.getElementById('voucher-choice');
  const voucherLink = document.querySelector('.ha-voucher-link');

  if (document.body.classList.contains('method-page')) {
    const existingFounderCss = [...document.querySelectorAll('link[rel="stylesheet"]')].find(link => link.href.includes('founder-update.css'));
    if (existingFounderCss) existingFounderCss.href = '/founder-update.css?v=10';
    else {
      const founderStyles = document.createElement('link');
      founderStyles.rel = 'stylesheet';
      founderStyles.href = '/founder-update.css?v=10';
      document.head.appendChild(founderStyles);
    }

    const founder = document.getElementById('founder');
    if (founder) {
      let figure = founder.querySelector('.method-founder-figure');
      if (!figure) {
        figure = document.createElement('figure');
        figure.className = 'method-founder-figure';
        figure.innerHTML = '<img src="/assets/founder/mel-mihira-founder.webp" alt="Mel Mihira, Founder and System Architect of Human Architecture" width="1551" height="2000" loading="lazy"><figcaption>Mel Mihira · Founder &amp; System Architect</figcaption>';
        founder.querySelector('h2')?.after(figure);
      }
      const founderImg = figure.querySelector('img');
      if (founderImg) founderImg.src = '/assets/founder/mel-mihira-founder.webp';

      if (!founder.querySelector('.method-founder-lightness')) {
        const panel = document.createElement('div');
        panel.className = 'method-founder-lightness';
        panel.innerHTML = '<figure><div class="method-founder-lightness__image"><img src="data:image/jpeg;base64,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" alt="Mel Mihira laughing while holding a banana like a telephone" loading="lazy"></div></figure><blockquote><p>There is more than one angle on every reality. Let’s explore the lens through which you experience yours.</p><footer>Human Architecture</footer></blockquote></div>';
        const valuesLink = founder.querySelector('a[href*="values"]')?.closest('p');
        if (valuesLink) valuesLink.before(panel);
        else founder.appendChild(panel);
      }
    }
  }

  const founderPlaceholder = document.querySelector('#about .about__portrait-placeholder');
  if (founderPlaceholder) {
    const figure = document.createElement('figure');
    figure.className = 'about__portrait reveal is-visible';
    figure.innerHTML = '<img src="/assets/founder/mel-mihira-founder.webp" alt="Mel Mihira, Founder and System Architect of Human Architecture" width="1551" height="2000" loading="lazy"><figcaption data-en="Mel Mihira · Founder &amp; System Architect" data-de="Mel Mihira · Gründerin &amp; Systemarchitektin">Mel Mihira · Founder &amp; System Architect</figcaption>';
    founderPlaceholder.replaceWith(figure);
  }

  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    const eyebrow = aboutSection.querySelector('.eyebrow');
    const title = aboutSection.querySelector('#about-title');
    const lead = aboutSection.querySelector('.lead');
    if (eyebrow) { eyebrow.dataset.en = 'Founder & Origin'; eyebrow.dataset.de = 'Gründerin & Entstehung'; eyebrow.textContent = language === 'de' ? eyebrow.dataset.de : eyebrow.dataset.en; }
    if (title) { title.dataset.en = 'Human Architecture begins with the human — and was built by Mel Mihira around that principle.'; title.dataset.de = 'Human Architecture beginnt beim Menschen – und wurde von Mel Mihira genau um dieses Prinzip herum entwickelt.'; title.textContent = language === 'de' ? title.dataset.de : title.dataset.en; }
    if (lead) { lead.dataset.en = 'Mel Mihira developed Human Architecture as an interdisciplinary system for understanding inherent structure, lived embodiment and human context without reducing a person to a single method.'; lead.dataset.de = 'Mel Mihira entwickelte Human Architecture als interdisziplinäres System, um angelegte Struktur, gelebte Verkörperung und menschlichen Kontext zu verstehen – ohne einen Menschen auf eine einzelne Methode zu reduzieren.'; lead.textContent = language === 'de' ? lead.dataset.de : lead.dataset.en; }
  }

  document.querySelectorAll('footer').forEach(footer => {
    if (footer.querySelector('a[href*="impressum"]')) return;
    const legal = document.createElement('nav');
    legal.className = 'ha-legal-links';
    legal.setAttribute('aria-label', 'Rechtliche Navigation');
    const legalHref = route => location.protocol === 'file:' ? new URL(`../${route}/index.html`, document.baseURI).href : `/${route}/`;
    legal.innerHTML = `<a href="${legalHref('impressum')}">Impressum</a><a href="${legalHref('datenschutz')}">Datenschutz</a>`;
    footer.appendChild(legal);
  });

  function enquiryUrl(context, offer) {
    const target = new URL('../index.html', document.baseURI);
    if (location.protocol !== 'file:') target.pathname = '/';
    target.search = new URLSearchParams({context,offer,source,lang:language}).toString();
    target.hash = 'contact';
    return target.href;
  }
  function updateVoucher(){ if(voucher && voucherLink) voucherLink.href = enquiryUrl('voucher',choices[voucher.value]); }
  function setLanguage(lang){
    language = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-de][data-en]').forEach(el => {el.textContent=el.dataset[lang];});
    document.querySelectorAll('[data-language]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.language === lang)));
    document.querySelectorAll('a[href]').forEach(el=>{
      const raw=el.getAttribute('href');
      if(!raw || raw.startsWith('#') || /^(mailto:|tel:)/.test(raw))return;
      const u=new URL(el.href,document.baseURI);
      if(u.origin===location.origin && !u.pathname.includes('/what-is-human-architecture/')){u.searchParams.set('lang',lang);el.href=u.href;}
    });
    updateVoucher();
  }

  if(isNewPage){
    document.querySelectorAll('[data-language]').forEach(el => el.addEventListener('click',()=>setLanguage(el.dataset.language)));
    if(location.protocol==='file:')document.querySelectorAll('a[href]').forEach(el=>{
      const raw=el.getAttribute('href');
      if(!raw || raw.startsWith('#') || /^(https?:|mailto:|tel:)/.test(raw))return;
      const u=new URL(raw,document.baseURI);
      if(u.pathname.endsWith('/'))u.pathname+='index.html';
      el.href=u.href;
    });
    if(voucher){
      if(Object.hasOwn(choices,q.get('voucher')))voucher.value=q.get('voucher');
      voucher.addEventListener('change',updateVoucher);
      document.querySelectorAll('a[href*="voucher="]').forEach(el=>{ const u=new URL(el.href);u.searchParams.set('source',source);el.href=u.href; });
    }
    setLanguage(language);
  } else {
    if(location.protocol==='file:') {
      const nested=document.body.classList.contains('method-page') || location.pathname.includes('/babymesse/');
      const root=new URL(nested?'../':'./',document.baseURI);
      document.querySelectorAll('a[href^="/"]').forEach(el=>{
        const raw=el.getAttribute('href');if(raw.startsWith('//'))return;
        const parsed=new URL(raw,'https://preview.invalid');
        let route=parsed.pathname.slice(1);if(!route || route.endsWith('/'))route+='index.html';
        el.href=new URL(route+parsed.search+parsed.hash,root).href;
      });
    }
    if(q.get('lang'))document.querySelector('.lang-button[data-lang="'+(q.get('lang')==='de'?'de':'en')+'"]')?.click();
    const select=document.getElementById('context');
    const message=document.getElementById('message');
    const context=q.get('context');
    if(select && [...select.options].some(o=>o.value===context))select.value=context;
    const offer=(q.get('offer') || '').replace(/[\r\n<>]/g,' ').slice(0,120);
    if(message && !message.value && offer){
      message.value=language==='de' ? 'Ich interessiere mich für: '+offer+'.\nBitte sendet mir Informationen zu Umfang, Preis und Verfügbarkeit.\n\nMein Anliegen: \n\nGefunden über: '+source : 'I am interested in: '+offer+'.\nPlease share the scope, price and availability.\n\nMy enquiry: \n\nFound through: '+source;
    }
  }
});
