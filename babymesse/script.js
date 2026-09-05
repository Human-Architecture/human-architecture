const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".main-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Menü schließen" : "Menü öffnen"
    );
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Menü öffnen");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Menü öffnen");
    }
  });
}

/* =========================================
   LANGUAGE SWITCH — DE / EN
   ========================================= */

const languageButtons = document.querySelectorAll(".lang-button");

const translations = {
  de: {
    pageTitle: "Human Architecture für Mama & Baby | Babymesse",

    navMama: "Für Mama",
    navBaby: "Für Baby",
    navTogether: "Für euch",
    navContact: "Kontakt",

    heroTitle: "DEN MENSCHEN VERSTEHEN.<br>VON ANFANG AN.",
    heroPrinciples: "KÖRPER · INDIVIDUALITÄT · VERBINDUNG",
    heroQuestion: "Was braucht dein Baby – und was brauchst du?",
    heroDiscover: "ANGEBOTE ENTDECKEN",
    heroWhatsapp: "PER WHATSAPP SCHREIBEN",

    introLabel: "DREI WEGE. EIN GEDANKE:",
    introTitle: "Euch individueller verstehen.",
    introText:
      "Human Architecture verbindet Körper, Individualität und Beziehung. Für Mamas, Babys und das bewusste Kennenlernen miteinander.",

    mamaLabel: "01 · FÜR MAMA",
    mamaTitle: "MAMA BODYWORK",
    mamaSubtitle: "Deinen Körper unterstützen.",
    mamaText:
      "Individuelle Körperarbeit rund um Schwangerschaft und die Zeit danach.",
    mamaPoints: "Entlasten · Ausrichten · Regulieren",
    mamaButton: "MAMA BODYWORK ANFRAGEN",

    babyLabel: "02 · FÜR BABY",
    babyTitle: "BABY CODEX™",
    babySubtitle: "Dein Baby verstehen.",
    babyText:
      "Eine persönliche Orientierungshilfe, um dein Baby in seiner Individualität von Anfang an bewusster kennenzulernen.",
    babyPoints: "Temperament · Bedürfnisse · Entfaltung",
    babyButton: "BABY CODEX ANFRAGEN",

    togetherLabel: "03 · FÜR EUCH",
    togetherTitle: "MAMA × BABY CODEX™",
    togetherSubtitle: "Euch miteinander verstehen.",
    togetherText:
      "Entdeckt, was euch verbindet, wo ihr Unterschiedliches braucht und wie ihr euch bewusster begegnen könnt.",
    togetherPoints: "Ähnlichkeiten · Unterschiede · Verbindung",
    togetherButton: "MAMA × BABY CODEX ANFRAGEN",

    specialLabel: "MESSE-SPECIAL",
    specialTitle: "Direkt auf der Babymesse buchen und 20 % erhalten.",
    specialSecondary:
      "Oder innerhalb von 7 Tagen entscheiden und 10 % erhalten.",
    specialNote:
      "Das Angebot gilt für Buchungen im Zusammenhang mit der Babymesse und kann nicht mit anderen Vergünstigungen kombiniert werden.",
    specialButton: "MESSE-SPECIAL PER WHATSAPP SICHERN",

    finalTitle: "FÜR MAMA.<br>FÜR BABY.<br>FÜR EUCH.",
    finalText:
      "Du musst dein Kind nicht formen. Du darfst lernen, es zu verstehen.",
    finalButton: "UNVERBINDLICH KONTAKT AUFNEHMEN",

    disclaimer:
      "Die Codexe dienen der persönlichen Reflexion und Orientierung. Sie ersetzen keine medizinische, therapeutische oder entwicklungspsychologische Diagnostik oder Behandlung."
  },

  en: {
    pageTitle: "Human Architecture for Mama & Baby | Baby Fair",

    navMama: "For Mama",
    navBaby: "For Baby",
    navTogether: "For You",
    navContact: "Contact",

    heroTitle: "UNDERSTAND THE HUMAN BEING.<br>FROM THE VERY BEGINNING.",
    heroPrinciples: "BODY · INDIVIDUALITY · CONNECTION",
    heroQuestion: "What does your baby need – and what do you need?",
    heroDiscover: "EXPLORE THE OFFERINGS",
    heroWhatsapp: "MESSAGE US ON WHATSAPP",

    introLabel: "THREE PATHS. ONE IDEA:",
    introTitle: "Understand each other more individually.",
    introText:
      "Human Architecture brings together body, individuality and relationship — for mothers, babies and a more conscious understanding of one another.",

    mamaLabel: "01 · FOR MAMA",
    mamaTitle: "MAMA BODYWORK",
    mamaSubtitle: "Support your body.",
    mamaText:
      "Individual bodywork for pregnancy and the period that follows.",
    mamaPoints: "Relieve · Align · Regulate",
    mamaButton: "ENQUIRE ABOUT MAMA BODYWORK",

    babyLabel: "02 · FOR BABY",
    babyTitle: "BABY CODEX™",
    babySubtitle: "Understand your baby.",
    babyText:
      "A personal orientation designed to help you become more familiar with your baby's individuality from the very beginning.",
    babyPoints: "Temperament · Needs · Development",
    babyButton: "ENQUIRE ABOUT BABY CODEX",

    togetherLabel: "03 · FOR YOU",
    togetherTitle: "MAMA × BABY CODEX™",
    togetherSubtitle: "Understand each other.",
    togetherText:
      "Discover what connects you, where your needs differ and how you can meet one another with greater awareness.",
    togetherPoints: "Similarities · Differences · Connection",
    togetherButton: "ENQUIRE ABOUT MAMA × BABY CODEX",

    specialLabel: "FAIR SPECIAL",
    specialTitle: "Book directly at the Baby Fair and receive 20% off.",
    specialSecondary:
      "Or decide within 7 days and receive 10% off.",
    specialNote:
      "This offer applies to bookings connected with the Baby Fair and cannot be combined with other discounts.",
    specialButton: "CLAIM THE FAIR SPECIAL VIA WHATSAPP",

    finalTitle: "FOR MAMA.<br>FOR BABY.<br>FOR YOU.",
    finalText:
      "You do not have to shape your child. You can learn to understand them.",
    finalButton: "GET IN TOUCH",

    disclaimer:
      "The Codex offerings are designed for personal reflection and orientation. They do not replace medical, therapeutic or developmental-psychological diagnosis or treatment."
  }
};

