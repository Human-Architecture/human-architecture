const { Resend } = require("resend");
const { getOrientation } = require("../lib/orientation-guide");

const resend = new Resend(process.env.RESEND_API_KEY);
const clean = (value) => typeof value === "string" ? value.trim() : "";
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const safeText = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
}[character]));

async function coachCollaboration(req, res) {
  const body = req.body || {};
  const english = body.locale === "en";
  if (clean(body.website)) return res.status(200).json({ ok: true });
  const fields = { name: clean(body.name), email: clean(body.email), website: clean(body.websiteUrl), practice: clean(body.practice), setting: clean(body.setting), collaboration: clean(body.collaboration), intention: clean(body.intention), boundaries: clean(body.boundaries), birthDate: clean(body.birthDate), birthTime: clean(body.birthTime), birthPlace: clean(body.birthPlace), chartAcknowledgement: body.chartAcknowledgement === true };
  const required = ["name", "email", "practice", "setting", "collaboration", "intention", "boundaries", "birthDate", "birthTime", "birthPlace"];
  if (required.some((key) => !fields[key]) || !fields.chartAcknowledgement) return res.status(400).json({ ok: false, error: english ? "Please complete all required fields and confirm the purpose for the birth details." : "Bitte fülle alle Pflichtfelder aus und bestätige den Verwendungszweck der Geburtsdaten." });
  if (!validEmail(fields.email)) return res.status(400).json({ ok: false, error: english ? "Please enter a valid email address." : "Bitte gib eine gültige E-Mail-Adresse ein." });
  const limits = { name: 100, email: 254, website: 300, practice: 700, setting: 700, collaboration: 100, intention: 1800, boundaries: 1800, birthDate: 10, birthTime: 5, birthPlace: 180 };
  if (Object.entries(limits).some(([key, limit]) => fields[key].length > limit)) return res.status(400).json({ ok: false, error: english ? "One entry is longer than this enquiry allows." : "Eine Angabe ist länger als für diese Anfrage vorgesehen." });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.birthDate) || !/^\d{2}:\d{2}$/.test(fields.birthTime)) return res.status(400).json({ ok: false, error: english ? "Please provide your birth date and time in the required format." : "Bitte gib Geburtsdatum und Geburtszeit im vorgesehenen Format an." });
  if (!process.env.RESEND_API_KEY) return res.status(500).json({ ok: false, error: english ? "The delivery service is currently unavailable." : "Der Versanddienst ist momentan nicht verfügbar." });
  const rows = [["Name", fields.name], ["E-Mail", fields.email], ["Website / Profil", fields.website || "Nicht angegeben"], ["Praxis & Qualifikationen", fields.practice], ["Zielgruppe & Setting", fields.setting], ["Gewünschte Zusammenarbeit", fields.collaboration], ["Anliegen & gewünschtes Ergebnis", fields.intention], ["Rollen, Grenzen & Verantwortung", fields.boundaries], ["Geburtsdaten für die vereinbarte Chart-Reflexion", `${fields.birthDate} · ${fields.birthTime} · ${fields.birthPlace}`]].map(([label, value]) => `<tr><td style="padding:9px 12px;vertical-align:top;color:#50605e;font-weight:600;width:34%">${safeText(label)}</td><td style="padding:9px 12px;white-space:pre-wrap">${safeText(value)}</td></tr>`).join("");
  const { error } = await resend.emails.send({ from: process.env.INTAKE_FROM_EMAIL || "Human Architecture <intake@human-architecture.info>", to: ["hello@human-architecture.info"], replyTo: fields.email, subject: `Kooperationsanfrage · ${fields.name}`, html: `<div style="font-family:Arial,sans-serif;color:#263235;max-width:760px"><h1 style="color:#063442">Kooperationsanfrage · Coaches & Praktiker:innen</h1><p>Neue Anfrage von <strong>${safeText(fields.name)}</strong>.</p><table style="width:100%;border-collapse:collapse">${rows}</table><p style="margin-top:24px;font-size:12px;color:#667">Die Person hat bestätigt, dass ihre Geburtsdaten ausschließlich für die vorbereitende Chart-Reflexion im Rahmen dieser Kooperationsanfrage verwendet werden.</p></div>` });
  if (error) throw new Error(error.message || "Email delivery failed");
  return res.status(200).json({ ok: true, message: english ? "Thank you. Your enquiry has arrived. We will review the fit personally and come back with a clear next step." : "Danke. Deine Anfrage ist eingegangen. Wir prüfen die Passung persönlich und melden uns mit einem klaren nächsten Schritt." });
}

