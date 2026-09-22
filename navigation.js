document.addEventListener('DOMContentLoaded',()=>{
 const roots=document.querySelectorAll('.ha-wayfinding,.ha-site-directory,.ha-entry');
 const header=document.querySelector('.site-header');
 const wayfinding=document.querySelector('.ha-wayfinding');
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
  // Preserve language on every page link, including header menus and offer CTAs.
  // Leave fragment-only links intact for the existing smooth-scroll handlers.
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