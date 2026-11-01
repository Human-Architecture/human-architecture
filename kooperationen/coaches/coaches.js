(() => {
  const form = document.querySelector("#coachCollaborationForm");
  if (!form) return;
  const status = document.querySelector("#coachStatus");
  const button = form.querySelector('button[type="submit"]');
  const setPlaceholders = (language) => {
    form.querySelectorAll("[data-placeholder-de][data-placeholder-en]").forEach((field) => {
      field.placeholder = field.dataset[`placeholder${language === "en" ? "En" : "De"}`];
    });
  };
  setPlaceholders(document.documentElement.lang);
  document.querySelectorAll("[data-language]").forEach((control) => control.addEventListener("click", () => {
    window.setTimeout(() => setPlaceholders(control.dataset.language), 0);
  }));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const original = button.textContent;
    button.disabled = true;
    button.textContent = document.documentElement.lang === "en" ? "Sending …" : "Wird gesendet …";
    status.textContent = "";
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      data.chartAcknowledgement = form.elements.chartAcknowledgement.checked;
      data.locale = document.documentElement.lang;
      data.formType = "coach-collaboration";
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error);
      form.innerHTML = `<div class="coach-card"><p class="coach-step">HUMAN ARCHITECTURE · KOOPERATIONEN</p><h2>${document.documentElement.lang === "en" ? "Thank you. Your enquiry has arrived." : "Danke. Deine Anfrage ist eingegangen."}</h2><p>${result.message}</p></div>`;
      window.scrollTo({ top: form.offsetTop - 80, behavior: "smooth" });
    } catch (error) {
      status.textContent = error.message || (document.documentElement.lang === "en" ? "The form could not be sent right now. Please try again later." : "Das Formular konnte gerade nicht gesendet werden. Bitte versuche es später erneut.");
      button.disabled = false;
      button.textContent = original;
    }
  });
})();
