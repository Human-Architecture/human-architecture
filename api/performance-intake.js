const { Resend } = require('resend');

const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const row=(label,value)=> value ? `<tr><td style="padding:8px 12px;vertical-align:top;color:#667;font-weight:600;width:34%">${esc(label)}</td><td style="padding:8px 12px;white-space:pre-wrap">${esc(value)}</td></tr>` : '';
module.exports = async (req,res) => {
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const b=req.body||{};
    if(b.website) return res.status(200).json({ok:true});
    if(!b.name||!b.email||!b.contest||!b.posingLimits||!b.pain||!b.history||!b.goal||!b.privacyConsent||!b.accuracy) return res.status(400).json({error:'Pflichtfelder fehlen'});
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) return res.status(400).json({error:'Ungültige E-Mail'});
    if(!process.env.RESEND_API_KEY) return res.status(500).json({error:'Email service not configured'});
    const resend=new Resend(process.env.RESEND_API_KEY);
    const fields=[['Name',b.name],['E-Mail',b.email],['Telefon / WhatsApp',b.phone],['Nächster Wettkampf',b.contest],['Kategorie / Division',b.category],['Weitere Wettkämpfe',b.nextContests],['Prep-Status',b.prep],['Posing-Einschränkungen',b.posingLimits],['Feedback Posing Coach',b.coachFeedback],['Positionen, die der Körper nicht zulässt',b.bodyPosition],['Posing-Frequenz',b.posingFrequency],['Fest / eingeschränkt',b.tight],['Rechts/Links-Unterschiede',b.asymmetry],['Schmerz / unangenehm',b.pain],['Verletzungen / OPs / Beschwerden',b.history],['Aktuelle Behandlung',b.treatment],['Zu vermeiden / berücksichtigen',b.contra],['Trainingswoche',b.training],['Besonders belastete Bereiche',b.load],['Regeneration',b.recovery],['Persönliches Ziel',b.goal],['Posing-Video',b.video],['Weitere Hinweise',b.notes]];
    const html=`<div style="font-family:Arial,sans-serif;color:#263235;max-width:760px"><h1 style="color:#063442">Human Architecture® Performance Intake</h1><p>Neue Intake-Antwort von <strong>${esc(b.name)}</strong>.</p><table style="width:100%;border-collapse:collapse">${fields.map(f=>row(...f)).join('')}</table><p style="margin-top:24px;font-size:12px;color:#747a78">Datenschutz-Einwilligung und Bestätigung relevanter Angaben wurden im Formular aktiv bestätigt.</p></div>`;
    const {error}=await resend.emails.send({from:process.env.INTAKE_FROM_EMAIL||'Human Architecture <intake@human-architecture.info>',to:['hello@human-architecture.info'],replyTo:b.email,subject:`Performance Intake · ${b.name} · ${b.contest}`,html});
    if(error) throw new Error(error.message||'Email failed');
    return res.status(200).json({ok:true});
  }catch(e){console.error(e);return res.status(500).json({error:'Submission failed'})}
};