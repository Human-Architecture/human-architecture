document.addEventListener('DOMContentLoaded', () => {
  const lead = document.querySelector('.events-lead');
  if (!lead || document.querySelector('.events-orientation')) return;

  lead.textContent = 'These are live entry points into Human Architecture and Mihira Ceremonia: spaces to meet the work in practice, with a clear date, setting and next step. Each event below is confirmed and ready to reserve.';

  const orientation = document.createElement('section');
  orientation.className = 'events-orientation';
  orientation.setAttribute('aria-label', 'How to use this page');
  orientation.innerHTML = `
    <div><strong>01 / CHOOSE</strong><span>Find the format that fits your present question, body or curiosity.</span></div>
    <div><strong>02 / REVIEW</strong><span>Open the event page for the full introduction, timing, place and participation details.</span></div>
    <div><strong>03 / RESERVE</strong><span>Book directly where a payment route is available, or give the experience as a voucher.</span></div>`;
  lead.insertAdjacentElement('afterend', orientation);
});
