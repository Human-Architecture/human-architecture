/* =========================================================
   HUMAN ARCHITECTURE
   WEBSITE INTERACTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     01 — HEADER SCROLL STATE
  ======================================================= */

  const header = document.querySelector(".site-header");

  const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });


  /* =======================================================
     02 — MOBILE NAVIGATION
  ======================================================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");

  const closeMenu = () => {
    if (!menuToggle || !siteNav) return;

    menuToggle.classList.remove("is-open");
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.classList.toggle("is-open");

      siteNav.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }


  /* =======================================================
     03 — REVEAL ON SCROLL
  ======================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      revealObserver.observe(element);
    });

  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }


  /* =======================================================
     04 — ENTRY POINT ORIENTATION
  ======================================================= */

  const entryCards = document.querySelectorAll(".entry-card");
  const resultTitle = document.querySelector(".entry-result__title");
  const resultCopy = document.querySelector(".entry-result__copy");
  const resultEyebrow = document.querySelector(".entry-result__eyebrow");

  const entryContent = {

    codex: {
      eyebrow: "Blueprint",
      title: "Codex",
      copy:
        "A logical first point of entry when you want clearer orientation around your own inherent structure and how your system is designed."
    },

    patterns: {
      eyebrow: "Blueprint",
      title: "Codex",
      copy:
        "When recurring patterns raise questions about how you are structured, Blueprint work offers a clearer frame for understanding the system beneath them."
    },

    structural: {
      eyebrow: "Body & Regulation",
      title: "Structural Consultation",
      copy:
        "A logical entry point when the primary question is physical structure, mobility, tension or the way the body is currently organising itself."
    },

    regulation: {
      eyebrow: "Body & Regulation",
      title: "Regulation",
      copy:
        "A regulation-oriented entry point when sustained strain, overwhelm or depletion is the dominant experience."
    },

    "chi-nei-tsang": {
      eyebrow: "Body & Regulation",
      title: "Chi Nei Tsang",
      copy:
        "A body-based entry point when there is notable internal holding around the abdominal core, breath or digestive centre."
    },

    calamus: {
      eyebrow: "Body & Regulation",
      title: "Calamus Ceremony",
      copy:
        "A possible entry point when the dominant experience is stagnation, dullness or disconnection from vitality."
    },

    mihira: {
      eyebrow: "Identity & Transition",
      title: "Mihira Ceremonia",
      copy:
        "A ceremonial entry point for significant periods of identity change, transition and integration."
    },

    intensive: {
      eyebrow: "Full-System Immersion",
      title: "Human Architecture Intensive",
      copy:
        "A broader entry point when you want to engage the system more comprehensively rather than begin with one isolated layer."
    },

    partnership: {
      eyebrow: "Partnerships",
      title: "Institutional or Organisational Conversation",
      copy:
        "A conversation is the most appropriate first step when the context involves a school, organisation, team, community or collaborative environment."
    }

  };

  entryCards.forEach((card) => {

    card.addEventListener("click", () => {

      const key = card.dataset.entry;
      const content = entryContent[key];

      if (!content) return;

      entryCards.forEach((item) => {
        item.classList.remove("is-active");
      });

      card.classList.add("is-active");

      if (resultEyebrow) {
        resultEyebrow.textContent = content.eyebrow;
      }

      if (resultTitle) {
        resultTitle.textContent = content.title;
      }

      if (resultCopy) {
        resultCopy.textContent = content.copy;
      }

      const result = document.querySelector(".entry-result");

      if (result) {
        result.animate(
          [
            {
              opacity: 0.35,
              transform: "translateY(8px)"
            },
            {
              opacity: 1,
              transform: "translateY(0)"
            }
          ],
          {
            duration: 420,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)"
          }
        );
      }

    });

  });


  /* =======================================================
     05 — SMOOTH INTERNAL LINKS
  ======================================================= */

  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerOffset = 82;
      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: targetTop,
        behavior: reducedMotion ? "auto" : "smooth"
      });

    });

  });


  /* =======================================================
     06 — CONTACT FORM
     FRONT-END PLACEHOLDER ONLY
  ======================================================= */

  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {

    contactForm.addEventListener("submit", (event) => {

      event.preventDefault();

      const submitButton = contactForm.querySelector(
        'button[type="submit"]'
      );

      if (!submitButton) return;

      const originalText = submitButton.textContent;

      submitButton.textContent = "Form connection coming next";
      submitButton.disabled = true;

      window.setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 2200);

    });

  }

});
 
