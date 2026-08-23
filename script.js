/* =========================================================
   HUMAN ARCHITECTURE
   MASTER WEBSITE INTERACTIONS
   Reconciled with final index.html + styles.css
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     01 — GLOBAL SETTINGS
  ======================================================= */

  const body = document.body;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;



  /* =======================================================
     02 — HEADER SCROLL STATE
  ======================================================= */

  const header =
    document.querySelector("[data-header]");


  function updateHeader() {
    if (!header) return;

    header.classList.toggle(
      "is-scrolled",
      window.scrollY > 24
    );
  }


  updateHeader();


  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );



  /* =======================================================
     03 — MOBILE NAVIGATION
  ======================================================= */

  const menuButton =
    document.querySelector("[data-menu-button]");

  const mobileMenu =
    document.querySelector("[data-mobile-menu]");

  let lastFocusedElement = null;


  function openMenu() {
    if (!menuButton || !mobileMenu) return;

    lastFocusedElement =
      document.activeElement;

    menuButton.setAttribute(
      "aria-expanded",
      "true"
    );

    menuButton.setAttribute(
      "aria-label",
      "Close navigation"
    );

    mobileMenu.setAttribute(
      "aria-hidden",
      "false"
    );

    mobileMenu.classList.add(
      "is-open"
    );

    body.classList.add(
      "menu-open"
    );


    const firstLink =
      mobileMenu.querySelector("a");


    if (firstLink) {
      window.setTimeout(
        () => firstLink.focus(),
        60
      );
    }
  }


  function closeMenu({
    restoreFocus = false
  } = {}) {

    if (!menuButton || !mobileMenu) return;


    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.setAttribute(
      "aria-label",
      "Open navigation"
    );

    mobileMenu.setAttribute(
      "aria-hidden",
      "true"
    );

    mobileMenu.classList.remove(
      "is-open"
    );

    body.classList.remove(
      "menu-open"
    );


    if (
      restoreFocus &&
      lastFocusedElement &&
      typeof lastFocusedElement.focus === "function"
    ) {
      lastFocusedElement.focus();
    }
  }


  if (menuButton && mobileMenu) {

    menuButton.addEventListener(
      "click",
      () => {

        const isOpen =
          menuButton.getAttribute(
            "aria-expanded"
          ) === "true";


        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }

      }
    );


    mobileMenu
      .querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener(
          "click",
          () => closeMenu()
        );

      });


    document.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Escape" &&
          menuButton.getAttribute(
            "aria-expanded"
          ) === "true"
        ) {

          closeMenu({
            restoreFocus: true
          });

        }

      }
    );


    window.addEventListener(
      "resize",
      () => {

        if (window.innerWidth > 1180) {
          closeMenu();
        }

      }
    );

  }



  /* =======================================================
     04 — SMOOTH INTERNAL NAVIGATION
  ======================================================= */

  const internalLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );


  internalLinks.forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const targetId =
          link.getAttribute("href");


        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(
            targetId
          );


        if (!target) return;


        event.preventDefault();


        const headerHeight =
          header
            ? header.getBoundingClientRect().height
            : 0;


        const targetTop =
          target
            .getBoundingClientRect()
            .top +
          window.scrollY -
          headerHeight -
          16;


        window.scrollTo({
          top: Math.max(
            0,
            targetTop
          ),

          behavior:
            reducedMotion
              ? "auto"
              : "smooth"
        });

      }
    );

  });



  /* =======================================================
     05 — REVEAL ON SCROLL
  ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );


  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {

    revealElements.forEach(
      (element) => {
        element.classList.add(
          "is-visible"
        );
      }
    );

  } else {

    const revealObserver =
      new IntersectionObserver(

        (entries, observer) => {

          entries.forEach(
            (entry) => {

              if (!entry.isIntersecting) {
                return;
              }


              entry.target.classList.add(
                "is-visible"
              );


              observer.unobserve(
                entry.target
              );

            }
          );

        },

        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -30px 0px"
        }

      );


    revealElements.forEach(
      (element) => {
        revealObserver.observe(
          element
        );
      }
    );

  }



  /* =======================================================
     06 — PHILOSOPHY LINE
  ======================================================= */

  const philosophyLine =
    document.querySelector(
      ".philosophy-line"
    );


  if (philosophyLine) {

    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {

      philosophyLine.classList.add(
        "is-visible"
      );

    } else {

      const lineObserver =
        new IntersectionObserver(

          (entries, observer) => {

            entries.forEach(
              (entry) => {

                if (!entry.isIntersecting) {
                  return;
                }


                entry.target.classList.add(
                  "is-visible"
                );


                observer.unobserve(
                  entry.target
                );

              }
            );

          },

          {
            threshold: 0.22
          }

        );


      lineObserver.observe(
        philosophyLine
      );

    }

  }



  /* =======================================================
     07 — ACTIVE NAVIGATION STATE
  ======================================================= */

  const desktopNavLinks =
    document.querySelectorAll(
      ".desktop-nav a[href^='#']"
    );


  const trackedSections =
    [
      "philosophy",
      "human-system",
      "entry-point",
      "domains",
      "offerings",
      "partnerships",
      "about",
      "contact"
    ]
      .map(
        (id) =>
          document.getElementById(id)
      )
      .filter(Boolean);


  if (
    trackedSections.length &&
    "IntersectionObserver" in window
  ) {

    const sectionObserver =
      new IntersectionObserver(

        (entries) => {

          const visibleEntries =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              );


          if (!visibleEntries.length) {
            return;
          }


          const activeId =
            visibleEntries[0]
              .target
              .id;


          desktopNavLinks.forEach(
            (link) => {

              const isActive =
                link.getAttribute(
                  "href"
                ) ===
                `#${activeId}`;


              link.classList.toggle(
                "is-active",
                isActive
              );


              if (isActive) {

                link.setAttribute(
                  "aria-current",
                  "location"
                );

              } else {

                link.removeAttribute(
                  "aria-current"
                );

              }

            }
          );

        },

        {
          rootMargin:
            "-28% 0px -55% 0px",

          threshold:
            [
              0,
              0.1,
              0.25,
              0.5
            ]
        }

      );


    trackedSections.forEach(
      (section) => {
        sectionObserver.observe(
          section
        );
      }
    );

  }



  /* =======================================================
     08 — HUMAN SYSTEM
  ======================================================= */

  const systemNodes =
    document.querySelectorAll(
      "[data-system-node]"
    );


  const systemResponse =
    document.querySelector(
      "[data-system-response]"
    );



  function updateSystemResponse(
    key,
    selectedNode
  ) {

    const systemContent = {
  body: {
    en: {
      label: "Body",
      title: "The structural layer.",
      text:
        "This is the physical dimension of the system — structure, movement, mobility and the way the body organizes itself in space."
    },
    de: {
      label: "Körper",
      title: "Die strukturelle Ebene.",
      text:
        "Dies ist die körperliche Dimension des Systems — Struktur, Bewegung, Mobilität und die Art, wie sich der Körper im Raum organisiert."
    }
  },

  "nervous-system": {
    en: {
      label: "Nervous System",
      title: "The regulatory layer.",
      text:
        "This is the dimension of activation, rest, adaptation and available capacity — how the system meets demand and returns toward regulation."
    },
    de: {
      label: "Nervensystem",
      title: "Die regulative Ebene.",
      text:
        "Dies ist die Ebene von Aktivierung, Ruhe, Anpassung und verfügbarer Kapazität — wie das System auf Anforderungen reagiert und wieder in Richtung Regulation findet."
    }
  },

  emotion: {
    en: {
      label: "Emotion",
      title: "The felt layer.",
      text:
        "Emotion belongs within the wider human system. It is experienced in relationship with the body, nervous system, environment and lived context."
    },
    de: {
      label: "Emotion",
      title: "Die fühlende Ebene.",
      text:
        "Emotion gehört in den größeren menschlichen Zusammenhang. Sie wird in Beziehung zum Körper, Nervensystem, Umfeld und gelebten Kontext erfahren."
    }
  },

  cognition: {
    en: {
      label: "Cognition",
      title: "The interpretive layer.",
      text:
        "This is where information is perceived, organized and brought into conscious understanding — including how patterns and experience are made intelligible."
    },
    de: {
      label: "Kognition",
      title: "Die interpretierende Ebene.",
      text:
        "Hier werden Informationen wahrgenommen, geordnet und in bewusstes Verstehen überführt — einschließlich der Art, wie Muster und Erfahrungen verständlich werden."
    }
  },

  identity: {
    en: {
      label: "Identity",
      title: "The orientation layer.",
      text:
        "Identity concerns the relationship between self-understanding, inherent structure, adaptation and direction across lived experience."
    },
    de: {
      label: "Identität",
      title: "Die Ebene der Orientierung.",
      text:
        "Identität betrifft die Beziehung zwischen Selbstverständnis, innewohnender Struktur, Anpassung und Ausrichtung innerhalb der gelebten Erfahrung."
    }
  },

  relationship: {
    en: {
      label: "Relationship",
      title: "The relational layer.",
      text:
        "Human structure does not exist in isolation. Relationship is where individual structure meets other people, shared environments and collective dynamics."
    },
    de: {
      label: "Beziehung",
      title: "Die relationale Ebene.",
      text:
        "Menschliche Struktur existiert nicht isoliert. Beziehung ist der Raum, in dem individuelle Struktur auf andere Menschen, gemeinsame Umfelder und kollektive Dynamiken trifft."
    }
  },

  environment: {
    en: {
      label: "Environment",
      title: "The contextual layer.",
      text:
        "Environment is the surrounding context in which the system lives and participates. Different conditions can change how available capacity is experienced and expressed."
    },
    de: {
      label: "Umfeld",
      title: "Die kontextuelle Ebene.",
      text:
        "Das Umfeld ist der umgebende Kontext, in dem das System lebt und teilnimmt. Unterschiedliche Bedingungen können verändern, wie verfügbare Kapazität erlebt und ausgedrückt wird."
    }
  },

  meaning: {
    en: {
      label: "Meaning",
      title: "The integration layer.",
      text:
        "This is where experience, identity and significant passages are held within a wider human context — particularly during periods of transition."
    },
    de: {
      label: "Bedeutung",
      title: "Die integrative Ebene.",
      text:
        "Hier werden Erfahrung, Identität und bedeutsame Übergänge in einen größeren menschlichen Zusammenhang eingebettet — besonders in Zeiten des Wandels."
    }
  }
};

     const language =
  document.documentElement.lang === "de"
    ? "de"
    : "en";

const contentGroup =
  systemContent[key];

const content =
  contentGroup
    ? contentGroup[language] || contentGroup.en
    : null;

    if (
      !content ||
      !systemResponse
    ) {
      return;
    }


    systemNodes.forEach(
      (node) => {

        const nodeKey =
          node.dataset.systemNode;


        const isSelected =
          nodeKey === key;


        node.classList.toggle(
          "is-active",
          isSelected
        );


        node.setAttribute(
          "aria-pressed",
          String(isSelected)
        );

      }
    );


    const eyebrow =
      systemResponse.querySelector(
        ".system-response__eyebrow"
      );

    const title =
      systemResponse.querySelector(
        ".system-response__title"
      );

    const copy =
      systemResponse.querySelector(
        ".system-response__copy"
      );


    if (eyebrow) {
      eyebrow.textContent =
        content.label;
    }


    if (title) {
      title.textContent =
        content.title;
    }


    if (copy) {
      copy.textContent =
        content.text;
    }


    if (
      !reducedMotion &&
      systemResponse.animate
    ) {

      systemResponse.animate(

        [
          {
            opacity: 0.42,
            transform:
              "translateY(7px)"
          },

          {
            opacity: 1,
            transform:
              "translateY(0)"
          }
        ],

        {
          duration: 420,
          easing:
            "cubic-bezier(.22,1,.36,1)"
        }

      );

    }


    if (
      selectedNode &&
      window.innerWidth <= 760
    ) {

      const responseTop =
        systemResponse
          .getBoundingClientRect()
          .top +
        window.scrollY -
        96;


      window.scrollTo({
        top: responseTop,

        behavior:
          reducedMotion
            ? "auto"
            : "smooth"
      });

    }

  }


  systemNodes.forEach(
    (node) => {

      node.setAttribute(
        "aria-pressed",
        "false"
      );


      node.addEventListener(
        "click",
        () => {

          updateSystemResponse(
            node.dataset.systemNode,
            node
          );

        }
      );

    }
  );



  /* =======================================================
     09 — ENTRY POINT: DOMAIN LEVEL
  ======================================================= */

  const entryDomains =
    document.querySelectorAll(
      "[data-entry-domain]"
    );


  const entryDetails =
    document.querySelectorAll(
      "[data-entry-detail]"
    );


  const entryChoices =
    document.querySelectorAll(
      "[data-entry-choice]"
    );


  const entryResult =
    document.querySelector(
      "[data-entry-result]"
    );


  function closeEntryDetails() {

    entryDetails.forEach(
      (detail) => {
        detail.hidden = true;
      }
    );


    entryDomains.forEach(
      (button) => {

        button.classList.remove(
          "is-active"
        );


        button.setAttribute(
          "aria-pressed",
          "false"
        );

      }
    );

  }


  entryDomains.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const key =
            button.dataset.entryDomain;


          const detail =
            document.querySelector(
              `[data-entry-detail="${key}"]`
            );


          const alreadySelected =
            button.getAttribute(
              "aria-pressed"
            ) === "true";


          closeEntryDetails();


          if (
            alreadySelected ||
            !detail
          ) {
            return;
          }


          button.classList.add(
            "is-active"
          );


          button.setAttribute(
            "aria-pressed",
            "true"
          );


          detail.hidden = false;


          if (
            !reducedMotion &&
            detail.animate
          ) {

            detail.animate(

              [
                {
                  opacity: 0,
                  transform:
                    "translateY(10px)"
                },

                {
                  opacity: 1,
                  transform:
                    "translateY(0)"
                }
              ],

              {
                duration: 480,
                easing:
                  "cubic-bezier(.22,1,.36,1)"
              }

            );

          }

        }
      );

    }
  );



  /* =======================================================
     10 — ENTRY POINT: SPECIFIC ORIENTATION
  ======================================================= */

  const entryChoiceContent = {

  "self-understanding": {
    context: "codex",

    en: {
      classification: "Blueprint / Codex",
      title: "Codex",
      copy:
        "A logical first point of entry when the central question is understanding your own inherent structure more clearly."
    },

    de: {
      classification: "Blueprint / Codex",
      title: "Codex",
      copy:
        "Ein logischer erster Einstiegspunkt, wenn die zentrale Frage darin besteht, die eigene grundlegende Struktur klarer zu verstehen."
    }
  },


  patterns: {
    context: "codex",

    en: {
      classification: "Blueprint / Codex",
      title: "Codex",
      copy:
        "When recurring patterns raise questions about how your system is designed, Blueprint work provides a clearer frame for orientation."
    },

    de: {
      classification: "Blueprint / Codex",
      title: "Codex",
      copy:
        "Wenn wiederkehrende Muster Fragen darüber aufwerfen, wie dein System angelegt ist, bietet die Blueprint-Arbeit einen klareren Rahmen zur Orientierung."
    }
  },


  structural: {
    context: "structural",

    en: {
      classification: "Body & Regulation",
      title: "Structural Consultation",
      copy:
        "A logical entry point when the primary question concerns physical structure, mobility, biomechanical tension or movement limitation."
    },

    de: {
      classification: "Körper & Regulation",
      title: "Structural Consultation",
      copy:
        "Ein logischer Einstiegspunkt, wenn es in erster Linie um körperliche Struktur, Beweglichkeit, biomechanische Spannung oder Bewegungseinschränkungen geht."
    }
  },


  regulation: {
    context: "regulation",

    en: {
      classification: "Body & Regulation",
      title: "Regulation",
      copy:
        "A regulation-oriented entry point when sustained overwhelm, fatigue or nervous-system strain is the dominant context."
    },

    de: {
      classification: "Körper & Regulation",
      title: "Regulation",
      copy:
        "Ein regulationsorientierter Einstiegspunkt, wenn anhaltende Überforderung, Erschöpfung oder Belastung des Nervensystems im Vordergrund stehen."
    }
  },


  "chi-nei-tsang": {
    context: "chi-nei-tsang",

    en: {
      classification: "Body & Regulation",
      title: "Chi Nei Tsang",
      copy:
        "A body-based entry point when there is notable internal holding around the abdominal core, breath or digestive centre."
    },

    de: {
      classification: "Körper & Regulation",
      title: "Chi Nei Tsang",
      copy:
        "Ein körperorientierter Einstiegspunkt, wenn deutliches inneres Halten im Bauchraum, im Atem oder im Verdauungszentrum spürbar ist."
    }
  },


  calamus: {
    context: "other",

    en: {
      classification: "Body & Regulation",
      title: "Calamus Ceremony",
      copy:
        "A possible entry point when the dominant experience is dullness, stagnation or disconnection from vitality."
    },

    de: {
      classification: "Körper & Regulation",
      title: "Calamus Ceremony",
      copy:
        "Ein möglicher Einstiegspunkt, wenn vor allem Dumpfheit, Stagnation oder eine Distanz zur eigenen Lebendigkeit erlebt wird."
    }
  },


  intensive: {
    context: "intensive",

    en: {
      classification: "Full-System Immersion",
      title: "Human Architecture Intensive",
      copy:
        "A broader entry point when you want to engage the Human Architecture system comprehensively rather than beginning with one isolated layer."
    },

    de: {
      classification: "Ganzheitliche System-Immersion",
      title: "Human Architecture Intensive",
      copy:
        "Ein umfassenderer Einstiegspunkt, wenn du das Human-Architecture-System als Ganzes erleben möchtest, statt mit einer einzelnen Ebene zu beginnen."
    }
  },


  mihira: {
    context: "mihira",

    en: {
      classification: "Identity & Transition",
      title: "Mihira Ceremonia",
      copy:
        "A ceremonial integration point for significant periods of identity, transition and meaningful human passage."
    },

    de: {
      classification: "Identität & Übergang",
      title: "Mihira Ceremonia",
      copy:
        "Ein zeremonieller Integrationsraum für bedeutsame Phasen von Identität, Übergang und menschlicher Veränderung."
    }
  }

};

  function saveEntryContext(
    value,
    title
  ) {

    try {

      sessionStorage.setItem(
        "humanArchitectureContext",
        value
      );


      sessionStorage.setItem(
        "humanArchitectureContextTitle",
        title
      );

    } catch (error) {

      /*
        Context memory is enhancement only.
      */

    }

  }


  function updateEntryResult(
    content
  ) {

    if (
      !entryResult ||
      !content
    ) {
      return;
    }


    const classification =
      entryResult.querySelector(
        ".entry-result__eyebrow"
      );


    const title =
      entryResult.querySelector(
        ".entry-result__title"
      );


    const copy =
      entryResult.querySelector(
        ".entry-result__copy"
      );


    if (classification) {
      classification.textContent =
        content.classification;
    }


    if (title) {
      title.textContent =
        content.title;
    }


    if (copy) {
      copy.textContent =
        content.copy;
    }


    if (
      !reducedMotion &&
      entryResult.animate
    ) {

      entryResult.animate(

        [
          {
            opacity: 0.42,
            transform:
              "translateY(8px)"
          },

          {
            opacity: 1,
            transform:
              "translateY(0)"
          }
        ],

        {
          duration: 450,
          easing:
            "cubic-bezier(.22,1,.36,1)"
        }

      );

    }

  }



  /* =======================================================
     11 — CONTACT CONTEXT
  ======================================================= */

  const contactContext =
    document.querySelector(
      "[data-context-select]"
    ) ||
    document.getElementById(
      "context"
    );


  function updateContactContext(
    value
  ) {

    if (
      !contactContext ||
      !value
    ) {
      return;
    }


    const optionExists =
      Array
        .from(contactContext.options)
        .some(
          (option) =>
            option.value === value
        );


    if (optionExists) {

      contactContext.value =
        value;

    }

  }



  /* =======================================================
     12 — CONTEXT-AWARE WHATSAPP
  ======================================================= */

  const whatsappLinks =
    document.querySelectorAll(
      'a[href*="wa.me/4915203131871"]'
    );


  function updateWhatsAppLinks(
    title = ""
  ) {

    const base =
      "https://wa.me/4915203131871";


    const message =
      title
        ? `Hello Human Architecture, I came through the website and was oriented toward ${title}. I would like to understand the appropriate next step.`
        : "Hello Human Architecture, I found you through the website and would like to understand my most appropriate entry point.";


    const url =
      `${base}?text=${encodeURIComponent(message)}`;


    whatsappLinks.forEach(
      (link) => {

        /*
          Preserve Mihira-specific wording when the link
          already intentionally belongs to Mihira.
        */

        const href =
          link.getAttribute("href") || "";


        const isMihiraSpecific =
          href
            .toLowerCase()
            .includes("mihira");


        if (!isMihiraSpecific) {
          link.href = url;
        }

      }
    );

  }



  /* =======================================================
     13 — ENTRY CHOICE EVENTS
  ======================================================= */

  entryChoices.forEach(
    (choice) => {

      choice.setAttribute(
        "aria-pressed",
        "false"
      );


      choice.addEventListener(
        "click",
        () => {

          const key =
            choice.dataset.entryChoice;


          const entry =
  entryChoiceContent[key];

if (!entry) return;

const content =
  entry[currentLanguage] || entry.en;


          entryChoices.forEach(
            (item) => {

              item.classList.remove(
                "is-active"
              );


              item.setAttribute(
                "aria-pressed",
                "false"
              );

            }
          );


          choice.classList.add(
            "is-active"
          );


          choice.setAttribute(
            "aria-pressed",
            "true"
          );


          updateEntryResult(
            content
          );


          saveEntryContext(
            entry.context,
            content.title
          );


          updateContactContext(
            entry.context
          );


          updateWhatsAppLinks(
            content.title
          );

        }
      );

    }
  );



  /* =======================================================
     14 — RESTORE STORED ORIENTATION
  ======================================================= */

  try {

    const storedContext =
      sessionStorage.getItem(
        "humanArchitectureContext"
      );


    const storedTitle =
      sessionStorage.getItem(
        "humanArchitectureContextTitle"
      );


    if (storedContext) {

      updateContactContext(
        storedContext
      );

    }


    if (storedTitle) {

      updateWhatsAppLinks(
        storedTitle
      );

    }

  } catch (error) {

    /*
      Context memory is progressive enhancement only.
    */

  }



  /* =======================================================
     15 — DOMAIN PANEL CONTEXT
  ======================================================= */

  const domainLinks =
    document.querySelectorAll(
      ".domain-panel .line-link"
    );


  domainLinks.forEach(
    (link) => {

      link.addEventListener(
        "click",
        () => {

          const panel =
            link.closest(
              ".domain-panel"
            );


          if (!panel) return;


          if (
            panel.classList.contains(
              "domain-panel--codex"
            )
          ) {

            saveEntryContext(
              "codex",
              "Codex"
            );


            updateContactContext(
              "codex"
            );


            updateWhatsAppLinks(
              "Codex"
            );

          }


          if (
            panel.classList.contains(
              "domain-panel--body"
            )
          ) {

            saveEntryContext(
              "structural",
              "Human Architecture Sessions"
            );


            updateContactContext(
              "structural"
            );


            updateWhatsAppLinks(
              "Human Architecture Sessions"
            );

          }


          if (
            panel.classList.contains(
              "domain-panel--mihira"
            )
          ) {

            saveEntryContext(
              "mihira",
              "Mihira Ceremonia"
            );


            updateContactContext(
              "mihira"
            );

          }

        }
      );

    }
  );



  /* =======================================================
     16 — ACCESSIBLE OFFERINGS ACCORDION
  ======================================================= */

  const accordionButtons =
    document.querySelectorAll(
      ".accordion-item h3 > button[aria-expanded]"
    );


  accordionButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const panelId =
            button.getAttribute(
              "aria-controls"
            );


          const panel =
            document.getElementById(
              panelId
            );


          if (!panel) return;


          const expanded =
            button.getAttribute(
              "aria-expanded"
            ) === "true";


          button.setAttribute(
            "aria-expanded",
            String(!expanded)
          );


          panel.hidden =
            expanded;


          if (
            !expanded &&
            !reducedMotion &&
            panel.animate
          ) {

            panel.animate(

              [
                {
                  opacity: 0,
                  transform:
                    "translateY(-5px)"
                },

                {
                  opacity: 1,
                  transform:
                    "translateY(0)"
                }
              ],

              {
                duration: 380,
                easing:
                  "cubic-bezier(.22,1,.36,1)"
              }

            );

          }

        }
      );

    }
  );



  /* =======================================================
     17 — CONTACT FORM VALIDATION
  ======================================================= */

  const contactForm =
    document.querySelector(
      "[data-contact-form]"
    );


  const formStatus =
    document.querySelector(
      "[data-form-status]"
    );


  function setFieldError(
    field,
    message
  ) {

    const wrapper =
      field.closest(
        ".form-field"
      );


    const errorElement =
      document.querySelector(
        `[data-error-for="${field.id}"]`
      );


    if (wrapper) {

      wrapper.classList.toggle(
        "has-error",
        Boolean(message)
      );

    }


    if (errorElement) {

      errorElement.textContent =
        message;


      errorElement.id =
        `error-${field.id}`;

    }


    if (message) {

      field.setAttribute(
        "aria-invalid",
        "true"
      );


      if (errorElement) {

        field.setAttribute(
          "aria-describedby",
          errorElement.id
        );

      }

    } else {

      field.removeAttribute(
        "aria-invalid"
      );


      field.removeAttribute(
        "aria-describedby"
      );

    }

  }


  function validateField(
    field
  ) {

    if (!field.required) {

      setFieldError(
        field,
        ""
      );


      return true;

    }


    if (
      field.validity.valueMissing
    ) {

      setFieldError(
        field,
        "Please complete this field."
      );


      return false;

    }


    if (
      field.type === "email" &&
      field.validity.typeMismatch
    ) {

      setFieldError(
        field,
        "Please enter a valid email address."
      );


      return false;

    }


    setFieldError(
      field,
      ""
    );


    return true;

  }


  if (contactForm) {

    const formFields =
      Array.from(
        contactForm.querySelectorAll(
          "input, select, textarea"
        )
      );


    formFields.forEach(
      (field) => {

        field.addEventListener(
          "blur",
          () => {

            validateField(
              field
            );

          }
        );


        field.addEventListener(
          "input",
          () => {

            if (
              field.getAttribute(
                "aria-invalid"
              ) === "true"
            ) {

              validateField(
                field
              );

            }

          }
        );


        field.addEventListener(
          "change",
          () => {

            if (
              field.getAttribute(
                "aria-invalid"
              ) === "true"
            ) {

              validateField(
                field
              );

            }

          }
        );

      }
    );



    contactForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        const requiredFields =
          formFields.filter(
            (field) =>
              field.required
          );


        const results =
          requiredFields.map(
            (field) =>
              validateField(
                field
              )
          );


        const valid =
          results.every(Boolean);


        if (!valid) {

          const firstInvalid =
            contactForm.querySelector(
              '[aria-invalid="true"]'
            );


          if (firstInvalid) {

            firstInvalid.focus();

          }


          if (formStatus) {

            formStatus.textContent =
              "Please review the highlighted fields.";

          }


          return;

        }


        const submitButton =
  contactForm.querySelector('button[type="submit"]');

const originalButtonText =
  submitButton ? submitButton.textContent : "";

if (submitButton) {
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
}

if (formStatus) {
  formStatus.textContent = "Sending your message...";
}

const formData = new FormData(contactForm);

const payload = {
  name: formData.get("name") || "",
  email: formData.get("email") || "",
  organisation: formData.get("organisation") || "",
  context: formData.get("context") || "",
  message: formData.get("message") || ""
};

fetch("/api/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
})
  .then(async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || "Your message could not be delivered."
      );
    }

    return data;
  })
  .then((data) => {
    if (formStatus) {
      formStatus.textContent =
        data.message || "Thank you. Your message has been received.";
    }

    contactForm.reset();

    try {
      sessionStorage.removeItem("humanArchitectureContext");
      sessionStorage.removeItem("humanArchitectureContextTitle");
    } catch (error) {
      // Progressive enhancement only.
    }
  })
  .catch((error) => {
    console.error("Human Architecture form error:", error);

    if (formStatus) {
      formStatus.textContent =
        error.message ||
        "Your message could not be delivered. Please contact us by email or WhatsApp.";
    }
  })
  .finally(() => {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
      }
    );

  }



  /* =======================================================
     18 — ECOSYSTEM SUBTLE RESPONSE
  ======================================================= */

  const ecosystemGroups =
    document.querySelectorAll(
      ".ecosystem-group"
    );


  const ecosystemCentre =
    document.querySelector(
      ".ecosystem__centre"
    );


  ecosystemGroups.forEach(
    (group) => {

      group.addEventListener(
        "mouseenter",
        () => {

          if (
            reducedMotion ||
            !ecosystemCentre
          ) {
            return;
          }


          ecosystemCentre.animate(

            [
              {
                transform:
                  "translate(-50%, -50%) scale(1)"
              },

              {
                transform:
                  "translate(-50%, -50%) scale(1.025)"
              }
            ],

            {
              duration: 430,
              fill: "forwards",
              easing:
                "cubic-bezier(.22,1,.36,1)"
            }

          );

        }
      );


      group.addEventListener(
        "mouseleave",
        () => {

          if (
            reducedMotion ||
            !ecosystemCentre
          ) {
            return;
          }


          ecosystemCentre.animate(

            [
              {
                transform:
                  "translate(-50%, -50%) scale(1.025)"
              },

              {
                transform:
                  "translate(-50%, -50%) scale(1)"
              }
            ],

            {
              duration: 430,
              fill: "forwards",
              easing:
                "cubic-bezier(.22,1,.36,1)"
            }

          );

        }
      );

    }
  );
/* =========================================================
   LANGUAGE SWITCH — EN / DE
   ========================================================= */

let currentLanguage = document.documentElement.lang || "en";
const langButtons = document.querySelectorAll(".lang-button");

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.dataset.lang;
     currentLanguage = lang;

    document.documentElement.lang = lang;

     document.querySelectorAll("[data-en][data-de]").forEach((element) => {
  element.textContent = element.dataset[lang];
});

    langButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.lang === lang);
    });
     const activeSystemNode =
  document.querySelector("[data-system-node].is-active");

if (activeSystemNode) {
  updateSystemResponse(
    activeSystemNode.dataset.systemNode,
    activeSystemNode
  );
}
  });
});

});

