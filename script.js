document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =====================================================
     HEADER
  ====================================================== */

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


  /* =====================================================
     MOBILE NAV
  ====================================================== */

  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  function closeMenu() {
    if (!menuButton || !mobileMenu) return;

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");

    mobileMenu.classList.remove("is-open");
    body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!menuButton || !mobileMenu) return;

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation");

    mobileMenu.classList.add("is-open");
    body.classList.add("menu-open");
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const isOpen =
        menuButton.getAttribute("aria-expanded") === "true";

      isOpen ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1180) {
        closeMenu();
      }
    });
  }


  /* =====================================================
     SMOOTH INTERNAL NAVIGATION
  ====================================================== */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header
        ? header.getBoundingClientRect().height
        : 0;

      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        18;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  });


  /* =====================================================
     REVEALS
  ====================================================== */

  const revealElements =
    document.querySelectorAll(".reveal");

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }


  /* =====================================================
     PHILOSOPHY LINE
  ====================================================== */

  const philosophyLine =
    document.querySelector(".philosophy-line");

  if (philosophyLine) {
    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      philosophyLine.classList.add("is-visible");
    } else {
      const lineObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.3
        }
      );

      lineObserver.observe(philosophyLine);
    }
  }


  /* =====================================================
     ACTIVE NAV SECTION
  ====================================================== */

  const trackedSections = [
    "philosophy",
    "human-system",
    "domains",
    "entry-point",
    "offerings",
    "partnerships",
    "about",
    "contact"
  ]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navLinks =
    document.querySelectorAll(".desktop-nav a");

  if (
    trackedSections.length &&
    "IntersectionObserver" in window
  ) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visible.length) return;

        const activeId = visible[0].target.id;

        navLinks.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${activeId}`
          );
        });
      },
      {
        rootMargin: "-32% 0px -50% 0px",
        threshold: [0, 0.15, 0.3]
      }
    );

    trackedSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }


  /* =====================================================
     ENTRY POINTS
  ====================================================== */

  const entryButtons =
    document.querySelectorAll("[data-entry]");

  const entryResponse =
    document.querySelector("[data-entry-response]");

  const entryContent = {
    self: {
      classification: "Blueprint / Codex",
      title: "Begin with understanding.",
      copy:
        "Codex offers a logical first orientation when the central question is how your own system is structured.",
      link: "Continue to Offerings"
    },

    body: {
      classification: "Body & Regulation",
      title: "Begin with the lived body.",
      copy:
        "Body & Regulation is the most direct domain when the primary context involves movement, physical experience, regulation or embodied capacity.",
      link: "Continue to Offerings"
    },

    transition: {
      classification: "Mihira Ceremonia",
      title: "Begin with the transition itself.",
      copy:
        "Mihira Ceremonia provides a context for identity, meaning and significant human passages.",
      link: "Continue to Offerings"
    },

    young: {
      classification: "Education & Youth",
      title: "Begin with age-appropriate understanding.",
      copy:
        "Educational work can help young people encounter individual difference and human structure without reducing them to a single standard.",
      link: "Explore Offerings"
    },

    women: {
      classification: "Women & Families",
      title: "Begin with the actual developmental context.",
      copy:
        "The appropriate entry point depends on whether the need is educational, embodied, developmental or related to transition.",
      link: "Explore Offerings"
    },

    lead: {
      classification: "Work & Leadership",
      title: "Begin with the human context behind leadership.",
      copy:
        "Organisational work starts by understanding the people, relationships and environment involved rather than treating leadership as an abstract performance problem.",
      link: "Explore Offerings"
    },

    culture: {
      classification: "Organisational Work",
      title: "Begin with the system people are already living inside.",
      copy:
        "Teams and cultures can be approached through a combination of human understanding, relational context and organisational design.",
      link: "Explore Offerings"
    },

    institution: {
      classification: "Institutional Partnership",
      title: "Begin with the environment and its people.",
      copy:
        "Schools and institutions require context-sensitive collaboration rather than a one-size-fits-all programme.",
      link: "Explore Partnerships"
    },

    practitioner: {
      classification: "Practitioner Development",
      title: "Begin with your existing practice.",
      copy:
        "Human Architecture can be explored in relationship to an established professional discipline without replacing that discipline.",
      link: "Explore Offerings"
    },

    partnership: {
      classification: "Partnerships",
      title: "Begin with the shared context.",
      copy:
        "Longer collaborations are co-designed around the people, environment and purpose involved.",
      link: "Explore Partnerships"
    }
  };

  entryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.entry;
      const content = entryContent[key];

      if (!content || !entryResponse) return;

      entryButtons.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");

      const classification =
        entryResponse.querySelector(
          ".entry-response__classification"
        );

      const title =
        entryResponse.querySelector("h3");

      const copy =
        entryResponse.querySelector(
          "p:not(.entry-response__classification)"
        );

      const link =
        entryResponse.querySelector("a");

      if (classification) {
        classification.textContent =
          content.classification;
      }

      if (title) {
        title.textContent = content.title;
      }

      if (copy) {
        copy.textContent = content.copy;
      }

      if (link) {
        link.textContent = content.link;

        link.setAttribute(
          "href",
          key === "institution" ||
          key === "partnership"
            ? "#partnerships"
            : "#offerings"
        );
      }

      if (!reducedMotion && entryResponse.animate) {
        entryResponse.animate(
          [
            {
              opacity: 0.45,
              transform: "translateY(8px)"
            },
            {
              opacity: 1,
              transform: "translateY(0)"
            }
          ],
          {
            duration: 450,
            easing: "cubic-bezier(.22,1,.36,1)"
          }
        );
      }
    });

    button.setAttribute("aria-pressed", "false");
  });


  /* =====================================================
     ACCESSIBLE ACCORDION
  ====================================================== */

  const accordionButtons =
    document.querySelectorAll(
      ".accordion-item button[aria-expanded]"
    );

  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const panelId =
        button.getAttribute("aria-controls");

      const panel =
        document.getElementById(panelId);

      if (!panel) return;

      const expanded =
        button.getAttribute("aria-expanded") === "true";

      button.setAttribute(
        "aria-expanded",
        String(!expanded)
      );

      panel.hidden = expanded;
    });
  });


  /* =====================================================
     CONTACT VALIDATION
     NO FALSE SUCCESS STATE
  ====================================================== */

  const contactForm =
    document.querySelector("[data-contact-form]");

  const formStatus =
    document.querySelector("[data-form-status]");

  function setFieldError(field, message) {
    const wrapper = field.closest(".form-field");

    const error =
      document.querySelector(
        `[data-error-for="${field.id}"]`
      );

    if (wrapper) {
      wrapper.classList.toggle(
        "has-error",
        Boolean(message)
      );
    }

    if (error) {
      error.textContent = message;
    }

    if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  function validateField(field) {
    if (!field.required) return true;

    if (field.validity.valueMissing) {
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

    setFieldError(field, "");

    return true;
  }

  if (contactForm) {
    const fields =
      [...contactForm.querySelectorAll(
        "input, select, textarea"
      )];

    fields.forEach((field) => {
      field.addEventListener("blur", () => {
        validateField(field);
      });

      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid")) {
          validateField(field);
        }
      });
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const valid =
        fields
          .filter((field) => field.required)
          .map(validateField)
          .every(Boolean);

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
        IMPORTANT:
        No backend exists yet, so do NOT show
        a false success message.

        Replace this block with the verified
        Human Architecture form delivery integration.
      */

      if (formStatus) {
        formStatus.textContent =
          "The form is complete, but delivery has not yet been connected. Please connect the verified Human Architecture form endpoint before launch.";
      }
    });
  }
});
