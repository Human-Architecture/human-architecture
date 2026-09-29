const {Resend}=require('resend');

const fields=['org','name','email','phone','web','location','type','count','time','duration','interest','audience','space','notes'];
const required=['org','name','email','location','type','count','time','duration','audience','space'];
const clean=(value,max=1200)=>typeof value==='string'?value.trim().slice(0,max):'';
module.exports=async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false,error:'Method not allowed'})}
  const b=req.body||{};
  if(b.website)return res.status(200).json({ok:true}); // honeypot
  if(b.privacy!==true || required.some(k=>!clean(b[k])) || !Array.isArray(b.interest) || !b.interest.length || b.interest.length>7)return res.status(400).json({ok:false,error:'Required fields missing'});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(b.email,180)))return res.status(400).json({ok:false,error:'Invalid email'});
  if(fields.some(k=>k!=='interest' && typeof b[k]==='string' && b[k].length>1500) || b.interest.some(x=>typeof x!=='string'||x.length>80))return res.status(400).json({ok:false,error:'Field too long'});
  if(!process.env.RESEND_API_KEY)return res.status(503).json({ok:false,error:'Delivery unavailable'});
  const values=fields.map(k=>[k,k==='interest'?b.interest.map(x=>clean(x,80)).join(', '):clean(b[k])]);
  const text=['BODY LANGUAGE partner enquiry',`Language: ${b.language==='en'?'English':'German'}`,...values.map(([k,v])=>`${k}: ${v||'—'}`),'Privacy notice acknowledged: yes'].join('\n\n');
  try{
    const resend=new Resend(process.env.RESEND_API_KEY);
    const {error}=await resend.emails.send({from:'Human Architecture Website <website@human-architecture.info>',to:['hello@human-architecture.info'],replyTo:clean(b.email,180),subject:`BODY LANGUAGE partner enquiry · ${clean(b.org,100)}`,text});
    if(error)throw new Error(error.message||'Email failed');
    return res.status(200).json({ok:true});
  }catch(error){console.error('BODY LANGUAGE partner enquiry delivery failed',error);return res.status(500).json({ok:false,error:'Delivery failed'})}
};
