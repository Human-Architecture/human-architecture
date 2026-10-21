const event = {
  title: 'BODY LANGUAGE | KÖRPERSPRACHE',
  date: 'Saturday, 28 November 2026',
  dateDe: 'Samstag, 28. November 2026',
  time: '15:00–17:00',
  venue: 'Clever Fit Kümmersbruck',
  contact: 'hello@human-architecture.info',
  terms: 'https://www.human-architecture.info/body-language/terms/'
};

const participantName = booking => booking.participantName || booking.name || 'there';

function received(booking) {
  const english = booking.locale === 'en';
  const name = participantName(booking);
  return {
    subject: english ? 'We received your BODY LANGUAGE booking details' : 'Deine BODY LANGUAGE Buchungsdaten sind eingegangen',
    text: english
      ? `Hello ${name},\n\nwe received your booking details for ${event.title}.\n\n${event.date} · ${event.time}\n${event.venue}\nSelected payment: ${booking.paymentLabel || '—'}${booking.amount ? ` · ${booking.amount}` : ''}\n\nThis is not yet a booking confirmation. Your place is confirmed once we can match the selected payment to your booking.\n\nParticipation and cancellation information: ${event.terms}\n\nHuman Architecture®\n${event.contact}`
      : `Hallo ${name},\n\nwir haben deine Buchungsdaten für ${event.title} erhalten.\n\n${event.dateDe} · ${event.time} Uhr\n${event.venue}\nGewählte Zahlungsoption: ${booking.paymentLabel || '—'}${booking.amount ? ` · ${booking.amount}` : ''}\n\nDies ist noch keine Buchungsbestätigung. Dein Platz ist erst bestätigt, sobald wir die gewählte Zahlung deiner Buchung zuordnen können.\n\nTeilnahme- und Stornoinformationen: ${event.terms}\n\nHuman Architecture®\n${event.contact}`
  };
}

function confirmed(booking) {
  const english = booking.locale === 'en';
  const name = participantName(booking);
  return {
    subject: english ? 'Your BODY LANGUAGE place is confirmed' : 'Dein BODY LANGUAGE Platz ist bestätigt',
    text: english
      ? `Hello ${name},\n\nyour payment has been matched and your place is confirmed.\n\n${event.title}\n${event.date} · ${event.time}\n${event.venue}\nPayment: ${booking.paymentLabel || '—'}${booking.amount ? ` · ${booking.amount}` : ''}\n\nThe workshop includes guided, adaptable movement. You can adjust or skip any exercise and never have to perform for the group. Please arrive a few minutes early in comfortable clothes.\n\nYou may transfer your place to another person. If you cancel in writing at least 7 calendar days before the workshop begins, we refund 70% of the amount paid. After that deadline, refunds are not possible.\n\nParticipation and cancellation information: ${event.terms}\nQuestions: ${event.contact}\n\nHuman Architecture®`
      : `Hallo ${name},\n\ndeine Zahlung wurde bestätigt und dein Platz ist verbindlich für dich reserviert.\n\n${event.title}\n${event.dateDe} · ${event.time} Uhr\n${event.venue}\nZahlungsoption: ${booking.paymentLabel || '—'}${booking.amount ? ` · ${booking.amount}` : ''}\n\nDer Workshop enthält angeleitete, anpassbare Bewegung. Du kannst jede Übung anpassen oder auslassen und musst nichts vor der Gruppe vorführen. Komm bitte ein paar Minuten früher in bequemer Kleidung.\n\nDu kannst deinen Platz an eine andere Person übertragen. Bei schriftlicher Absage bis spätestens 7 Kalendertage vor Workshopbeginn erstatten wir 70 % des gezahlten Betrags. Danach ist keine Rückerstattung möglich.\n\nTeilnahme- und Stornoinformationen: ${event.terms}\nFragen: ${event.contact}\n\nHuman Architecture®`
  };
}

module.exports = { received, confirmed };
