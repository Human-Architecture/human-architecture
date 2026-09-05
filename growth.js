document.addEventListener('DOMContentLoaded', () => {
  const q = new URLSearchParams(location.search);
  const isNewPage = document.body.classList.contains('ha-growth');
  const allowedSources = new Set(['familien','babymesse','gutscheine','codex','sessions','gruender','mihira-ceremonia','kooperationen']);
  const source = allowedSources.has(q.get('source')) ? q.get('source') : (document.body.dataset.page || 'website');
  let language = q.get('lang') === 'en' ? 'en' : (document.documentElement.lang || 'de');
  const choices = {mama:'Mama Bodywork',baby:'Baby Codex — 189 €',familie:'Mama × Baby / Familien-Codex',codex:'Persönlicher Codex',persoenlich:'Persönliche Session',offen:'Beratung zur Gutscheinwahl'};
  const voucher = document.getElementById('voucher-choice');
  const voucherLink = document.querySelector('.ha-voucher-link');
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
  function updateVoucher(){
    if(voucher && voucherLink) voucherLink.href = enquiryUrl('voucher',choices[voucher.value]);
  }
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
    // Existing hosted routes stay clean; a downloaded preview opens directory index files.
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
      document.querySelectorAll('a[href*="voucher="]').forEach(el=>{
        const u=new URL(el.href);u.searchParams.set('source',source);el.href=u.href;
      });
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
    // Use the existing contact form and its server endpoint. No message is sent automatically.
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
