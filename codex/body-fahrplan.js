(() => {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang') === 'de' ? 'de' : 'en';
  const pick = element => element.dataset[lang] || element.textContent;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-de][data-en]').forEach(element => { element.textContent = pick(element); });
  document.querySelectorAll('[data-language-link]').forEach(link => {
    const next = lang === 'de' ? 'en' : 'de';
    link.href = `?lang=${next}`;
    link.textContent = next.toUpperCase();
  });
  document.title = lang === 'de' ? 'Body Fahrplan | Der Codex' : 'Body Fahrplan | The Codex';
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = lang === 'de'
    ? 'Body Fahrplan ist eine 12-wöchige, nicht-medizinische Kleingruppe für wiederkehrende Routine-Reibung und einen tragfähigen persönlichen Rahmen.'
    : 'Body Fahrplan is a 12-week, non-clinical small-group Codex for recurring routine friction and a more workable personal structure.';
})();
