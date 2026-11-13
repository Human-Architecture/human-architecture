(() => {
  const german = new URL(window.location.href).searchParams.get("lang") !== "en";
  const examples = {
    "Current Sky": {
      de: "Beispiel: Ich stehe an einem Entscheidungspunkt und möchte das, was jetzt präsent ist, in einem persönlichen Reflexionsrahmen betrachten.",
      en: "Example: I am at a decision point and want a personal reflective frame for what feels present now."
    },
    "Personal Pattern": {
      de: "Beispiel: Eine ähnliche Dynamik kehrt in Beziehungen oder im Ausdruck immer wieder zurück und ich möchte sie klarer einordnen.",
      en: "Example: A similar dynamic keeps returning in relationships or expression and I want to place it more clearly."
    },
    "Astrologische Grundlagen": {
      de: "Beispiel: Ich möchte mein Geburtshoroskop erstmals als zusammenhängendes Bild betrachten – über das Sonnenzeichen hinaus.",
      en: "Example: I want to explore my natal chart as a connected picture for the first time—beyond my Sun sign."
    },
    "Codex 2027": {
      de: "Beispiel: Ich möchte mit einem persönlichen Jahresrahmen und regelmäßigen Rückkehrpunkten ins kommende Jahr gehen.",
      en: "Example: I want to enter the coming year with a personal frame and regular return points."
    },
    "Body Fahrplan": {
      de: "Beispiel: Meine Routinen brechen immer wieder weg und ich möchte einen alltagstauglicheren Rahmen entwickeln.",
      en: "Example: My routines repeatedly fall away and I want to develop a more workable everyday frame."
    },
    "Cycle Awareness": {
      de: "Beispiel: Ich möchte meinen Zyklus aufmerksamer beobachten und einen persönlicheren Rhythmus im Alltag finden.",
      en: "Example: I want to observe my cycle more attentively and find a more personal rhythm in everyday life."
    },
    "Foundation Codex": {
      de: "Beispiel: Eine konkrete Frage braucht mehr Raum als eine kurze Lesung, aber noch kein Live-Gespräch.",
      en: "Example: One concrete question needs more room than a short reading, but not yet a live conversation."
    },
    "Personal Codex": {
      de: "Beispiel: Mehrere Fragen hängen zusammen und ich möchte die schriftliche Ausarbeitung anschließend in einem Gespräch einordnen.",
      en: "Example: Several questions are connected and I want to place the written work in a focused conversation afterwards."
    },
    "Transition & Context Codex": {
      de: "Beispiel: Eine neue Rolle oder Veränderung braucht einen klareren Blick auf Kontext, Verantwortung und nächsten Schritt.",
      en: "Example: A new role or transition needs a clearer view of context, responsibility and the next step."
    },
    "Blind Spot Codex": {
      de: "Beispiel: Ein Spannungsfeld ist spürbar und wiederholt sich, lässt sich allein aber noch nicht klar einordnen.",
      en: "Example: A recurring point of friction is noticeable, but cannot yet be placed clearly on your own."
    },
    "Relationship Codex": {
      de: "Beispiel: Wir möchten eine wiederkehrende Frage in unserer Kommunikation oder in einem gemeinsamen Übergang ruhiger betrachten.",
      en: "Example: We want to consider a recurring question in our communication or a shared transition more calmly."
    },
    "Family Codex": {
      de: "Beispiel: In unserer Familie verändert sich etwas und wir möchten Rollen und Alltag klarer verstehen, ohne jemanden zum Problem zu machen.",
      en: "Example: Something is changing in our family and we want clearer understanding of roles and everyday life without making anyone the problem."
    },
    "Business Partnership Codex": {
      de: "Beispiel: Als Mitgründer:innen möchten wir Verantwortung und Entscheidungsräume klarer miteinander strukturieren.",
      en: "Example: As co-founders, we want to structure responsibility and decision space more clearly together."
    },
    "Executive Personal Codex": {
      de: "Beispiel: In einer verantwortungsvollen Rolle möchte ich Entscheidungsdruck und Ausdruck betrachten, bevor ich zu schnell handle.",
      en: "Example: In a role of responsibility, I want to consider decision pressure and expression before acting too quickly."
    },
    "Executive Context Codex": {
      de: "Beispiel: Eine berufliche Schwelle betrifft mehrere Menschen und braucht einen weiteren, vertraulichen Kontext.",
      en: "Example: A professional threshold involves several people and needs a wider, confidential context."
    }
  };

  document.querySelectorAll(".cr-card h3, .ha-card h3").forEach((heading) => {
    const key = (heading.dataset.de || heading.textContent).trim().replace(/\s*·.*$/, "");
    const example = examples[key];
    const card = heading.closest(".cr-card, .ha-card");
    if (!example || !card || card.querySelector("[data-codex-example]")) return;
    const paragraph = document.createElement("p");
    paragraph.className = "cr-example";
    paragraph.dataset.codexExample = "true";
    paragraph.textContent = german ? example.de : example.en;
    const actionContainer = card.querySelector(":scope > .cr-card-actions");
    const directLink = Array.from(card.children).find((element) => element.tagName === "A");
    if (actionContainer) card.insertBefore(paragraph, actionContainer);
    else if (directLink) card.insertBefore(paragraph, directLink);
    else card.append(paragraph);
  });
})();
