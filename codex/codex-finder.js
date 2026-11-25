document.addEventListener('DOMContentLoaded', () => {
  const finder = document.querySelector('.codex-finder');
  if (!finder) return;

  const choices = Array.from(finder.querySelectorAll('[data-codex-choice]'));
  const scopes = Array.from(finder.querySelectorAll('[data-codex-scope]'));
  const results = Array.from(finder.querySelectorAll('[data-codex-result]'));
  let selectedChoice = null;
  let selectedScope = null;

  const orientation = finder.querySelector('[data-codex-result="orientation"]');
  const prompt = finder.querySelector('[data-codex-finder-prompt]');

  const showResult = () => {
    results.forEach((result) => {
      result.hidden = true;
    });
    if (prompt) prompt.hidden = !(selectedChoice && !selectedScope);
    if (!selectedChoice || !selectedScope) return;
    if (prompt) prompt.hidden = true;
    if (selectedScope === 'clarify') {
      if (orientation) orientation.hidden = false;
      return;
    }
    const result = finder.querySelector(`[data-codex-result="${selectedChoice}"]`);
    if (result) result.hidden = false;
  };

  choices.forEach((choice) => {
    choice.addEventListener('click', () => {
      selectedChoice = choice.dataset.codexChoice;
      choices.forEach((item) => item.setAttribute('aria-pressed', String(item === choice)));
      showResult();
    });
  });

  scopes.forEach((scope) => {
    scope.addEventListener('click', () => {
      selectedScope = scope.dataset.codexScope;
      scopes.forEach((item) => item.setAttribute('aria-pressed', String(item === scope)));
      showResult();
    });
  });
});
