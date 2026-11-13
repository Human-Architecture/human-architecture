document.addEventListener('DOMContentLoaded', () => {
  const finder = document.querySelector('.codex-finder');
  if (!finder) return;

  const choices = Array.from(finder.querySelectorAll('[data-codex-choice]'));
  const results = Array.from(finder.querySelectorAll('[data-codex-result]'));

  choices.forEach((choice) => {
    choice.addEventListener('click', () => {
      const selected = choice.dataset.codexChoice;
      choices.forEach((item) => item.setAttribute('aria-pressed', String(item === choice)));
      results.forEach((result) => {
        result.hidden = result.dataset.codexResult !== selected;
      });
    });
  });
});
