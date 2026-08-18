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


  const systemContent = {

    body: {
      label:
        "Body",

      title:
        "Structure becomes lived through the body.",

      text:
        "The physical dimension includes structure, movement and the way capacity is expressed through lived embodiment."
    },


    "nervous-system": {
      label:
        "Nervous System",

      title:
        "Regulation influences how capacity is experienced.",

      text:
        "The nervous system is the regulatory dimension through which activation, rest, adaptation and available capacity are experienced."
    },


    emotion: {
      label:
        "Emotion",

      title:
        "Emotion belongs to the wider human context.",

      text:
        "The emotional dimension is continuously shaped by relationship, environment, experience and the wider system around it."
    },


    cognition: {
      label:
        "Cognition",

      title:
        "Information becomes organised into understanding.",

      text:
        "Cognition describes how information is perceived, organised, interpreted and brought into conscious understanding."
    },


    identity: {
      label:
        "Identity",

      title:
        "Identity develops in relationship with structure and context.",

      text:
        "Identity concerns the lived relationship between self-understanding, adaptation, direction and personal context."
    },


    relationship: {
      label:
        "Relationship",

      title:
        "Human structure is always meeting other structure.",

      text:
        "Relationship is the dimension through which the individual encounters other people, shared environments and collective dynamics."
    },


    environment: {
      label:
        "Environment",

      title:
        "Context shapes how the system can be lived.",

      text:
        "Environment includes the surrounding conditions in which the human system lives, responds, participates and develops."
    },


    meaning: {
      label:
        "Meaning",

      title:
        "Experience is integrated within a larger context.",

      text:
        "Meaning is the dimension through which experience, identity and significant moments become integrated into a wider human context."
    }

  };


  function updateSystemResponse(
    key,
    selectedNode
  ) {

    const content =
      systemContent[key];


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
      classification:
        "Blueprint / Codex",

      title:
        "Codex",

      copy:
        "A logical first point of entry when the central question is understanding your own inherent structure more clearly.",

      context:
        "codex"
    },


    patterns: {
      classification:
        "Blueprint / Codex",

      title:
        "Codex",

      copy:
        "When recurring patterns raise questions about how your system is designed, Blueprint work provides a clearer frame for orientation.",

      context:
        "codex"
    },


    structural: {
      classification:
        "Body & Regulation",

      title:
        "Structural Consultation",

      copy:
        "A logical entry point when the primary question concerns physical structure, mobility, biomechanical tension or movement limitation.",

      context:
        "structural"
    },


    regulation: {
      classification:
        "Body & Regulation",

      title:
        "Regulation",

      copy:
        "A regulation-oriented entry point when sustained overwhelm, fatigue or nervous-system strain is the dominant context.",

      context:
        "regulation"
    },


    "chi-nei-tsang": {
      classification:
        "Body & Regulation",

      title:
        "Chi Nei Tsang",

      copy:
        "A body-based entry point when there is notable internal holding around the abdominal core, breath or digestive centre.",

      context:
        "chi-nei-tsang"
    },


    calamus: {
      classification:
        "Body & Regulation",

      title:
        "Calamus Ceremony",

      copy:
        "A possible entry point when the dominant experience is dullness, stagnation or disconnection from vitality.",

      context:
        "other"
    },


    intensive: {
      classification:
        "Full-System Immersion",

      title:
        "Human Architecture Intensive",

      copy:
        "A broader entry point when you want to engage the Human Architecture system comprehensively rather than beginning with one isolated layer.",

      context:
        "intensive"
    },


    mihira: {
      classification:
        "Identity & Transition",

      title:
        "Mihira Ceremonia",

      copy:
        "A ceremonial integration point for significant periods of identity, transition and meaningful human passage.",

      context:
        "mihira"
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


          const content =
            entryChoiceContent[key];


          if (!content) return;


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
            content.context,
            content.title
          );


          updateContactContext(
            content.context
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


        /*
          ===================================================
          FORM DELIVERY
          ===================================================

          The front-end is now complete and validated.

          The real delivery endpoint is connected in the
          next technical phase.

          Until that endpoint exists, this form MUST NOT
          display a false success confirmation.

          Internal delivery destination planned:
          mihira.ceremonia@googlemail.com

          Public Human Architecture address:
          hello@human-architecture.info
        */


        if (formStatus) {

          formStatus.textContent =
            "The form is ready, but secure message delivery is being connected. Please use Email or WhatsApp below in the meantime.";

        }

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

});
