(() => {
  const currentUrl = new URL(window.location.href);
  const translatedHost = /(^|\.)translate\.goog$/i.test(window.location.hostname) || window.location.hostname === "translate.google.com";

  const germanTranslationUrl = () => {
    const sourceUrl = new URL(window.location.href);
    sourceUrl.searchParams.delete("lang");
    return `https://translate.google.com/translate?sl=en&tl=de&u=${encodeURIComponent(sourceUrl.href)}`;
  };

  if (currentUrl.searchParams.get("lang") === "de" && !translatedHost) {
    window.location.replace(germanTranslationUrl());
    return;
  }

  if (translatedHost) return;

  document.addEventListener("DOMContentLoaded", () => {
    const navigation = document.querySelector(".cr-nav");
    if (!navigation || navigation.querySelector("[data-codex-language-link]")) return;

    const link = document.createElement("a");
    link.href = germanTranslationUrl();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.lang = "de";
    link.dataset.codexLanguageLink = "true";
    link.setAttribute("aria-label", "Diese Seite auf Deutsch lesen (öffnet Google Übersetzer in einem neuen Tab)");
    link.textContent = "Deutsch lesen ↗";
    navigation.append(link);
  });
})();
