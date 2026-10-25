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
    ? 'Body Fahrplan ist ein nicht-medizinischer Reflexions- und Strukturraum für wiederkehrende Routine-Reibung, auf Anfrage.'
    : 'Body Fahrplan is a non-clinical reflection and planning format for recurring routine friction, delivered by enquiry.';
})();
