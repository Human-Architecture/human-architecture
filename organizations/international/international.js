document.addEventListener('DOMContentLoaded',()=>{
 const form=document.getElementById('international-enquiry');
 const format=document.getElementById('format');
 const formatsSection=document.getElementById('formats');
 const status=document.getElementById('form-status');
 const fallback=document.getElementById('email-fallback');
 const button=form.querySelector('button[type="submit"]');
 let sending=false;

 const experienceStyles=document.createElement('style');
 experienceStyles.textContent=`.experience-formats{border-top:1px solid #082d3524}.experience-formats .eyebrow{color:#785a32}.experience-lead{max-width:760px;font-size:18px;line-height:1.7}.experience-cards{margin-bottom:28px}.experience-cards article{border-top-color:#0d5969;background:linear-gradient(145deg,#fffdf8,#edf3f0)}.experience-cards h3{margin-bottom:12px}.experience-cards p{line-height:1.7}`;
 document.head.append(experienceStyles);

 const experienceOptions=[
  'BODY LANGUAGE partner workshop',
  'RETURN · breathwork & Yoga Nidra',
  'DEEP REST · Yoga Nidra & live handpan'
 ];
 experienceOptions.forEach(value=>{
  const option=document.createElement('option');
  option.value=value;option.textContent=value;format.append(option);
 });
 if(formatsSection){
  const experienceSection=document.createElement('section');
  experienceSection.className='experience-formats wrap';
  experienceSection.id='experience-formats';
  experienceSection.innerHTML=`<div class="section-top"><div><p class="eyebrow">HOSTED EXPERIENCE FORMATS</p><h2>Body, breath and rest—<br>clearly held.</h2></div><p>A separate pathway for internal events, offsites, retreats and hospitality settings.</p></div><p class="experience-lead">These are facilitated group experiences, distinct from organisational facilitation. They are not employee assessment, performance management or clinical care. Participation, movement and personal reflection remain voluntary.</p><div class="cards experience-cards"><article><span class="number">01 / BODY AWARENESS</span><h3>BODY LANGUAGE</h3><p>Guided movement and body-awareness workshop. Participants leave with three personal focus areas for their own practice; no individual results are shared with an employer or host.</p><a href="/body-language/en/partners/" data-format="BODY LANGUAGE partner workshop">Explore BODY LANGUAGE <span aria-hidden="true">↗</span></a></article><article><span class="number">02 / BREATH &amp; REST</span><h3>RETURN</h3><p>A private experience of breathwork, body awareness and Yoga Nidra—suited to a deliberate pause within an offsite, team day or hosted programme.</p><a href="/mihira-ceremonia/return/#organizations" data-format="RETURN · breathwork & Yoga Nidra">Explore RETURN <span aria-hidden="true">↗</span></a></article><article><span class="number">03 / YOGA NIDRA &amp; SOUND</span><h3>DEEP REST</h3><p>A quiet group experience combining Yoga Nidra and live handpan sound, designed for an unhurried close or transition in an event programme.</p><a href="/events/deep-rest/" data-format="DEEP REST · Yoga Nidra & live handpan">Explore DEEP REST <span aria-hidden="true">↗</span></a></article></div><p class="scope">For every hosted experience, we agree the purpose, duration, group size, room, equipment, accessibility, travel, fee and booking route in writing before confirmation.</p>`;
  formatsSection.insertAdjacentElement('afterend',experienceSection);
  const experienceNav=document.createElement('a');
  experienceNav.href='#experience-formats';experienceNav.textContent='Experience formats';
  document.querySelector('header nav')?.insertBefore(experienceNav,document.querySelector('.header-cta'));
 }
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
