(() => {
  const labels = [
    ['.example-grid > .example-card:nth-child(1) .example-type', '01 · PERSÖNLICHER CODEX', '01 · PERSONAL CODEX'],
    ['.example-grid > .example-card:nth-child(2) .example-type', '02 · BABY CODEX', '02 · BABY CODEX'],
    ['.example-grid > .example-card:nth-child(3) .example-type', '03 · BEZIEHUNGS-CODEX', '03 · RELATIONSHIP CODEX'],
    ['.example-grid > .example-card:nth-child(4) .example-type', '04 · LEADERSHIP CODEX', '04 · LEADERSHIP CODEX'],
    ['.example-grid > .example-card:nth-child(5) .example-type', '05 · JAHRES-CODEX', '05 · YEAR CODEX'],
    ['.example-grid > .example-card:nth-child(6) > .example-type', '06 · FAMILIEN-CODEX · FAMILY COMPASS', '06 · FAMILY CODEX · FAMILY COMPASS'],
    ['.family-codex-map > div:nth-child(3) span', '03 · BABY CODEX', '03 · BABY CODEX']
  ];

  const metadata = {
    de: {
      title: 'Codex-Beispiele ohne persönliche Daten | Human Architecture®',
      description: 'Anonymisierte Human Architecture Codex-Beispiele: alle Formate transparent kennenlernen.'
    },
    en: {
      title: 'Codex examples without personal data | Human Architecture®',
      description: 'Explore anonymised examples of every Human Architecture Codex format.'
    }
  };

  const setLabels = () => {
    const language = document.documentElement.lang === 'en' ? 'en' : 'de';
    labels.forEach(([selector, de, en]) => {
      const element = document.querySelector(selector);
      if (!element) return;
      element.dataset.de = de;
      element.dataset.en = en;
      element.textContent = language === 'en' ? en : de;
    });
    document.title = metadata[language].title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata[language].description);
  };

  document.addEventListener('DOMContentLoaded', () => {
    setLabels();
    document.querySelectorAll('[data-language]').forEach(button => {
      button.addEventListener('click', () => requestAnimationFrame(setLabels));
    });
  });
})();
