(() => {
  const buttons = [...document.querySelectorAll('[data-language]')];
  const translated = [...document.querySelectorAll('[data-de][data-en]')];

  const setLanguage = (language, updateUrl = true) => {
    const lang = language === 'en' ? 'en' : 'de';
    document.documentElement.lang = lang;
    translated.forEach((element) => {
      element.textContent = element.dataset[lang];
    });
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.language === lang)));
    document.title = lang === 'en'
      ? 'Meet Mel Mihira | A Personal Codex | Mihira Ceremonia'
      : 'Mel Mihira kennenlernen | Persönlicher Codex | Mihira Ceremonia';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = lang === 'en'
      ? 'Meet Mel Mihira through a personal symbolic portrait of the perspective and architecture behind Mihira Ceremonia.'
      : 'Lerne Mel Mihira persönlicher kennen: ein symbolischer Einblick in die Perspektive und Architektur hinter Mihira Ceremonia.';
    document.querySelectorAll('a[href^="/mihira-ceremonia/"]').forEach((link) => {
      const url = new URL(link.href, location.origin);
      if (!url.pathname.endsWith('/mel/')) url.searchParams.set('lang', lang);
      link.href = url.pathname + url.search + url.hash;
    });
    if (updateUrl) {
      const url = new URL(location.href);
      if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  };

  buttons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  const initial = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'de';
  setLanguage(initial, false);
})();
