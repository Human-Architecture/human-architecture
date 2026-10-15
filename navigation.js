document.addEventListener('DOMContentLoaded',()=>{
 const roots=document.querySelectorAll('.ha-wayfinding,.ha-site-directory,.ha-entry');
 const header=document.querySelector('.site-header');
 const wayfinding=document.querySelector('.ha-wayfinding');
 if(wayfinding&&!wayfinding.querySelector('[data-site-events-wayfinding]')){
  const eventsLink=document.createElement('a');
  eventsLink.href='/events/';
  eventsLink.dataset.siteEventsWayfinding='';
  eventsLink.dataset.de='Nächste Termine';
  eventsLink.dataset.en='Upcoming events';
  wayfinding.append(eventsLink);
 }
 const primaryNav=header&&header.querySelector('nav[aria-label="Primary navigation"]');
 if(primaryNav&&!primaryNav.querySelector('[data-site-events-link]')){
  const eventsLink=document.createElement('a');
  eventsLink.href='/events/';
  eventsLink.dataset.siteEventsLink='';
  primaryNav.append(eventsLink);
 }
 const addSearchControl=siteHeader=>{
  if(!siteHeader||siteHeader.querySelector('[data-site-search-link]'))return;
  const nav=siteHeader.querySelector('nav[aria-label="Primary navigation"]');
  const controls=siteHeader.querySelector('.ha-controls');
  const searchLink=document.createElement('a');
  searchLink.href='/search/';
  searchLink.dataset.siteSearchLink='';
  searchLink.className='site-search-control';
  searchLink.setAttribute('aria-label','Search the Human Architecture site');
  searchLink.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><circle cx="10.8" cy="10.8" r="5.8"></circle><path d="m15.2 15.2 5 5"></path></svg><span class="site-search-control__label">Search</span>';
  if(controls)controls.insertBefore(searchLink,controls.querySelector('.ha-menu')||null); else if(nav)nav.append(searchLink); else siteHeader.append(searchLink);
 };
 document.querySelectorAll('header').forEach(addSearchControl);
 if(header&&wayfinding){
  const placeNavigation=()=>{wayfinding.style.marginTop=getComputedStyle(header).position==='fixed'?header.getBoundingClientRect().height+'px':'';};
  placeNavigation();
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(placeNavigation).observe(header);
  else window.addEventListener('resize',placeNavigation);
 }
 const normalize=p=>p.replace(/index\.html$/,'').replace(/\/$/,'')||'/';
 function sync(){
  const lang=document.documentElement.lang.toLowerCase().startsWith('en')?'en':'de';
  roots.forEach(root=>{
   root.querySelectorAll('[data-de][data-en]').forEach(el=>{el.textContent=el.dataset[lang];});
   root.querySelectorAll('a[href]').forEach(a=>{
    const u=new URL(a.getAttribute('href'),location.href);
    if(u.origin===location.origin && normalize(u.pathname)===normalize(location.pathname)&&!u.hash)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
   });
  });
   document.querySelectorAll('a[data-de-href][data-en-href]').forEach(link=>{link.setAttribute('href',link.dataset[lang==='en'?'enHref':'deHref']);});
   document.querySelectorAll('[data-site-events-link]').forEach(link=>{link.textContent=lang==='en'?'Upcoming events':'Nächste Termine';link.setAttribute('aria-label',lang==='en'?'View upcoming events':'Nächste Veranstaltungen ansehen');});
   document.querySelectorAll('[data-site-search-link]').forEach(link=>{const label=lang==='en'?'Search':'Suche';const labelNode=link.querySelector('.site-search-control__label');if(labelNode)labelNode.textContent=label;link.setAttribute('aria-label',lang==='en'?'Search the Human Architecture site':'Human-Architecture-Website durchsuchen');});
  document.querySelectorAll('a[data-en="Explore workshop (German)"]').forEach(link=>{link.dataset.en='Explore workshop';link.textContent=link.dataset[lang];link.setAttribute('href',lang==='en'?'/body-language/en/':'/body-language/');});
  document.querySelectorAll('[data-de*="90-minütige Workshop"]').forEach(el=>{el.dataset.de=el.dataset.de.replace('90-minütige','90–120-minütige');el.dataset.en=el.dataset.en.replace('90-minute','90–120 minute').replace(' The workshop page is in German.','');el.textContent=el.dataset[lang];});
  document.querySelectorAll('a[href]').forEach(a=>{
   const raw=a.getAttribute('href');
   if(!raw||raw.startsWith('#')||a.hasAttribute('download'))return;
   const u=new URL(raw,location.href);
   if(u.origin!==location.origin || !/\/$|\.html$/.test(u.pathname))return;
   const fixedLanguage=['/organizations/international/','/what-is-human-architecture/','/performance/intake/','/impressum/','/datenschutz/','/organizations/hr-brief.html'];
   if(fixedLanguage.some(path=>u.pathname.startsWith(path)))u.searchParams.delete('lang');else u.searchParams.set('lang',lang);
   a.href=u.href;
  });
 }
 document.querySelectorAll('.ha-domain-menu').forEach(menu=>{menu.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();}});menu.addEventListener('click',e=>{if(e.target.closest('a'))menu.open=false;});});
 sync();new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
});
