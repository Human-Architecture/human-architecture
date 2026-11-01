const { Resend } = require("resend");

const clean = (value) => typeof value === "string" ? value.trim() : "";
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const safeText = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
}[character]));

module.exports = async function coachCollaboration(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  try {
    const body = req.body || {};
    const english = body.locale === "en";
    if (clean(body.website)) return res.status(200).json({ ok: true });

    const fields = {
      name: clean(body.name), email: clean(body.email), website: clean(body.websiteUrl),
      practice: clean(body.practice), setting: clean(body.setting), collaboration: clean(body.collaboration),
      intention: clean(body.intention), boundaries: clean(body.boundaries), birthDate: clean(body.birthDate),
      birthTime: clean(body.birthTime), birthPlace: clean(body.birthPlace), chartAcknowledgement: body.chartAcknowledgement === true
    };

    const required = ["name", "email", "practice", "setting", "collaboration", "intention", "boundaries", "birthDate", "birthTime", "birthPlace"];
    if (required.some((key) => !fields[key]) || !fields.chartAcknowledgement) {
      return res.status(400).json({ ok: false, error: english ? "Please complete all required fields and confirm the purpose for the birth details." : "Bitte fülle alle Pflichtfelder aus und bestätige den Verwendungszweck der Geburtsdaten." });
    }
    if (!validEmail(fields.email)) return res.status(400).json({ ok: false, error: english ? "Please enter a valid email address." : "Bitte gib eine gültige E-Mail-Adresse ein." });

    const limits = { name: 100, email: 254, website: 300, practice: 700, setting: 700, collaboration: 100, intention: 1800, boundaries: 1800, birthDate: 10, birthTime: 5, birthPlace: 180 };
    if (Object.entries(limits).some(([key, limit]) => fields[key].length > limit)) {
      return res.status(400).json({ ok: false, error: english ? "One entry is longer than this enquiry allows." : "Eine Angabe ist länger als für diese Anfrage vorgesehen." });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.birthDate) || !/^\d{2}:\d{2}$/.test(fields.birthTime)) {
      return res.status(400).json({ ok: false, error: english ? "Please provide your birth date and time in the required format." : "Bitte gib Geburtsdatum und Geburtszeit im vorgesehenen Format an." });
    }
    if (!process.env.RESEND_API_KEY) return res.status(500).json({ ok: false, error: "Der Versanddienst ist momentan nicht verfügbar." });

    const rows = [
      ["Name", fields.name], ["E-Mail", fields.email], ["Website / Profil", fields.website || "Nicht angegeben"],
      ["Praxis & Qualifikationen", fields.practice], ["Zielgruppe & Setting", fields.setting],
      ["Gewünschte Zusammenarbeit", fields.collaboration], ["Anliegen & gewünschtes Ergebnis", fields.intention],
      ["Rollen, Grenzen & Verantwortung", fields.boundaries],
      ["Geburtsdaten für die vereinbarte Chart-Reflexion", `${fields.birthDate} · ${fields.birthTime} · ${fields.birthPlace}`]
    ].map(([label, value]) => `<tr><td style="padding:9px 12px;vertical-align:top;color:#50605e;font-weight:600;width:34%">${safeText(label)}</td><td style="padding:9px 12px;white-space:pre-wrap">${safeText(value)}</td></tr>`).join("");

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.INTAKE_FROM_EMAIL || "Human Architecture <intake@human-architecture.info>",
      to: ["hello@human-architecture.info"], replyTo: fields.email,
      subject: `Kooperationsanfrage · ${fields.name}`,
      html: `<div style="font-family:Arial,sans-serif;color:#263235;max-width:760px"><h1 style="color:#063442">Kooperationsanfrage · Coaches & Praktiker:innen</h1><p>Neue Anfrage von <strong>${safeText(fields.name)}</strong>.</p><table style="width:100%;border-collapse:collapse">${rows}</table><p style="margin-top:24px;font-size:12px;color:#667">Die Person hat bestätigt, dass ihre Geburtsdaten ausschließlich für die vorbereitende Chart-Reflexion im Rahmen dieser Kooperationsanfrage verwendet werden.</p></div>`
    });
    if (error) throw new Error(error.message || "Email delivery failed");
    return res.status(200).json({ ok: true, message: english ? "Thank you. Your enquiry has arrived. We will review the fit personally and come back with a clear next step." : "Danke. Deine Anfrage ist eingegangen. Wir prüfen die Passung persönlich und melden uns mit einem klaren nächsten Schritt." });
  } catch (error) {
    console.error("Coach collaboration enquiry failed:", error);
    return res.status(500).json({ ok: false, error: "Die Anfrage konnte gerade nicht versendet werden. Bitte versuche es später erneut oder schreibe an hello@human-architecture.info." });
  }
};
