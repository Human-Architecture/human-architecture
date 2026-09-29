document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('partnerForm');
  if(!form)return;
  const button=form.querySelector('button[type="submit"]');
  const status=document.getElementById('formStatus');
  const success=document.getElementById('success');
  const en=document.body.dataset.lang==='en';
  const original=button.textContent;
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    status.textContent='';
    if(!form.reportValidity())return;
    const interest=[...form.querySelectorAll('[name="interest"]:checked')].map(x=>x.value);
    if(!interest.length){status.textContent=en?'Please choose at least one partnership interest.':'Bitte wähle mindestens eine Art der Zusammenarbeit.';form.querySelector('[name="interest"]').focus();return}
    const data=Object.fromEntries(new FormData(form).entries());
    data.interest=interest;
    data.privacy=form.elements.privacy.checked;
    button.disabled=true;
    button.textContent=en?'Sending…':'Wird gesendet …';
    try{
      const response=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const result=await response.json();
      if(!response.ok||result.ok!==true)throw new Error('Delivery failed');
      form.hidden=true;
      success.style.display='block';
      success.focus();
    }catch(_error){
      status.textContent=en?'We could not send your request. Please email hello@human-architecture.info.':'Die Anfrage konnte gerade nicht gesendet werden. Bitte schreibe an hello@human-architecture.info.';
      button.disabled=false;
      button.textContent=original;
    }
  });
});
