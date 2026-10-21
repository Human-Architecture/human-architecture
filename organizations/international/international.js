document.addEventListener('DOMContentLoaded',()=>{
 const hero=document.querySelector('.hero');
 const clarityStyles=document.createElement('link');
 clarityStyles.rel='stylesheet';clarityStyles.href='clarity.css';document.head.append(clarityStyles);
 const heroLead=hero&&hero.querySelector('.lead');
 const heroDetail=hero&&hero.querySelector('.hero-detail');
 if(heroLead)heroLead.textContent='For leadership teams and organizational hosts who need clearer roles, decisions and collaboration—without a generic training programme.';
 if(heroDetail)heroDetail.textContent='Begin with one defined working context. Before you commit, you receive a written recommendation, proposed scope and fee.';
 if(hero&&!hero.querySelector('.international-clarity')){
  const clarity=document.createElement('section');
  clarity.className='international-clarity';
  clarity.setAttribute('aria-label','How international programmes begin');
  clarity.innerHTML='<div><strong>WHAT THIS IS</strong><span>A scoped workshop, mentoring or hosted programme for one defined organizational context.</span></div><div><strong>WHAT YOU RECEIVE</strong><span>A written recommendation, proposed scope and fee before you make a commitment.</span></div><div><strong>START HERE</strong><span>Tell us who the work is for, where it takes place and what needs to become clearer.</span></div>';
  heroDetail&&heroDetail.insertAdjacentElement('afterend',clarity);
 }
 if(hero&&!document.querySelector('.international-at-a-glance')){
  const style=document.createElement('style');
  style.textContent='.international-at-a-glance-wrap{background:#061f28;padding:0 0 58px}.international-at-a-glance{max-width:1000px;margin:0 auto;padding:0 6vw;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:#dfc59d55}.international-at-a-glance>div{padding:22px 24px;background:#082d35;color:#f5f0e7}.international-at-a-glance strong{display:block;color:#dfc59d;font-size:10px;letter-spacing:.16em;margin-bottom:8px}.international-at-a-glance span{display:block;font-size:14px;line-height:1.55;color:#bbccc9}@media(max-width:650px){.international-at-a-glance{grid-template-columns:1fr;padding:0 24px}.international-at-a-glance-wrap{padding-bottom:36px}}';
  document.head.append(style);
  const wrap=document.createElement('div');
  wrap.className='international-at-a-glance-wrap';
  wrap.innerHTML='<section class="international-at-a-glance" aria-label="Programme at a glance"><div><strong>FOR</strong><span>Founders, leadership teams, People &amp; Culture leaders and organizational hosts.</span></div><div><strong>STARTS WITH</strong><span>A focused scoping conversation about your working context and practical requirements.</span></div><div><strong>YOU RECEIVE</strong><span>A written scope and fee proposal before you decide whether to book.</span></div></section>';
  hero.insertAdjacentElement('afterend',wrap);
 }
 const form=document.getElementById('international-enquiry');
 const format=document.getElementById('format');
 const status=document.getElementById('form-status');
 const fallback=document.getElementById('email-fallback');
 const button=form.querySelector('button[type="submit"]');
 let sending=false;
 document.querySelectorAll('[data-format]').forEach(a=>a.addEventListener('click',()=>{
  format.value=a.dataset.format;
 }));
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(sending || !form.reportValidity())return;
  const data=new FormData(form);
  if(data.get('website'))return;
  const get=key=>String(data.get(key)||'').trim();
  if(!get('name')||!get('organisation')||!get('message')){
   status.textContent='Please enter your name, organization and a short description of your enquiry.';status.focus();return;
  }
  const message=[
   'INTERNATIONAL CORPORATE ENQUIRY',
   'Role: '+(get('role')||'Not provided'),
   'Location: '+get('region'),
   'City / country: '+(get('city')||'Not provided'),
   'Format: '+get('format'),
   'Participants: '+(get('group')||'To discuss'),
   'Timing: '+(get('timing')||'To discuss'),
   'Budget / currency: '+(get('budget')||'To discuss'),
   '', 'Organizational context:',get('message'),
   '', 'Source: /organizations/international/'
  ].join('\n');
  sending=true;button.disabled=true;button.textContent='Sending your enquiry…';status.textContent='';fallback.hidden=true;
  try{
   const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:get('name'),email:get('email'),organisation:get('organisation'),context:'International corporate programme — '+get('region'),message})});
   const result=await response.json();
   if(!response.ok||result.success!==true)throw new Error('Not confirmed');
   status.textContent='Thank you. Your enquiry has been received. We will review your context and respond personally to discuss the next step.';
   form.reset();button.textContent='Enquiry received';status.focus();
  }catch(error){
   status.textContent='We could not confirm delivery.';fallback.hidden=false;
   button.disabled=false;button.textContent='Try sending again';sending=false;status.focus();
  }
 });
});
