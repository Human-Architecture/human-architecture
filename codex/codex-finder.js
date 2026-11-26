document.addEventListener('DOMContentLoaded', () => {
  const finder = document.querySelector('.codex-finder');
  if (!finder) return;

  const choices = Array.from(finder.querySelectorAll('[data-codex-choice]'));
  const scopeChoices = Array.from(finder.querySelectorAll('[data-codex-scope]'));
  const results = Array.from(finder.querySelectorAll('[data-codex-result]'));
  const scope = finder.querySelector('.codex-finder__scope');
  const reset = finder.querySelector('[data-codex-reset]');
  const steps = Array.from(finder.querySelectorAll('.codex-finder__steps li'));
  let selectedChoice = null;
  let selectedScope = null;

  const orientation = finder.querySelector('[data-codex-result="orientation"]');
  const prompt = finder.querySelector('[data-codex-finder-prompt]');

  const updateSteps = (activeStep) => {
    steps.forEach((step, index) => {
      step.classList.toggle('is-current', index === activeStep - 1);
      step.classList.toggle('is-complete', index < activeStep - 1);
    });
  };

  const clearResults = () => {
    results.forEach((result) => {
      result.hidden = true;
    });
  };

  const showResult = () => {
    clearResults();
    if (!selectedChoice || !selectedScope) return;
    if (prompt) prompt.hidden = true;
    const resultKey = selectedScope === 'clarify' ? 'orientation' : selectedChoice;
    const result = resultKey === 'orientation'
      ? orientation
      : finder.querySelector(`[data-codex-result="${resultKey}"]`);
    if (result) result.hidden = false;
    if (reset) reset.hidden = false;
    updateSteps(3);
  };

  choices.forEach((choice) => {
    choice.addEventListener('click', () => {
      selectedChoice = choice.dataset.codexChoice;
      selectedScope = null;
      choices.forEach((item) => item.setAttribute('aria-pressed', String(item === choice)));
      scopeChoices.forEach((item) => item.setAttribute('aria-pressed', 'false'));
      clearResults();
      if (reset) reset.hidden = true;
      if (scope) scope.hidden = false;
      if (prompt) prompt.hidden = false;
      updateSteps(2);
      scope?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  scopeChoices.forEach((scopeChoice) => {
    scopeChoice.addEventListener('click', () => {
      if (!selectedChoice) return;
      selectedScope = scopeChoice.dataset.codexScope;
      scopeChoices.forEach((item) => item.setAttribute('aria-pressed', String(item === scopeChoice)));
      showResult();
      finder.querySelector('[data-codex-result]:not([hidden])')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  reset?.addEventListener('click', () => {
    selectedChoice = null;
    selectedScope = null;
    choices.forEach((item) => item.setAttribute('aria-pressed', 'false'));
    scopeChoices.forEach((item) => item.setAttribute('aria-pressed', 'false'));
    clearResults();
    if (scope) scope.hidden = true;
    if (prompt) prompt.hidden = true;
    reset.hidden = true;
    updateSteps(1);
    finder.querySelector('.codex-finder__question')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
