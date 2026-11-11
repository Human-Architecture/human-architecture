document.addEventListener('DOMContentLoaded',()=>{
 const isGerman=document.documentElement.lang==='de';
 const form=document.getElementById('international-enquiry');
 const format=document.getElementById('format');
 const formatsSection=document.getElementById('formats');
 const status=document.getElementById('form-status');
 const fallback=document.getElementById('email-fallback');
 const button=form.querySelector('button[type="submit"]');
 let sending=false;

 if(!isGerman){
  const germanPageLink=document.querySelector('header nav a[href="/organizations/?lang=de"]');
  if(germanPageLink){
   germanPageLink.href='/organizations/international/de/';
   germanPageLink.textContent='Deutsch';
  }
 }

 const seasonalStyles=document.createElement('link');
 seasonalStyles.rel='stylesheet';
 seasonalStyles.href='/organizations/international/scorpio-season.css';
 document.head.append(seasonalStyles);
 const seasonalShapeStyles=document.createElement('link');
 seasonalShapeStyles.rel='stylesheet';
 seasonalShapeStyles.href='/organizations/international/scorpio-shape.css';
 document.head.append(seasonalShapeStyles);
 const founderStyles=document.createElement('link');
 founderStyles.rel='stylesheet';
 founderStyles.href='/organizations/international/founder.css';
 if(!document.querySelector('link[href$="founder.css"]'))document.head.append(founderStyles);
 const hero=document.querySelector('.hero');
 if(hero){
  const season=document.createElement('section');
  season.className='scorpio-season';
  season.setAttribute('aria-label',isGerman?'Scorpio Season für Organisationen':'Scorpio season for organizations');
  season.innerHTML=isGerman
   ?`<div class="wrap scorpio-season__inner"><div><p class="eyebrow">SCORPIO SEASON · FÜR ORGANISATIONEN</p><h2>Nicht jede Reibung braucht mehr Tempo.</h2><p>Manche braucht eine präzise Frage. Wenn Entscheidungen stocken, Rollen verschwimmen oder Gespräche an der Oberfläche bleiben, ist dies der Moment, den Kontext klar zu benennen und daraus belastbare Vereinbarungen zu formen.</p></div><div><a href="#enquiry">Den Kontext besprechen <span aria-hidden="true">↗</span></a><div class="scorpio-season__mark" aria-hidden="true"></div></div></div>`
   :`<div class="wrap scorpio-season__inner"><div><p class="eyebrow">SCORPIO SEASON · FOR ORGANIZATIONS</p><h2>Not every friction point needs more speed.</h2><p>Some need a precise question. When decisions stall, roles blur or conversations remain on the surface, this is the moment to name the context clearly and turn it into durable agreements.</p></div><div><a href="#enquiry">Discuss the context <span aria-hidden="true">↗</span></a><div class="scorpio-season__mark" aria-hidden="true"></div></div></div>`;
  hero.insertAdjacentElement('afterend',season);
 }

 const approach=document.getElementById('approach');
 if(approach&&!document.querySelector('.founder-panel')){
  const founder=document.createElement('section');
  founder.className='founder-panel';
  founder.innerHTML=isGerman
   ?`<div class="wrap founder-grid"><figure><div class="founder-portrait"><img src="/assets/portraits/mel-organizations-founder-v2.png" alt="Mel Mihira, Gründerin und Systemarchitektin von Human Architecture" width="1122" height="1402" loading="lazy"></div><figcaption>Mel Mihira · Gründerin &amp; Systemarchitektin</figcaption></figure><div><p class="eyebrow">IHRE ANSPRECHPARTNERIN</p><h2>Mel Mihira</h2><p>Mel Mihira entwickelt und moderiert die internationalen Formate von Human Architecture. Der Ausgangspunkt ist immer der konkrete Kontext: die Menschen, die Arbeit und die Vereinbarungen, die im Alltag tragen sollen.</p><a href="/what-is-human-architecture/#founder">Mel &amp; den Ansatz kennenlernen ↗</a></div></div>`
   :`<div class="wrap founder-grid"><figure><div class="founder-portrait"><img src="/assets/portraits/mel-organizations-founder-v2.png" alt="Mel Mihira, Founder and System Architect of Human Architecture" width="1122" height="1402" loading="lazy"></div><figcaption>Mel Mihira · Founder &amp; System Architect</figcaption></figure><div><p class="eyebrow">YOUR FACILITATOR</p><h2>Led with presence,<br>held with precision.</h2><p>Mel Mihira designs and facilitates each Human Architecture programme. The work is grounded in the actual context: who is in the room, what needs to be addressed and what a responsible next step requires.</p><a href="/what-is-human-architecture/#founder">Meet Mel &amp; explore the approach ↗</a></div></div>`;
  approach.insertAdjacentElement('afterend',founder);
 }

 const experienceStyles=document.createElement('style');
 experienceStyles.textContent=`.experience-formats{border-top:1px solid #082d3524}.experience-formats .eyebrow{color:#785a32}.experience-lead{max-width:760px;font-size:18px;line-height:1.7}.experience-cards{margin-bottom:28px}.experience-cards article{border-top-color:#0d5969;background:linear-gradient(145deg,#fffdf8,#edf3f0)}.experience-cards h3{margin-bottom:12px}.experience-cards p{line-height:1.7}`;
 document.head.append(experienceStyles);

 const experienceOptions=[
  'BODY LANGUAGE partner workshop',
  'RETURN · breathwork & Yoga Nidra',
  'DEEP REST · Yoga Nidra & live handpan'
 ];
 if(!isGerman){
  experienceOptions.forEach(value=>{
   const option=document.createElement('option');
   option.value=value;option.textContent=value;format.append(option);
  });
 }
 if(formatsSection&&!isGerman){
  const experienceSection=document.createElement('section');
  experienceSection.className='experience-formats wrap';
  experienceSection.id='experience-formats';
  experienceSection.innerHTML=`<div class="section-top"><div><p class="eyebrow">THREE HOSTED EXPERIENCES</p><h2>Body, breath and rest—<br>clearly held.</h2></div><p>A separate pathway for internal events, offsites, retreats and hospitality settings.</p></div><p class="experience-lead">Choose BODY LANGUAGE for movement and personal practice, RETURN for breathwork and Yoga Nidra, or DEEP REST for Yoga Nidra with optional live handpan. These are facilitated group experiences, distinct from organisational facilitation. They are not employee assessment, performance management or clinical care. Participation, movement and personal reflection remain voluntary.</p><div class="cards experience-cards"><article><span class="number">01 / BODY AWARENESS</span><h3>BODY LANGUAGE</h3><p>Guided movement and body-awareness workshop. Participants leave with three personal focus areas for their own practice; no individual results are shared with an employer or host.</p><a href="/body-language/en/partners/" data-format="BODY LANGUAGE partner workshop">Explore BODY LANGUAGE <span aria-hidden="true">↗</span></a></article><article><span class="number">02 / BREATH &amp; REST</span><h3>RETURN</h3><p>A private experience of breathwork, body awareness and Yoga Nidra—suited to a deliberate pause within an offsite, team day or hosted programme.</p><a href="/mihira-ceremonia/return/#organizations" data-format="RETURN · breathwork & Yoga Nidra">Explore RETURN <span aria-hidden="true">↗</span></a></article><article><span class="number">03 / YOGA NIDRA &amp; SOUND</span><h3>DEEP REST</h3><p>A calm group experience with Yoga Nidra and optional live handpan sound—suited to a deliberate close, arrival or transition in an event programme.</p><a href="/events/deep-rest/" data-format="DEEP REST · Yoga Nidra & live handpan">Explore DEEP REST <span aria-hidden="true">↗</span></a></article></div><p class="scope">Yoga and guided movement can be included as a tailored element when it supports the group, venue and purpose; it is scoped within the chosen experience rather than presented as a fourth competing format.</p><p class="scope">For every hosted experience, we agree the purpose, duration, group size, room, equipment, accessibility, travel, fee and booking route in writing before confirmation.</p>`;
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
   status.textContent=isGerman?'Bitte geben Sie Ihren Namen, Ihre Organisation und eine kurze Beschreibung Ihrer Anfrage ein.':'Please enter your name, organization and a short description of your enquiry.';status.focus();return;
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
  sending=true;button.disabled=true;button.textContent=isGerman?'Ihre Anfrage wird gesendet…':'Sending your enquiry…';status.textContent='';fallback.hidden=true;
  try{
   const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:get('name'),email:get('email'),organisation:get('organisation'),context:'International corporate programme — '+get('region'),message})});
   const result=await response.json();
   if(!response.ok||result.success!==true)throw new Error('Not confirmed');
   status.textContent=isGerman?'Vielen Dank. Ihre Anfrage ist eingegangen. Wir prüfen Ihren Kontext und melden uns persönlich zum nächsten Schritt.':'Thank you. Your enquiry has been received. We will review your context and respond personally to discuss the next step.';
   form.reset();button.textContent=isGerman?'Anfrage eingegangen':'Enquiry received';status.focus();
  }catch(error){
   status.textContent=isGerman?'Der Versand konnte nicht bestätigt werden.':'We could not confirm delivery.';fallback.hidden=false;
   button.disabled=false;button.textContent=isGerman?'Erneut senden':'Try sending again';sending=false;status.focus();
  }
 });
});
