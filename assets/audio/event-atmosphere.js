(() => {
  const controls = document.querySelectorAll('[data-event-sound]');
  controls.forEach((control) => {
    const audio = document.querySelector(control.dataset.eventSound);
    const label = control.querySelector('[data-event-sound-label]');
    if (!audio || !label) return;

    const language = document.documentElement.lang.toLowerCase().startsWith('de') ? 'de' : 'en';
    audio.volume = Math.min(Math.max(Number(control.dataset.soundVolume || 0.05), 0), 1);
    const copy = language === 'de'
      ? { begin: 'Mit Klang beginnen', off: 'Klang aus' }
      : { begin: 'Begin with sound', off: 'Sound off' };
    const setState = (playing) => {
      control.setAttribute('aria-pressed', String(playing));
      control.classList.toggle('is-playing', playing);
      label.textContent = playing ? copy.off : copy.begin;
    };

    control.addEventListener('click', async () => {
      if (audio.paused) {
        try {
          await audio.play();
          setState(true);
        } catch {
          setState(false);
        }
      } else {
        audio.pause();
        setState(false);
      }
    });
  });
})();