module.exports = async function handler(req, res) {
  // Only allow form submissions.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Method not allowed."
    });
  }

  if (req.query?.orientation === "1") {
    return getOrientation(req, res);
  }

  if (req.body?.formType === "coach-collaboration") {
    try { return await coachCollaboration(req, res); }
    catch (error) {
      console.error("Coach collaboration enquiry failed:", error);
      return res.status(500).json({ ok: false, error: req.body?.locale === "en" ? "Your enquiry could not be sent right now. Please try again later or email hello@human-architecture.info." : "Die Anfrage konnte gerade nicht versendet werden. Bitte versuche es später erneut oder schreibe an hello@human-architecture.info." });
    }
  }

  try {
    const {
      name,
      email,
      organisation = "",
      context,
      message,
      sensitiveDataChoice
    } = req.body || {};

    // Basic server-side validation.
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof organisation !== "string" ||
      typeof context !== "string" ||
      typeof message !== "string" ||
      typeof sensitiveDataChoice !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !context.trim() ||
      !message.trim() ||
      !sensitiveDataChoice.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields."
      });
    }

    const fieldsExceedLimit =
      name.trim().length > 100 ||
      email.trim().length > 254 ||
      organisation.trim().length > 200 ||
      context.trim().length > 100 ||
      message.trim().length > 5000;

    if (fieldsExceedLimit) {
      return res.status(400).json({
        success: false,
        message: "One or more fields are too long."
      });
    }

    const allowedSensitiveDataChoices = new Set([
      "no-special-category",
      "voluntary-health-consent"
    ]);

    if (!allowedSensitiveDataChoices.has(sensitiveDataChoice)) {
      return res.status(400).json({
        success: false,
        message: "Please choose how you would like us to handle sensitive information."
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanOrganisation = organisation.trim();
    const cleanContext = context.trim();
    const cleanMessage = message.trim();
    const cleanSensitiveDataChoice = sensitiveDataChoice;

    // -----------------------------------------------------
    // 1. PRIVATE NOTIFICATION TO HUMAN ARCHITECTURE
    // -----------------------------------------------------

    const notification = await resend.emails.send({
      from: "Human Architecture Website <website@human-architecture.info>",
      to: ["hello@human-architecture.info", "mihira.ceremonia@googlemail.com"],
      replyTo: cleanEmail,
      subject: `Human Architecture enquiry — ${cleanContext}`,

      text: `
NEW HUMAN ARCHITECTURE ENQUIRY

Name:
${cleanName}

Email:
${cleanEmail}

Organisation:
${cleanOrganisation || "Not provided"}

Context:
${cleanContext}

Sensitive-data choice:
${cleanSensitiveDataChoice}

Message:
${cleanMessage}
      `.trim()
    });

    if (notification.error) {
      console.error(
        "Human Architecture notification failed:",
        notification.error
      );

      return res.status(500).json({
        success: false,
        message:
          "Your message could not be delivered. Please contact us by email or WhatsApp."
      });
    }

    // -----------------------------------------------------
    // 2. AUTOMATED CONFIRMATION TO VISITOR
    // -----------------------------------------------------

    const confirmation = await resend.emails.send({
      from: "Human Architecture <hello@human-architecture.info>",
      to: [cleanEmail],
      replyTo: "hello@human-architecture.info",
      subject: "We received your Human Architecture enquiry",

      text: `
Hello ${cleanName},

Thank you for contacting Human Architecture.

Your message has been received.

We will review the context you shared and respond personally with the most appropriate next step.

There is nothing further you need to complete at this stage.

Human Architecture
hello@human-architecture.info
      `.trim()
    });

    if (confirmation.error) {
      // The original enquiry was already delivered.
      // We therefore log this rather than telling the visitor
      // that their enquiry failed.
      console.error(
        "Visitor confirmation failed:",
        confirmation.error
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Thank you. Your message has been received. We will review your context and respond personally."
    });

  } catch (error) {
    console.error(
      "Human Architecture contact error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Your message could not be delivered. Please contact us by email or WhatsApp."
    });
  }
};
