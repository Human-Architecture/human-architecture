/* =========================================================
   HUMAN ARCHITECTURE
   FINAL WEBSITE INTERACTIONS
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

  const header = document.querySelector("[data-header]");

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

    lastFocusedElement = document.activeElement;

    menuButton.setAttribute(
      "aria-expanded",
      "true"
    );

    menuButton.setAttribute(
      "aria-label",
      "Close navigation"
    );

    mobileMenu.classList.add("is-open");
    body.classList.add("menu-open");

    const firstLink =
      mobileMenu.querySelector("a");

    if (firstLink) {
      window.setTimeout(() => {
        firstLink.focus();
      }, 60);
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

    mobileMenu.classList.remove("is-open");
    body.classList.remove("menu-open");

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
          () => {
            closeMenu();
          }
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
          18;

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

              if (
                !entry.isIntersecting
              ) {
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
            "0px 0px -32px 0px"
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
     06 — PHILOSOPHY LINE DRAW
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

                if (
                  !entry.isIntersecting
                ) {
                  return;
                }

                entry.target
                  .classList
                  .add(
                    "is-visible"
                  );

                observer.unobserve(
                  entry.target
                );

              }
            );

          },
          {
            threshold: 0.24
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
      .map((id) =>
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

          if (
            !visibleEntries.length
          ) {
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
            "-30% 0px -52% 0px",

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
     08 — HUMAN SYSTEM INTERACTION
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
      label: "Body",
      text:
        "The physical expression of structure, movement and lived capacity."
    },

    nervous: {
      label: "Nervous System",
      text:
        "The regulatory layer through which activation, rest, adaptation and capacity are experienced."
    },

    emotion: {
      label: "Emotion",
      text:
        "The felt layer of human experience, continuously shaped by context and relationship."
    },

    cognition: {
      label: "Cognition",
      text:
        "How information is perceived, organised, interpreted and brought into understanding."
    },

    identity: {
      label: "Identity",
      text:
        "The lived relationship between self-understanding, adaptation, direction and personal context."
    },

    relationship: {
      label: "Relationship",
      text:
        "The relational field through which the individual encounters other people and shared environments."
    },

    environment: {
      label: "Environment",
      text:
        "The surrounding conditions in which the human system lives, responds and participates."
    },

    meaning: {
      label: "Meaning",
      text:
        "The layer through which experience, identity and significant moments become integrated into a larger context."
    }

  };


  function updateSystemResponse(
    key,
    node
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


    node.classList.add(
      "is-active"
    );

    node.setAttribute(
      "aria-pressed",
      "true"
    );


    const responseLabel =
      systemResponse.querySelector(
        ".eyebrow"
      );

    const responseText =
      systemResponse.querySelector(
        "p:not(.eyebrow)"
      );


    if (responseLabel) {
      responseLabel.textContent =
        content.label;
    }

    if (responseText) {
      responseText.textContent =
        content.text;
    }


    if (
      !reducedMotion &&
      systemResponse.animate
    ) {

      systemResponse.animate(
        [
          {
            opacity: 0.4,
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

  const entryResponse =
    document.querySelector(
      "[data-entry-response]"
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
          "aria-expanded",
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

          const alreadyOpen =
            button.getAttribute(
              "aria-expanded"
            ) === "true";


          closeEntryDetails();


          if (
            alreadyOpen ||
            !detail
          ) {
            return;
          }


          button.classList.add(
            "is-active"
          );

          button.setAttribute(
            "aria-expanded",
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
                    "translateY(12px)"
                },
                {
                  opacity: 1,
                  transform:
                    "translateY(0)"
                }
              ],
              {
                duration: 520,
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
        "A logical first point of entry when the central question is clearer understanding of your own inherent structure.",

      context:
        "blueprint"
    },


    patterns: {
      classification:
        "Blueprint / Codex",

      title:
        "Codex",

      copy:
        "When recurring patterns raise questions about how the system is structured, Blueprint work provides the clearest first frame for orientation.",

      context:
        "blueprint"
    },


    structural: {
      classification:
        "Body & Regulation",

      title:
        "Structural Consultation",

      copy:
        "A logical first point of entry when the primary context is physical structure, mobility, biomechanical tension or movement limitation.",

      context:
        "body"
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


    core: {
      classification:
        "Body & Regulation",

      title:
        "Chi Nei Tsang",

      copy:
        "A body-based entry point when the dominant context involves digestive-core tension, shallow breathing or significant internal holding.",

      context:
        "body"
    },


    vitality: {
      classification:
        "Body & Regulation",

      title:
        "Calamus Ceremony",

      copy:
        "A possible entry point when the dominant experience is dullness, stagnation or disconnection from vitality.",

      context:
        "body"
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


    transition: {
      classification:
        "Identity & Transition",

      title:
        "Mihira Ceremonia",

      copy:
        "A ceremonial integration point for significant periods of identity, transition and meaningful human passage.",

      context:
        "transition"
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
        sessionStorage is enhancement only.
        The website remains functional without it.
      */

    }

  }


  function updateEntryResponse(
    content
  ) {

    if (
      !entryResponse ||
      !content
    ) {
      return;
    }


    const classification =
      entryResponse.querySelector(
        ".entry-response__classification"
      );

    const title =
      entryResponse.querySelector(
        "h3"
      );

    const copy =
      entryResponse.querySelector(
        "p:not(.entry-response__classification)"
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
      entryResponse.animate
    ) {

      entryResponse.animate(
        [
          {
            opacity: 0.4,
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
          duration: 460,
          easing:
            "cubic-bezier(.22,1,.36,1)"
        }
      );

    }
  }


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


          updateEntryResponse(
            content
          );


          saveEntryContext(
            content.context,
            content.title
          );


          updateContactContext(
            content.context
          );

        }
      );

    }
  );


  /* =======================================================
     11 — DOMAIN PANEL CONTEXT MEMORY
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
              "blueprint",
              "Codex"
            );

            updateContactContext(
              "blueprint"
            );

          }


          if (
            panel.classList.contains(
              "domain-panel--body"
            )
          ) {

            saveEntryContext(
              "body",
              "Human Architecture Sessions"
            );

            updateContactContext(
              "body"
            );

          }


          if (
            panel.classList.contains(
              "domain-panel--mihira"
            )
          ) {

            saveEntryContext(
              "transition",
              "Mihira Ceremonia"
            );

            updateContactContext(
              "transition"
            );

          }

        }
      );

    }
  );


  /* =======================================================
     12 — ACCESSIBLE OFFERINGS ACCORDION
  ======================================================= */

  const accordionButtons =
    document.querySelectorAll(
      ".accordion-item button[aria-expanded]"
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


          panel.hidden = expanded;


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
                duration: 400,
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
     13 — CONTACT CONTEXT MEMORY
  ======================================================= */

  const contactContext =
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
        .from(
          contactContext.options
        )
        .some(
          (option) =>
            option.value === value
        );


    if (optionExists) {
      contactContext.value =
        value;
    }

  }


  try {

    const storedContext =
      sessionStorage.getItem(
        "humanArchitectureContext"
      );


    if (storedContext) {
      updateContactContext(
        storedContext
      );
    }

  } catch (error) {

    /*
      Context memory is progressive enhancement only.
    */

  }


  /* =======================================================
     14 — CONTACT FORM VALIDATION
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

    }


    if (message) {

      field.setAttribute(
        "aria-invalid",
        "true"
      );

      if (errorElement) {

        field.setAttribute(
          "aria-describedby",
          `error-${field.id}`
        );

        errorElement.id =
          `error-${field.id}`;
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
          IMPORTANT — FORM DELIVERY
          ===================================================

          No backend or email endpoint has been invented.

          Connect the verified Human Architecture form
          delivery service here before launch.

          Only after a real successful server response
          should the site display a success confirmation.

          Example future pattern:

          const response = await fetch("VERIFIED-ENDPOINT", {
            method: "POST",
            body: new FormData(contactForm)
          });

          if (response.ok) {
            // Genuine confirmation state.
          }

        */


        if (formStatus) {

          formStatus.textContent =
            "Your message is ready, but form delivery has not yet been connected. The verified Human Architecture contact endpoint must be added before launch.";

        }

      }
    );
  }


  /* =======================================================
     15 — ECOSYSTEM SUBTLE RESPONSE
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
              duration: 450,
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
              duration: 450,
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
