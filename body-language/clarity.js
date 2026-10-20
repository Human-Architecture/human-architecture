document.addEventListener('DOMContentLoaded',()=>{
  const hero=document.querySelector('.body-language-page .hero');
  if(!hero||hero.querySelector('.body-language-clarity'))return;
  const english=document.documentElement.lang.toLowerCase().startsWith('en');
  const lead=hero.querySelector('.lead');
  const supporting=hero.querySelector('.sub, .hero-copy');
  const primary=hero.querySelector('.actions .button');
  if(english){
    if(lead)lead.textContent='A guided workshop for people who train—and want to understand what to notice in their own body.';
    if(supporting)supporting.textContent='Explore movement, load, breath and recovery; leave with three personal focus areas. Not a performance test, diagnosis or replacement training plan.';
    if(primary)primary.innerHTML='Reserve your 28 November place <span aria-hidden="true">↗</span>';
  }else{
    if(lead)lead.textContent='Ein angeleiteter Workshop für Menschen, die trainieren – und besser verstehen möchten, worauf sie in ihrem Körper achten können.';
    if(supporting)supporting.textContent='Du erkundest Bewegung, Belastung, Atmung und Regeneration und gehst mit drei persönlichen Fokusbereichen nach Hause. Kein Leistungstest, keine Diagnose und kein neuer Trainingsplan.';
    if(primary)primary.textContent='Platz für den 28. November sichern';
  }
  const points=document.createElement('section');
  points.className='body-language-clarity';
  points.setAttribute('aria-label',english?'What you take with you':'Was du mitnimmst');
  points.innerHTML=english
    ?'<div><strong>NOTICE</strong><span>Observe movement, load and tension with more precision.</span></div><div><strong>MAKE SENSE OF IT</strong><span>Sort your observations without judgement or a one-size-fits-all answer.</span></div><div><strong>CONTINUE</strong><span>Take three personal focus areas into your next training session.</span></div>'
    :'<div><strong>WAHRNEHMEN</strong><span>Bewegung, Belastung und Spannung genauer beobachten.</span></div><div><strong>EINORDNEN</strong><span>Beobachtungen ohne Bewertung oder Einheitslösung sortieren.</span></div><div><strong>WEITERGEHEN</strong><span>Drei persönliche Fokusbereiche ins nächste Training mitnehmen.</span></div>';
  const actions=hero.querySelector('.actions');
  if(actions)actions.insertAdjacentElement('afterend',points);
});