function setText(selector, value, useHTML = false) {
  const element = document.querySelector(selector);

  if (!element) return;

  if (useHTML) {
    element.innerHTML = value;
  } else {
    element.textContent = value;
  }
}

function setLanguage(lang) {
  document.querySelectorAll(".ha-fair-route [data-de][data-en]").forEach(el => { el.textContent = el.dataset[lang]; });
  const t = translations[lang];

  if (!t) return;

  document.documentElement.lang = lang;
  document.title = t.pageTitle;

  setText('.main-nav a[href="#mama"]', t.navMama);
  setText('.main-nav a[href="#baby"]', t.navBaby);
  setText('.main-nav a[href="#euch"]', t.navTogether);
  setText('.main-nav a[href="#kontakt"]', t.navContact);

  setText("#hero-title", t.heroTitle, true);
  setText(".hero-principles", t.heroPrinciples);
  setText(".hero-question", t.heroQuestion);
  setText('.hero-actions a[href="#angebote"]', t.heroDiscover);
  setText(".hero-actions .button-secondary", t.heroWhatsapp);

  setText(".intro .section-label", t.introLabel);
  setText(".intro h2", t.introTitle);
  setText(".intro .narrow > p:last-child", t.introText);

  setText("#mama .section-label", t.mamaLabel);
  setText("#mama h2", t.mamaTitle);
  setText("#mama h3", t.mamaSubtitle);
  setText("#mama .offer-copy > p:not(.section-label):not(.offer-points)", t.mamaText);
  setText("#mama .offer-points", t.mamaPoints);
  setText("#mama .button", t.mamaButton);

  setText("#baby .section-label", t.babyLabel);
  setText("#baby h2", t.babyTitle);
  setText("#baby h3", t.babySubtitle);
  setText("#baby .offer-copy > p:not(.section-label):not(.offer-points)", t.babyText);
  setText("#baby .offer-points", t.babyPoints);
  setText("#baby .button", t.babyButton);

  setText("#euch .section-label", t.togetherLabel);
  setText("#euch h2", t.togetherTitle);
  setText("#euch h3", t.togetherSubtitle);
  setText("#euch .offer-copy > p:not(.section-label):not(.offer-points)", t.togetherText);
  setText("#euch .offer-points", t.togetherPoints);
  setText("#euch .button", t.togetherButton);

  setText(".messe-special .section-label", t.specialLabel);
  setText(".messe-special h2", t.specialTitle);
  setText(".special-secondary", t.specialSecondary);
  setText(".special-note", t.specialNote);
  setText(".messe-special .button", t.specialButton);

  setText(".final-content h2", t.finalTitle, true);
  setText(".final-content p", t.finalText);
  setText(".final-content .button", t.finalButton);

  setText(".footer-disclaimer", t.disclaimer);

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  localStorage.setItem("ha-babymesse-language", lang);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

const savedLanguage =
  localStorage.getItem("ha-babymesse-language") || "de";

setLanguage(savedLanguage);
