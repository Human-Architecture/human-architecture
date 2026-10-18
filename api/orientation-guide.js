const MAX_INPUT_LENGTH = 1200;

const ROUTES = Object.freeze({
  codex: { url: "/codex/", label: { en: "Explore The Codex", de: "Den Codex entdecken" } },
  sessions: { url: "/sessions/", label: { en: "Explore sessions", de: "Sessions entdecken" } },
  mihira: { url: "/mihira-ceremonia/", label: { en: "Explore Mihira Ceremonia", de: "Mihira Ceremonia entdecken" } },
  events: { url: "/events/", label: { en: "View upcoming dates", de: "Nächste Termine ansehen" } },
  organizations: { url: "/organizations/", label: { en: "For teams & organisations", de: "Für Teams & Organisationen" } },
  discovery: { url: "https://calendar.app.google/4kmLAa3odRQHkhoRA", label: { en: "Book a Discovery Call", de: "Discovery Call buchen" } },
  support: { url: "https://calendar.app.google/Vz5USfrjk8RcJ9Ze7", label: { en: "Reserve a Support Call", de: "Support Call reservieren" } }
});

const fallback = { en: { title: "Begin with a short conversation", summary: "A Discovery Call is the clearest first step when your context needs a little more space. We can then point you to the most fitting next step.", route: "discovery" }, de: { title: "Beginne mit einem kurzen Gespräch", summary: "Wenn dein Anliegen etwas mehr Raum braucht, ist ein Discovery Call der klarste Einstieg. Danach lässt sich der passende nächste Schritt gemeinsam einordnen.", route: "discovery" } };

function localDirection(message, language) {
  const text = message.toLowerCase();
  const matched = (terms) => terms.some((term) => text.includes(term));
  if (matched(["team", "organisation", "organization", "leadership", "führung", "workplace", "unternehmen", "workshop for"])) return language === "de" ? { route: "organizations", title: "Ein Einstieg für dein Team", summary: "Für ein Team, eine Organisation oder einen Arbeitskontext ist der Organisationsbereich der passende nächste Schritt. Dort findest du den Rahmen für eine erste Anfrage und gemeinsame Formate." } : { route: "organizations", title: "A starting point for your team", summary: "For a team, organisation or workplace context, the organisations pathway is the clearest next step. There you can see the framework for an initial enquiry and shared formats." };
  if (matched(["event", "workshop", "termin", "date", "return", "deep rest", "body language", "astrology"])) return language === "de" ? { route: "events", title: "Ein öffentlicher Einstieg", summary: "Ein öffentlicher Termin scheint hier der passende Einstieg zu sein. Sieh dir die kommenden Formate an und wähle den Rahmen, der dich anspricht." } : { route: "events", title: "A public entry point", summary: "An upcoming public date appears to be the most fitting entry point. Explore the current formats and choose the one that speaks to your context." };
  if (matched(["ceremony", "ceremonia", "transition", "trauer", "grief", "wedding", "hochzeit", "birth", "geburt", "identity", "identität"])) return language === "de" ? { route: "mihira", title: "Ein Raum für Übergang", summary: "Für ein persönliches Übergangsthema ist Mihira Ceremonia der passendere Einstieg. Dort findest du Formate, die Identität, Beziehung und Veränderung bewusst rahmen." } : { route: "mihira", title: "A space for transition", summary: "For a personal transition, Mihira Ceremonia is the more fitting entry. It offers formats that hold identity, relationship and change with care." };
  if (matched(["massage", "bodywork", "körper", "körperarbeit", "touch", "berührung", "regulation", "regulierung", "in-person session", "vor ort"])) return language === "de" ? { route: "sessions", title: "Ein körpernaher Einstieg", summary: "Eine persönliche Session ist hier wahrscheinlich der passendere nächste Schritt. Auf der Sessions-Seite findest du Ablauf, Rahmen und die verfügbaren Formate." } : { route: "sessions", title: "An in-person entry point", summary: "A personal session is likely the more fitting next step here. The sessions page explains the formats, practical frame and available ways to begin." };
  if (matched(["pattern", "muster", "understand", "verstehen", "codex", "self", "selbst", "relationship", "beziehung", "work and relationship"])) return language === "de" ? { route: "codex", title: "Ein Einstieg über den Codex", summary: "Wenn du wiederkehrende Muster und deine eigene Struktur besser verstehen möchtest, ist der Codex der klare Einstieg. Dort findest du die verschiedenen Wege, persönlich damit zu arbeiten." } : { route: "codex", title: "Begin with The Codex", summary: "If you want to understand recurring patterns and your own structure more clearly, The Codex is the clearest entry. There you can explore the personal ways of working with it." };
  return fallback[language];
}

