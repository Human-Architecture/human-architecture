document.addEventListener('DOMContentLoaded',()=>{
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
