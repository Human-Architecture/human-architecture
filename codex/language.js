(() => {
  const url = new URL(window.location.href);
  const german = url.searchParams.get("lang") === "de";
  const englishUrl = new URL(window.location.href);
  englishUrl.searchParams.delete("lang");
  const germanUrl = new URL(window.location.href);
  germanUrl.searchParams.set("lang", "de");

  const de = {
    "The Codex": "Der Codex",
    "Go deeper": "Vertiefen",
    "Deeper work": "Vertiefende Arbeit",
    "Introductory readings": "Einstiegslesungen",
    "Contact": "Kontakt",
    "← Back to The Codex": "← Zurück zum Codex",
    "INTRODUCTORY READING · €29": "EINSTIEGSLESUNG · €29",
    "INTRODUCTORY READING · €49": "EINSTIEGSLESUNG · €49",
    "SIGNATURE INTRODUCTORY READING · €59": "SIGNATURE-EINSTIEGSLESUNG · €59",
    "PRIVATE LIVE INTRODUCTION · €149": "PRIVATE LIVE-EINFÜHRUNG · €149",
    "THE SKY IS COLLECTIVE.": "DER HIMMEL IST KOLLEKTIV.",
    "THE READING IS PERSONAL.": "DIE LESUNG IST PERSÖNLICH.",
    "WHY DOES THIS FEEL": "WARUM FÜHLT SICH DAS",
    "SO FAMILIAR?": "SO VERTRAUT AN?",
    "THERE IS MORE TO YOUR CHART": "IN DEINEM HOROSKOP STECKT MEHR",
    "THAN YOUR SUN SIGN.": "ALS DEIN SONNENZEICHEN.",
    "SOME QUESTIONS DESERVE": "MANCHE FRAGEN BRAUCHEN",
    "A CONVERSATION.": "EIN GESPRÄCH.",
    "What does this moment bring into focus when we explore it through your birth chart?": "Was rückt diese Zeit in den Vordergrund, wenn wir sie im Zusammenhang mit deinem Geburtshoroskop betrachten?",
    "The Current Sky is a focused written reflection on one or two selected symbolic themes in the present moment. It brings current transits into conversation with relevant placements in your natal chart.": "Current Sky ist eine fokussierte schriftliche Einordnung von ein oder zwei symbolischen Themen, die jetzt präsent sind. Aktuelle Transite werden dabei mit relevanten Faktoren deines Geburtshoroskops in Beziehung gesetzt.",
    "It is not a prediction or a final answer. It is a concise perspective for reflection.": "Es ist keine Vorhersage und keine abschließende Antwort. Es ist eine präzise Perspektive zur eigenen Reflexion.",
    "Birth information required": "Geburtsangaben erforderlich",
    "Your date of birth, place of birth and birth time where known. If your birth time is unknown, say so—nothing will be assumed.": "Geburtsdatum, Geburtsort und – falls bekannt – Geburtszeit. Wenn deine Geburtszeit unbekannt ist, sag es bitte dazu; es wird nichts vorausgesetzt.",
    "Continue to payment · €29": "Sicher bezahlen · €29",
    "After payment, we will send your private intake link. Please do not email birth details.": "Nach der Zahlung erhältst du deinen privaten Intake-Link. Bitte sende keine Geburtsdaten per E-Mail.",
    "A symbolic exploration of one theme that keeps asking for your attention.": "Eine symbolische Ausarbeitung zu einem Thema, das immer wieder deine Aufmerksamkeit fordert.",
    "You choose one focus: Love & Relationships, Identity & Expression, or Direction & Responsibility. The reading brings selected placements, aspects and house themes into a careful interpretive synthesis.": "Du wählst einen Fokus: Liebe & Beziehungen, Identität & Ausdruck oder Richtung & Verantwortung. Die Lesung verbindet ausgewählte Faktoren, Aspekte und Häuser deines Geburtshoroskops zu einer sorgfältigen Interpretation.",
    "The intention is not to explain you away. It is to give one recurring question a more precise frame.": "Sie soll dich nicht auf eine Erklärung reduzieren. Sie gibt einer wiederkehrenden Frage einen präziseren Rahmen.",
    "Date and place of birth; birth time where known; and the one theme you want to explore.": "Geburtsdatum und -ort, Geburtszeit falls bekannt, sowie das eine Thema, das du betrachten möchtest.",
    "Continue to payment · €49": "Sicher bezahlen · €49",
    "Explore how selected placements, houses and aspects form a more connected picture.": "Erkunde, wie ausgewählte Faktoren, Häuser und Aspekte ein zusammenhängenderes Bild ergeben.",
    "Astrological Foundations is a personalised written introduction to a natal chart. It considers the Sun, Moon and Ascendant where birth time permits, selected placements and aspects, one central chart theme, and relevant current transits.": "Astrologische Grundlagen ist eine persönliche schriftliche Einführung in dein Geburtshoroskop. Sie betrachtet Sonne, Mond und Aszendent – soweit die Geburtszeit dies zulässt –, ausgewählte Faktoren und Aspekte, ein zentrales Horoskopthema sowie relevante aktuelle Transite.",
    "It is an introductory astrological reading—not a complete Human Architecture Codex.": "Es ist eine astrologische Einstiegslesung, kein vollständiger Human-Architecture-Codex.",
    "Date, place and exact time of birth where possible. If the time is unknown, we will work only with what can be responsibly included.": "Geburtsdatum, -ort und möglichst genaue Geburtszeit. Falls die Zeit unbekannt ist, arbeiten wir nur mit dem, was verantwortungsvoll einbezogen werden kann.",
    "Continue to payment · €59": "Sicher bezahlen · €59",
    "20 minutes. One personal question. A focused astrological perspective.": "20 Minuten. Eine persönliche Frage. Eine fokussierte astrologische Perspektive.",
    "This private online introduction begins with one question submitted in advance. Your chart is prepared beforehand so the live time can stay focused, clear and useful for the specific theme you bring.": "Diese private Online-Einführung beginnt mit einer vorab eingereichten Frage. Dein Horoskop wird vor dem Gespräch vorbereitet, damit die gemeinsame Zeit bei dem konkreten Thema bleibt, das du mitbringst.",
    "It is a paid, focused interpretation—not a free discovery call and not a complete Codex assessment.": "Es ist eine bezahlte, fokussierte Interpretation – kein kostenloses Kennenlerngespräch und keine vollständige Codex-Ausarbeitung.",
    "Before the session": "Vor dem Gespräch",
    "One question, date and place of birth, and exact time where known. After your request, a suitable time and the practical details are agreed directly with you.": "Eine Frage, Geburtsdatum und -ort sowie – falls bekannt – die genaue Geburtszeit. Nach deiner Anfrage stimmen wir einen passenden Termin und die praktischen Details direkt mit dir ab.",
    "Request a private introduction": "Private Einführung anfragen",
    "Your request does not reserve a time. Availability and the next step are confirmed with you personally.": "Deine Anfrage reserviert noch keinen Termin. Verfügbarkeit und nächster Schritt werden persönlich mit dir bestätigt.",
    "Price": "Preis", "Format": "Format", "Includes": "Enthält", "Delivery": "Lieferzeit", "Does not include": "Enthält nicht", "Focus": "Fokus", "Rhythm": "Rhythmus",
    "Personalised written PDF · 1–2 pages": "Persönliches schriftliches PDF · 1–2 Seiten",
    "Personalised written PDF · 3–4 pages": "Persönliches schriftliches PDF · 3–4 Seiten",
    "Personalised written PDF · 4–6 pages": "Persönliches schriftliches PDF · 4–6 Seiten",
    "Within five working days": "Innerhalb von fünf Werktagen",
    "Within seven working days": "Innerhalb von sieben Werktagen",
    "View the sample Codex pages (DE/EN PDF) ↗": "Beispielseiten ansehen (DE/EN PDF) ↗",
    "Can I choose more than one theme?": "Kann ich mehr als ein Thema wählen?",
    "Will this tell me what to do?": "Sagt mir die Lesung, was ich tun soll?",
    "What if I do not know my birth time?": "Was ist, wenn ich meine Geburtszeit nicht kenne?",
    "Is this a forecast?": "Ist das eine Zukunftsprognose?",
    "Why is the birth time useful?": "Warum ist die Geburtszeit hilfreich?",
    "Is this the full Codex?": "Ist das der vollständige Codex?",
    "Can I bring more than one question?": "Kann ich mehr als eine Frage mitbringen?",
    "When can I book?": "Wann kann ich buchen?",
    "THE CODEX · DEEPER WORK": "THE CODEX · VERTIEFENDE ARBEIT",
    "MORE ROOM FOR THE QUESTION.": "MEHR RAUM FÜR DIE FRAGE.",
    "View formats": "Formate ansehen",
    "Return to introductory readings ↗": "Zu den Einstiegslesungen ↗",
    "FORMATS & SCOPE": "FORMATE & UMFANG",
    "Five clear ways to begin.": "Fünf klare Einstiege.",
    "HOW THE WORK BEGINS": "SO BEGINNT DIE ARBEIT",
    "A clear next step, with the right amount of depth.": "Ein klarer nächster Schritt – mit der passenden Tiefe.",
    "THE CODEX · 2027": "THE CODEX · 2027",
    "ENTER THE YEAR": "MIT EINEM KLAREREN RAHMEN",
    "WITH A CLEARER FRAME.": "INS JAHR GEHEN.",
    "Compare both options ↓": "Beide Optionen vergleichen ↓",
    "CODEX 2027 · ENTRY OFFER": "CODEX 2027 · EINSTIEGSANGEBOT",
    "A personal compass. One clear year.": "Ein persönlicher Kompass. Ein klares Jahr.",
    "EXAMPLE · A MONTHLY RETURN POINT": "BEISPIEL · EIN MONATLICHER RÜCKKEHRPUNKT",
    "CODEX 2027 · PRIVATE DEEP DIVE": "CODEX 2027 · PRIVATER DEEP DIVE",
    "A private year of guidance.": "Ein privates Jahr mit Begleitung.",
    "CHOOSE YOUR 2027 ENTRY": "DEIN 2027-EINSTIEG"
  };

  const replaceText = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const original = node.nodeValue;
      const key = original.trim();
      if (!de[key]) return;
      const prefix = original.match(/^\s*/)[0];
      const suffix = original.match(/\s*$/)[0];
      node.nodeValue = prefix + de[key] + suffix;
    });
  };

  if (german) {
    document.documentElement.lang = "de";
    const titles = {
      "/codex/current-sky/": "Current Sky | The Codex",
      "/codex/personal-pattern/": "Personal Pattern | The Codex",
      "/codex/astrological-foundations/": "Astrologische Grundlagen | The Codex",
      "/codex/private-introduction/": "Private Codex-Einführung | The Codex",
      "/codex/angebote/": "Vertiefende Codex-Arbeit | Mihira Ceremonia",
      "/codex/2027/": "Codex 2027 | Mihira Ceremonia"
    };
    if (titles[url.pathname]) document.title = titles[url.pathname];
    replaceText();
  }

  const navigation = document.querySelector(".cr-nav");
  if (!navigation || navigation.querySelector("[data-codex-language-link]")) return;
  const link = document.createElement("a");
  link.dataset.codexLanguageLink = "true";
  link.href = german ? englishUrl.href : germanUrl.href;
  link.lang = german ? "en" : "de";
  link.textContent = german ? "Read in English" : "Deutsch lesen";
  link.setAttribute("aria-label", german ? "Read this page in English" : "Diese Seite auf Deutsch lesen");
  navigation.append(link);
})();
