const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  // Only allow form submissions.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Method not allowed."
    });
  }

  try {
    const {
      name,
      email,
      organisation = "",
      context,
      message
    } = req.body || {};

    // Basic server-side validation.
    if (
      !name?.trim() ||
      !email?.trim() ||
      !context?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields."
      });
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