const systemInstructions = `You are the Human Architecture Orientation Guide. Help a visitor choose one clear, appropriate next step. Human Architecture offers: The Codex for self-understanding and personal patterns; sessions for bodywork, regulation and practical personal support; Mihira Ceremonia for identity, ceremony and life transitions; events for public workshops; organisations for teams, leadership and workplace contexts; a complimentary Discovery Call when the right entry is not clear; and a paid Support Call only for a returning person with one clearly defined, focused question. Do not diagnose, interpret symptoms, make health, therapeutic, legal or financial claims, promise outcomes, or replace professional care. Do not use clinical language. Do not invent prices, dates, availability, services, credentials, links or policies. Be warm, exact, spacious and plain-language. Select exactly one route from: codex, sessions, mihira, events, organizations, discovery, support. Choose support only if the visitor expressly says they are already in an existing Human Architecture/Codex/session process and have one concrete question. Choose discovery whenever information is too limited or multiple paths could fit. Return valid JSON only: {"route":"one route id","title":"short, calm title","summary":"two concise sentences, max 65 words"}. Match the visitor's language: German when their message is predominantly German, otherwise English.`;

function clean(value, max = MAX_INPUT_LENGTH) { return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : ""; }
function extractText(response) { if (typeof response.output_text === "string") return response.output_text; return (response.output || []).flatMap((item) => Array.isArray(item.content) ? item.content : []).filter((item) => item.type === "output_text" && typeof item.text === "string").map((item) => item.text).join("\n"); }
function parseGuideResponse(text, language) { try { const parsed = JSON.parse(text); if (!ROUTES[parsed.route]) return fallback[language]; const title = clean(parsed.title, 120); const summary = clean(parsed.summary, 560); return title && summary ? { route: parsed.route, title, summary } : fallback[language]; } catch { return fallback[language]; } }

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false, error: "Method not allowed." }); }
  const body = req.body || {};
  if (clean(body.website, 160)) return res.status(200).json({ ok: true, ignored: true });
  const message = clean(body.message);
  const language = body.language === "de" ? "de" : "en";
  if (message.length < 8) return res.status(400).json({ ok: false, error: language === "de" ? "Bitte beschreibe dein Anliegen in einem kurzen Satz." : "Please describe what brings you here in one short sentence." });
  const sendGuidance = (guidance, source) => {
    const route = ROUTES[guidance.route];
    return res.status(200).json({ ok: true, title: guidance.title, summary: guidance.summary, href: route.url, label: route.label[language], external: route.url.startsWith("https://"), source });
  };
  if (!process.env.OPENAI_API_KEY) return sendGuidance(localDirection(message, language), "local");
  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: "gpt-5.4-mini", instructions: systemInstructions, input: message, max_output_tokens: 260, store: false }) });
    if (!openaiResponse.ok) { const detail = await openaiResponse.text(); console.error("Orientation Guide API request failed:", openaiResponse.status, detail.slice(0, 400)); return sendGuidance(localDirection(message, language), "local"); }
    const response = await openaiResponse.json();
    const guidance = parseGuideResponse(extractText(response), language);
    return sendGuidance(guidance, "ai");
  } catch (error) { console.error("Orientation Guide error:", error); return sendGuidance(localDirection(message, language), "local"); }
};
