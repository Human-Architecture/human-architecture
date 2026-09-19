document.addEventListener('DOMContentLoaded',()=>{
 const roots=document.querySelectorAll('.ha-wayfinding,.ha-site-directory');
 const normalize=p=>p.replace(/index\.html$/,'').replace(/\/$/,'')||'/';
 function sync(){
  const lang=document.documentElement.lang.toLowerCase().startsWith('en')?'en':'de';
  roots.forEach(root=>{
   root.querySelectorAll('[data-de][data-en]').forEach(el=>{el.textContent=el.dataset[lang];});
   root.querySelectorAll('a[href]').forEach(a=>{
    const u=new URL(a.getAttribute('href'),location.href);
    if(u.origin!==location.origin)return;
    u.searchParams.set('lang',lang);a.href=u.href;
    if(normalize(u.pathname)===normalize(location.pathname)&&!u.hash)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
   });
  });
 }
 sync();new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
});