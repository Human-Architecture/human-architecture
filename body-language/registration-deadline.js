(() => {
  const target = document.querySelector('[data-registration-deadline]');
  const closesAt = window.BodyLanguageBooking?.booking_closes_at;
  if (!target || !closesAt) return;

  const close = new Date(closesAt);
  const update = () => {
    const remaining = close.getTime() - Date.now();
    if (remaining <= 0) {
      target.textContent = 'Die Online-Anmeldung ist geschlossen.';
      return;
    }

    const days = Math.ceil(remaining / 86400000);
    target.textContent = `Anmeldeschluss: 14. November 2026 · noch ${days} ${days === 1 ? 'Tag' : 'Tage'}`;
  };

  update();
  window.setInterval(update, 60000);
})();
