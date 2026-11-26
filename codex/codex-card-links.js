document.addEventListener('DOMContentLoaded', () => {
  const groups = ['#readings', '#rhythm-programmes', '#deeper-codices'];

  groups.forEach((selector) => {
    document.querySelectorAll(`${selector} .ha-card`).forEach((card) => {
      const link = Array.from(card.children).find((child) => child.tagName === 'A' && child.href);
      if (!link) return;

      card.classList.add('ha-card--clickable');
      card.addEventListener('click', (event) => {
        if (event.target.closest('a, button, input, select, textarea, summary')) return;
        link.click();
      });
    });
  });
});
