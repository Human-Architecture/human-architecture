const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const clean = (v) => typeof v === "string" ? v.trim() : "";
const emailOK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Allow", "POST");
  if (req.method !== "POST") return res.status(405).json({ok:false,error:"Method not allowed"});
  const data = req.body || {};
  if (clean(data.website)) return res.status(400).json({ok:false,error:"Invalid submission"});
  const name=clean(data.name), contract=clean(data.contract), email=clean(data.email);
  if (!name || !contract || !emailOK(email) || name.length>150 || contract.length>500 || email.length>254)
    return res.status(400).json({ok:false,error:"Bitte Name, Vertragsangabe und gültige E-Mail-Adresse angeben."});
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ok:false,error:"Online-Versand momentan nicht verfügbar. Bitte per E-Mail widerrufen."});
  const received=new Date().toISOString();
  const content="Widerrufserklärung\nName: "+name+"\nVertrag / Leistung: "+contract+"\nE-Mail für Eingangsbestätigung: "+email+"\nEingang (UTC): "+received+"\n";
  try {
    const owner=await resend.emails.send({from:process.env.INTAKE_FROM_EMAIL || "Human Architecture <intake@human-architecture.info>",to:["hello@human-architecture.info"],replyTo:email,subject:"Widerrufserklärung eingegangen",text:content});
    if(owner.error) throw new Error("Owner delivery failed");
    const confirmation=await resend.emails.send({from:process.env.INTAKE_FROM_EMAIL || "Human Architecture <intake@human-architecture.info>",to:[email],replyTo:"hello@human-architecture.info",subject:"Eingangsbestätigung Ihrer Widerrufserklärung",text:"Wir bestätigen den Eingang Ihrer Widerrufserklärung. Dies ist keine Entscheidung über deren rechtliche Wirksamkeit.\n\n"+content});
    if(confirmation.error) {
      console.error("Withdrawal acknowledgement failed");
      return res.status(202).json({ok:true,acknowledged:false,message:"Ihre Erklärung wurde übermittelt. Die automatische Eingangsbestätigung konnte nicht versandt werden. Bitte kontaktieren Sie uns zusätzlich per E-Mail."});
    }
    return res.status(200).json({ok:true,acknowledged:true,message:"Ihre Widerrufserklärung wurde übermittelt. Eine Eingangsbestätigung wurde per E-Mail versandt."});
  } catch(e) {
    console.error("Withdrawal submission failed");
    return res.status(503).json({ok:false,error:"Der Online-Versand konnte nicht bestätigt werden. Bitte senden Sie Ihren Widerruf unmittelbar per E-Mail an hello@human-architecture.info."});
  }
};