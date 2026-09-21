document.addEventListener('DOMContentLoaded',()=>{
 const roots=document.querySelectorAll('.ha-wayfinding,.ha-site-directory,.ha-entry');
 const normalize=p=>p.replace(/index\.html$/,'').replace(/\/$/,'')||'/';
 function sync(){
  const lang=document.documentElement.lang.toLowerCase().startsWith('en')?'en':'de';
  roots.forEach(root=>{
   root.querySelectorAll('[data-de][data-en]').forEach(el=>{el.textContent=el.dataset[lang];});
   root.querySelectorAll('a[href]').forEach(a=>{
    const u=new URL(a.getAttribute('href'),location.href);
    if(u.origin!==location.origin)return;
    if(u.pathname.startsWith('/organizations/international/')||u.pathname.startsWith('/what-is-human-architecture/'))u.searchParams.delete('lang');else u.searchParams.set('lang',lang);a.href=u.href;
    if(normalize(u.pathname)===normalize(location.pathname)&&!u.hash)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
   });
  });
 }
 document.querySelectorAll('.ha-domain-menu').forEach(menu=>{menu.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();}});menu.addEventListener('click',e=>{if(e.target.closest('a'))menu.open=false;});});
 sync();new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
});