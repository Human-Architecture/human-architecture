/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");

const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "is-visible"
          );

          revealObserver.unobserve(
            entry.target
          );

        }

      });

    },
    {
      threshold: 0.12
    }
  );

revealElements.forEach((element) => {
  revealObserver.observe(element);
});


/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle =
  document.querySelector(".menu-toggle");

const siteNav =
  document.querySelector(".site-nav");

menuToggle.addEventListener(
  "click",
  () => {

    const isOpen =
      siteNav.classList.toggle("open");

    document.body.classList.toggle(
      "menu-open",
      isOpen
    );

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  }
);

document
  .querySelectorAll(".site-nav a")
  .forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        siteNav.classList.remove("open");

        document.body.classList.remove(
          "menu-open"
        );

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }
    );

  });


/* =========================================================
   ENTRY POINT ORIENTATION
========================================================= */

const orientationResults = {

  patterns: {

    domain:
      "Blueprint",

    title:
      "Codex",

    copy:
      "Codex is the most logical starting point when the central question concerns identity, recurring patterns, decision-making or understanding how your individual system is organized.",

    support: [
      "Structural self-understanding",
      "Recognition of recurring dynamics",
      "Orientation before strategy"
    ],

    button:
      "Explore Codex",

    href:
      "mailto:hello@human-architecture.info?subject=Codex%20Enquiry"

  },


  body: {

    domain:
      "Body & Regulation",

    title:
      "Structural Consultation",

    copy:
      "A Structural Consultation is the clearest starting point when physical tension, restricted mobility or changes in structural organization are central.",

    support: [
      "Observation of posture and movement",
      "Breathing and mobility orientation",
      "Identification of an appropriate pathway"
    ],

    button:
      "Explore Structural Consultation",

    href:
      "mailto:hello@human-architecture.info?subject=Structural%20Consultation%20Enquiry"

  },


  regulation: {

    domain:
      "Body & Regulation",

    title:
      "Regulation & Recovery",

    copy:
      "Where overwhelm, fatigue or difficulty settling is central, the most relevant entry point may begin within the regulation layer rather than with greater physical intensity.",

    support: [
      "Breathing mechanics",
      "Deep rest",
      "Nervous-system settling"
    ],

    button:
      "Explore Regulation",

    href:
      "mailto:hello@human-architecture.info?subject=Regulation%20Session%20Enquiry"

  },


  core: {

    domain:
      "Body & Regulation",

    title:
      "Chi Nei Tsang",

    copy:
      "When abdominal tension, restricted breathing or internal holding is particularly relevant, Chi Nei Tsang may provide the clearest structural entry point.",

    support: [
      "Abdominal ease",
      "Diaphragmatic mobility",
      "Internal body awareness"
    ],

    button:
      "Explore Chi Nei Tsang",

    href:
      "mailto:hello@human-architecture.info?subject=Chi%20Nei%20Tsang%20Enquiry"

  },


  transition: {

    domain:
      "Identity & Transition",

    title:
      "Mihira Ceremonia",

    copy:
      "Mihira Ceremonia is designed for periods of transition, reorientation and the conscious integration of changing inner or outer life structures.",

    support: [
      "Transition",
      "Reorientation",
      "Conscious integration"
    ],

    button:
      "Explore Mihira",

    href:
      "mailto:hello@human-architecture.info?subject=Mihira%20Ceremonia%20Enquiry"

  },


  unclear: {

    domain:
      "Orientation",

    title:
      "Begin with a Conversation",

    copy:
      "When several areas feel relevant at once, the most appropriate first step is simply to clarify which domain is currently primary before choosing a session or pathway.",

    support: [
      "Clarify the current situation",
      "Identify the relevant domain",
      "Determine one logical first step"
    ],

    button:
      "Start a Conversation",

    href:
      "https://wa.me/4915203131871?text=Hello%2C%20I%20would%20like%20help%20finding%20the%20right%20Human%20Architecture%20entry%20point."

  }

};


const resultDomain =
  document.getElementById(
    "result-domain"
  );

const resultTitle =
  document.getElementById(
    "result-title"
  );

const resultCopy =
  document.getElementById(
    "result-copy"
  );

const resultList =
  document.getElementById(
    "result-list"
  );

const resultButton =
  document.getElementById(
    "result-button"
  );


function showOrientationResult(key) {

  const result =
    orientationResults[key];

  resultDomain.textContent =
    result.domain;

  resultTitle.textContent =
    result.title;

  resultCopy.textContent =
    result.copy;

  resultList.innerHTML =
    result.support
      .map(
        (item) =>
          `<li>${item}</li>`
      )
      .join("");

  resultButton.textContent =
    result.button;

  resultButton.href =
    result.href;

}


document
  .querySelectorAll(".entry-option")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".entry-option"
          )
          .forEach((item) => {

            item.classList.remove(
              "active"
            );

          });

        button.classList.add(
          "active"
        );

        showOrientationResult(
          button.dataset.result
        );

      }
    );

  });


/* =========================================================
   HEADER DEPTH ON SCROLL
========================================================= */

const header =
  document.querySelector(
    ".site-header"
  );

window.addEventListener(
  "scroll",
  () => {

    if (window.scrollY > 40) {

      header.style.background =
        "rgba(7,31,39,0.94)";

    } else {

      header.style.background =
        "rgba(7,31,39,0.82)";

    }

  }
);