(() => {
  const url = new URL(window.location.href);
  const german = url.searchParams.get("lang") !== "en";
  const englishUrl = new URL(window.location.href);
  englishUrl.searchParams.set("lang", "en");
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
    ,"PAYMENT RECEIVED": "ZAHLUNG EINGEGANGEN"
    ,"YOUR PRIVATE LINK": "DEIN PRIVATER LINK"
    ,"IS ON ITS WAY.": "IST UNTERWEGS."
    ,"Please check your inbox for the personal intake link. The link contains the only place to enter your birth details—please do not send them by email.": "Bitte prüfe dein E-Mail-Postfach auf deinen persönlichen Intake-Link. Nur dort gibst du deine Geburtsdaten an – bitte sende sie nicht per E-Mail."
    ,"If it is not there shortly, check spam or contact": "Falls er nicht in Kürze erscheint, prüfe bitte auch den Spam-Ordner oder kontaktiere"
    ,"from the email address used for payment.": "über die E-Mail-Adresse, die du für die Zahlung verwendet hast."
    ,"Return to The Codex": "Zurück zum Codex"
  };

  const en = Object.fromEntries(Object.entries(de).map(([english, germanText]) => [germanText, english]));
  Object.assign(en, {
    "HUMAN ARCHITECTURE · DER CODEX": "HUMAN ARCHITECTURE · THE CODEX",
    "Codex-Übersicht": "Codex overview",
    "Vertiefende Formate": "Deeper formats",
    "← Zur Codex-Übersicht": "← Back to The Codex",
    "KURZE PERSÖNLICHE AUSARBEITUNG · €29": "SHORT PERSONAL REFLECTION · €29",
    "FOKUS-AUSARBEITUNG · €49": "FOCUSED PERSONAL REFLECTION · €49",
    "SIGNATURE-EINSTIEG · €59": "SIGNATURE INTRODUCTION · €59",
    "Sicher buchen · €29": "Book securely · €29",
    "Sicher buchen · €49": "Book securely · €49",
    "Sicher buchen · €59": "Book securely · €59",
    "Nach der Zahlung erhältst du deinen privaten Intake-Link. Bitte sende Geburtsdaten nicht per E-Mail.": "After payment, you will receive your private intake link. Please do not send birth information by email.",
    "Beispielseiten ansehen (DE/EN PDF) ↗": "View sample pages (DE/EN PDF) ↗",
    "Benötigt werden": "What is needed",
    "Preis": "Price",
    "Format": "Format",
    "Enthalten": "Includes",
    "Lieferzeit": "Delivery",
    "Nicht enthalten": "Does not include",
    "DER HIMMEL IST KOLLEKTIV.": "THE SKY IS COLLECTIVE.",
    "DEINE FRAGE IST PERSÖNLICH.": "YOUR QUESTION IS PERSONAL.",
    "Was rückt gerade in den Vordergrund, wenn wir diesen Moment über dein Geburtshoroskop betrachten?": "What comes into focus when we consider this moment through your birth chart?",
    "Current Sky ist eine fokussierte schriftliche Einordnung zu ein oder zwei Themen, die gerade präsent sind. Aktuelle Transite werden mit ausgewählten Punkten deines Geburtshoroskops in Beziehung gesetzt.": "Current Sky is a focused written perspective on one or two themes that are present now. Current transits are considered alongside selected points in your birth chart.",
    "Du erhältst keine Vorhersage und keine fertige Antwort. Sondern eine persönliche Perspektive, mit der du deine eigene Erfahrung klarer einordnen kannst.": "You receive neither a prediction nor a final answer, but a personal perspective through which you can place your own experience more clearly.",
    "Geburtsdatum, Geburtsort und – wenn bekannt – Geburtszeit. Wenn deine Geburtszeit nicht bekannt ist, sagst du das einfach an; es wird nichts angenommen.": "Your date and place of birth, and your birth time where known. If your birth time is unknown, simply say so—nothing will be assumed.",
    "Persönliches PDF · 1–2 Seiten": "Personal PDF · 1–2 pages",
    "Ein oder zwei symbolische Themen, relevante Chart-Punkte und persönliche Reflexion": "One or two symbolic themes, relevant chart points and personal reflection",
    "Innerhalb von fünf Werktagen": "Within five working days",
    "Medizinische, psychologische, rechtliche, finanzielle oder deterministische Beratung": "Medical, psychological, legal, financial or deterministic advice",
    "Du kannst die Ausarbeitung trotzdem anfragen. Wir benennen transparent, was ohne Geburtszeit zuverlässig einbezogen werden kann und was nicht.": "You can still request the reading. We will state transparently what can and cannot be responsibly included without a birth time.",
    "Nein. Es ist eine symbolische Einordnung aktueller Themen in Bezug auf dein Geburtshoroskop, keine Vorhersage von Ereignissen oder Ergebnissen.": "No. It is a symbolic perspective on current themes in relation to your birth chart, not a prediction of events or outcomes.",
    "WARUM FÜHLT SICH DAS": "WHY DOES THIS FEEL",
    "SO VERTRAUT AN?": "SO FAMILIAR?",
    "Eine symbolische Ausarbeitung zu einem Thema, das wiederholt deine Aufmerksamkeit sucht.": "A symbolic exploration of one theme that repeatedly asks for your attention.",
    "Du wählst einen Fokus: Liebe & Beziehungen, Identität & Ausdruck oder Richtung & Verantwortung. Die Ausarbeitung verbindet relevante Platzierungen, ausgewählte Aspekte und Häuserthemen zu einer sorgfältigen persönlichen Perspektive.": "You choose one focus: love and relationships, identity and expression, or direction and responsibility. The reading connects relevant placements, selected aspects and house themes into a considered personal perspective.",
    "Sie soll dich nicht erklären oder festlegen. Sie gibt einer wiederkehrenden Frage einen klareren Rahmen.": "It is not intended to explain or define you. It gives a recurring question a clearer frame.",
    "Geburtsdatum, Geburtsort und – wenn bekannt – Geburtszeit sowie das eine Thema, das du betrachten möchtest.": "Your date and place of birth, your birth time where known, and the one theme you want to explore.",
    "Persönliches PDF · 3–4 Seiten": "Personal PDF · 3–4 pages",
    "Relevante Platzierungen, ausgewählte Aspekte und Häuserthemen, Synthese und drei Reflexionsfragen": "Relevant placements, selected aspects and house themes, a synthesis and three reflection questions",
    "Innerhalb von sieben Werktagen": "Within seven working days",
    "Diagnose, Vorhersage oder eine vollständige Codex-Ausarbeitung": "Diagnosis, prediction or a complete Codex exploration",
    "Dieses Format ist bewusst für einen Fokus angelegt. Wenn mehrere Fragen zusammenhängen, kann ein vertiefendes Codex-Format passender sein.": "This format is intentionally designed for one focus. If several questions are connected, a deeper Codex format may fit better.",
    "Nein. Du erhältst eine interpretierende Perspektive und Reflexionsfragen. Deine Erfahrung und deine Entscheidungen bleiben bei dir.": "No. You receive an interpretive perspective and reflection questions. Your experience and decisions remain yours.",
    "DEIN HOROSKOP IST MEHR": "YOUR CHART IS MORE",
    "ALS DEIN SONNENZEICHEN.": "THAN YOUR SUN SIGN.",
    "Erfahre, wie ausgewählte Platzierungen, Häuser und Aspekte ein zusammenhängenderes Bild ergeben.": "Explore how selected placements, houses and aspects form a more connected picture.",
    "Astrologische Grundlagen ist eine persönliche schriftliche Einführung in dein Geburtshoroskop. Sie betrachtet Sonne, Mond und Aszendent – sofern die Geburtszeit es zulässt –, ausgewählte Platzierungen und Aspekte, ein zentrales Chart-Thema sowie relevante aktuelle Transite.": "Astrological Foundations is a personal written introduction to your birth chart. It considers the Sun, Moon and Ascendant where birth time permits, selected placements and aspects, one central chart theme and relevant current transits.",
    "Es ist eine astrologische Einstiegsausarbeitung, kein vollständiger Human-Architecture-Codex.": "It is an introductory astrological reading, not a complete Human Architecture Codex.",
    "Geburtsdatum, Geburtsort und möglichst die genaue Geburtszeit. Wenn die Zeit unbekannt ist, arbeiten wir nur mit dem, was verantwortungsvoll einbezogen werden kann.": "Your date and place of birth, plus the exact birth time where possible. If it is unknown, we work only with what can be responsibly included.",
    "Persönliches PDF · 4–6 Seiten": "Personal PDF · 4–6 pages",
    "Ausgewählte Horoskop-Grundlagen, ein zentrales Thema, aktuelle Transite und drei Reflexionsfragen": "Selected chart foundations, one central theme, current transits and three reflection questions",
    "Vollständiger Codex, Diagnose, deterministische Vorhersage oder professionelle Beratung": "A complete Codex, diagnosis, deterministic prediction or professional advice",
    "Sie kann Achsen und Häuser beeinflussen. Ohne Geburtszeit werden diese Elemente nicht als sicher dargestellt.": "It can affect the angles and houses. Without a birth time, these elements are not presented as certain.",
    "Nein. Dies ist die umfangreichste Einstiegsausarbeitung. Vertiefende Codex-Formate bleiben separat verfügbar.": "No. This is the most substantial introductory reading. Deeper Codex formats remain available separately."
  });

  const replaceText = (dictionary) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const original = node.nodeValue;
      const key = original.trim();
      if (!dictionary[key]) return;
      const prefix = original.match(/^\s*/)[0];
      const suffix = original.match(/\s*$/)[0];
      node.nodeValue = prefix + dictionary[key] + suffix;
    });
  };

  if (german) {
    document.documentElement.lang = "de";
    const titles = {
      "/codex/": "Der Codex: klare persönliche Orientierung | Human Architecture",
      "/codex/current-sky/": "Current Sky | Der Codex",
      "/codex/personal-pattern/": "Personal Pattern | Der Codex",
      "/codex/astrological-foundations/": "Astrologische Grundlagen | Der Codex",
      "/codex/private-introduction/": "Private Codex-Einführung | The Codex",
      "/codex/angebote/": "Vertiefende Codex-Arbeit | Mihira Ceremonia",
      "/codex/blind-spot/": "Blind Spot Codex | Human Architecture",
      "/codex/overview/": "Codex-Überblick | Human Architecture",
      "/codex/2027/": "Codex 2027 | Mihira Ceremonia"
    };
    if (titles[url.pathname]) document.title = titles[url.pathname];
    replaceText(de);
  } else {
    document.documentElement.lang = "en";
    const englishTitles = {
      "/codex/": "The Codex: clear personal orientation | Human Architecture",
      "/codex/current-sky/": "Current Sky | The Codex",
      "/codex/personal-pattern/": "Personal Pattern | The Codex",
      "/codex/astrological-foundations/": "Astrological Foundations | The Codex",
      "/codex/angebote/": "Deeper Codex formats | Human Architecture",
      "/codex/blind-spot/": "Blind Spot Codex | Human Architecture",
      "/codex/overview/": "Complete Codex overview | Human Architecture"
    };
    if (englishTitles[url.pathname]) document.title = englishTitles[url.pathname];
    replaceText(en);
  }

  // Keep the browser and shared-page description aligned with the selected
  // language on the Codex overview. The visual copy is already bilingual;
  // this completes the same clarity in the browser chrome and link previews.
  if (url.pathname === "/codex/") {
    const metadata = german
      ? {
          description: "Der Codex verbindet deine konkrete Frage mit ausgewählten astrologischen Grundlagen. Wähle den passenden Umfang, sieh Preis und Ablauf und starte vertraulich.",
          title: "Der Codex: klare persönliche Orientierung | Human Architecture"
        }
      : {
          description: "The Codex connects your concrete question with selected astrological foundations. Choose the depth that fits, see price and process, and begin privately.",
          title: "The Codex: clear personal orientation | Human Architecture"
        };
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", metadata.description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", metadata.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", metadata.description);
  }

  // Newer Codex pages carry their complete German and English copy directly.
  // Apply these explicit strings after the legacy dictionary so both languages
  // remain clear even when a phrase has not been added to the shared glossary.
  document.querySelectorAll('[data-de][data-en]').forEach((element) => {
    const copy = german ? element.dataset.de : element.dataset.en;
    if (copy) element.textContent = copy;
  });

  document.querySelectorAll('a[data-href-de][data-href-en]').forEach((anchor) => {
    anchor.href = german ? anchor.dataset.hrefDe : anchor.dataset.hrefEn;
  });

  document.querySelectorAll('a[href^="/codex/"]').forEach((anchor) => {
    const linkUrl = new URL(anchor.getAttribute('href'), window.location.origin);
    linkUrl.searchParams.set('lang', german ? 'de' : 'en');
    anchor.setAttribute('href', `${linkUrl.pathname}${linkUrl.search}${linkUrl.hash}`);
  });

  const orientationHref = `/orientierung/?lang=${german ? 'de' : 'en'}`;
  document.querySelectorAll('.cr-nav').forEach((navigation) => {
    if (navigation.querySelector('[data-codex-orientation-link], a[href*="/orientierung/"]')) return;
    const orientationLink = document.createElement('a');
    orientationLink.dataset.codexOrientationLink = 'true';
    orientationLink.href = orientationHref;
    orientationLink.textContent = german ? 'Orientierungfragebogen' : 'Orientation questionnaire';
    orientationLink.setAttribute('aria-label', german ? 'Orientierungfragebogen öffnen' : 'Open the orientation questionnaire');
    const firstLink = navigation.querySelector('a');
    if (firstLink) firstLink.after(orientationLink);
    else navigation.prepend(orientationLink);
  });

  // All Codex purchases pass through the same secure booking and private-intake flow.
  // This prevents the annual offer from bypassing the privacy-protected next step.
  document.querySelectorAll('a[href="https://www.paypal.com/ncp/payment/UQ43GXAP6FQTU"]').forEach((anchor) => {
    anchor.href = `/codex/book/?offer=codex_2027_entry&lang=${german ? 'de' : 'en'}`;
  });

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
