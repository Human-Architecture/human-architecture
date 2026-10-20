document.addEventListener('DOMContentLoaded',()=>{
  const hero=document.querySelector('.proposal .hero');
  if(!hero||hero.querySelector('.proposal-clarity'))return;
  const style=document.createElement('style');
  style.textContent='.proposal .hero{position:relative;overflow:hidden}.proposal .hero:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.23;background-image:radial-gradient(circle at 87% 18%,rgba(200,175,139,.45) 0 1px,transparent 1.5px),linear-gradient(130deg,transparent 0 48%,rgba(200,175,139,.22) 48.1% 48.22%,transparent 48.36% 100%);background-size:30px 30px,220px 220px}.proposal .hero-inner{position:relative;z-index:1}.proposal-clarity{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;max-width:850px;margin:30px 0 0;border:1px solid rgba(200,175,139,.42);background:rgba(200,175,139,.42)}.proposal-clarity>div{padding:15px 16px;background:rgba(4,34,41,.75)}.proposal-clarity strong{display:block;color:#dfc7a4;font-size:.65rem;letter-spacing:.15em;margin-bottom:6px}.proposal-clarity span{display:block;color:#e7ede9;font-size:.82rem;line-height:1.5}@media(max-width:700px){.proposal-clarity{grid-template-columns:1fr}.proposal-clarity>div{padding:13px 14px}}';
  document.head.append(style);
  const lead=hero.querySelector('.lead');
  if(lead)lead.textContent='A four-week guest integration pilot for Makahiya Fitness. Training, progression and performance decisions remain with Makahiya’s coaching team.';
  const clarity=document.createElement('section');
  clarity.className='proposal-clarity';
  clarity.setAttribute('aria-label','Proposal essentials');
  clarity.innerHTML='<div><strong>WHAT THIS ADDS</strong><span>A recovery-led integration layer around Makahiya’s existing training environment.</span></div><div><strong>WHAT STAYS WITH MAKAHIYA</strong><span>Coaching, athlete programming and performance decisions remain with the Makahiya team.</span></div><div><strong>HOW TO BEGIN</strong><span>A 30-minute fit conversation determines whether a pilot is useful before any partnership is agreed.</span></div>';
  const actions=hero.querySelector('.hero-actions');
  if(actions)actions.insertAdjacentElement('afterend',clarity);
});
