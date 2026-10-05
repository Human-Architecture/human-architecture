const { Resend } = require('resend');

const clean = (value, max = 600) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const validTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
const safePaymentUrl = (value) => {
  if (!value) return '';
  try { const url = new URL(value); return url.protocol === 'https:' ? url.toString() : ''; } catch { return ''; }
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ok:false,error:'Method not allowed'}); }
  const body = req.body || {};
  if (body.website) return res.status(200).json({ok:true});

  const option = clean(body.bookingOption, 10);
  const pair = option === 'pair';
  const firstName = clean(body.firstName, 80);
  const lastName = clean(body.lastName, 80);
  const email = clean(body.email, 180);
  const phone = clean(body.phone, 80);
  const birthDate = clean(body.birthDate, 10);
  const birthTimeUnknown = body.birthTimeUnknown === true;
  const birthTime = birthTimeUnknown ? 'unbekannt' : clean(body.birthTime, 5);
  const birthPlace = clean(body.birthPlace, 180);
  const language = body.language === 'en' ? 'en' : 'de';

  const friend = {
    firstName: clean(body.friendFirstName, 80),
    lastName: clean(body.friendLastName, 80),
    email: clean(body.friendEmail, 180),
    birthDate: clean(body.friendBirthDate, 10),
    birthTimeUnknown: body.friendBirthTimeUnknown === true,
    birthTime: body.friendBirthTimeUnknown === true ? 'unbekannt' : clean(body.friendBirthTime, 5),
    birthPlace: clean(body.friendBirthPlace, 180)
  };

  const participantOneValid = firstName && lastName && validEmail(email) && validDate(birthDate) && birthPlace && (birthTimeUnknown || validTime(birthTime));
  const participantTwoValid = !pair || (friend.firstName && friend.lastName && validEmail(friend.email) && validDate(friend.birthDate) && friend.birthPlace && (friend.birthTimeUnknown || validTime(friend.birthTime)) && body.friendConsent === true);
  if (!['solo','pair'].includes(option) || !participantOneValid || !participantTwoValid || body.privacy !== true) {
    return res.status(400).json({ok:false,error:'Required fields missing'});
  }
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ok:false,error:'Delivery unavailable'});

  const amount = pair ? '360,00 € gesamt · 180,00 € p. P.' : '220,00 €';
  const optionLabel = pair ? 'Bring a Friend · 2 Personen' : 'Regulär · 1 Person';
  const dates = '29.11.2026 · 06.12.2026 · 13.12.2026 · 20.12.2026';
  const notification = [
    'ADVENT OF ASTROLOGY · COURSE REGISTRATION',
    'Course: Westliche Astrologie verstehen · Advent 2026',
    `Dates: ${dates}`,
    'Format: 4 × 90 minutes · Live Online',
    `Booking: ${optionLabel}`,
    `Amount: ${amount}`,
    `Participant 1: ${firstName} ${lastName}`,
    `Email 1: ${email}`,
    `Phone: ${phone || '—'}`,
    `Birth data 1: ${birthDate} · ${birthTime} · ${birthPlace}`,
    ...(pair ? [
      `Participant 2: ${friend.firstName} ${friend.lastName}`,
      `Email 2: ${friend.email}`,
      `Birth data 2: ${friend.birthDate} · ${friend.birthTime} · ${friend.birthPlace}`,
      'Participant 2 consent confirmed by participant 1: yes'
    ] : []),
    `Language: ${language === 'en' ? 'English' : 'German'}`,
    'Privacy consent: yes',
    'Purpose of birth data: preparation of natal chart as course learning material.',
    'Status: registration received; place NOT confirmed until payment is confirmed.'
  ].join('\n\n');

  const confirmation = (name, secondParticipant = false) => language === 'en'
    ? `Hello ${name},\n\nwe received ${secondParticipant ? 'your joint' : 'your'} registration for ADVENT OF ASTROLOGY · Understand Western Astrology.\n\nDates: ${dates}\nFormat: 4 × 90 minutes · Live Online\nBooking: ${optionLabel}\nAmount: ${amount}\n\nYour place is secured once payment has been completed and confirmed. If no direct payment link opens, we will send the payment route separately.\n\nAfter payment confirmation, you will receive the course confirmation. The specific live-online access, preparation information, digital workbook delivery, temporary recording-access details and support contact will be sent before the first session.\n\nYour birth details are used solely to prepare your natal chart as course learning material.\n\nHuman Architecture®\nhello@human-architecture.info`
    : `Hallo ${name},\n\nwir haben ${secondParticipant ? 'eure gemeinsame' : 'deine'} Anmeldung für ADVENT OF ASTROLOGY · Westliche Astrologie verstehen erhalten.\n\nTermine: ${dates}\nFormat: 4 × 90 Minuten · Live Online\nBuchung: ${optionLabel}\nBetrag: ${amount}\n\nDein Platz ist gesichert, sobald die Zahlung abgeschlossen und bestätigt wurde. Falls sich kein direkter Zahlungslink öffnet, senden wir den Zahlungsweg separat.\n\nNach bestätigter Zahlung erhältst du die Kursbestätigung. Der konkrete Live-Online-Zugang, Vorbereitung, die Zustellung des digitalen Workbooks, Informationen zum temporären Aufzeichnungszugriff und der Supportkontakt folgen rechtzeitig vor dem ersten Termin.\n\nDeine Geburtsdaten werden ausschließlich zur Vorbereitung deines Geburtshoroskops als Lernmaterial für den Kurs verwendet.\n\nHuman Architecture®\nhello@human-architecture.info`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: notificationError } = await resend.emails.send({
      from: 'Human Architecture Website <website@human-architecture.info>',
      to: ['hello@human-architecture.info'],
      replyTo: email,
      subject: `Astrologie-Kurs Anmeldung · ${firstName} ${lastName} · ${optionLabel}`,
      text: notification
    });
    if (notificationError) throw new Error(notificationError.message || 'Email failed');

    const { error: primaryError } = await resend.emails.send({
      from: 'Human Architecture <hello@human-architecture.info>',
      to: [email],
      replyTo: 'hello@human-architecture.info',
      subject: language === 'en' ? 'We received your astrology course registration' : 'Deine Anmeldung zum Astrologie-Kurs ist eingegangen',
      text: confirmation(firstName, pair)
    });
    if (primaryError) console.error('Astrology course acknowledgement failed', primaryError);

    if (pair) {
      const { error: friendError } = await resend.emails.send({
        from: 'Human Architecture <hello@human-architecture.info>',
        to: [friend.email],
        replyTo: 'hello@human-architecture.info',
        subject: language === 'en' ? 'Your joint astrology course registration' : 'Eure gemeinsame Anmeldung zum Astrologie-Kurs',
        text: confirmation(friend.firstName, true)
      });
      if (friendError) console.error('Astrology course friend acknowledgement failed', friendError);
    }

    const paymentUrl = safePaymentUrl(pair ? process.env.ASTROLOGY_PAYMENT_URL_PAIR : process.env.ASTROLOGY_PAYMENT_URL_SOLO);
    return res.status(200).json({ok:true,paymentUrl:paymentUrl || undefined,paymentConfigured:Boolean(paymentUrl)});
  } catch (error) {
    console.error('Astrology course registration failed', error);
    return res.status(500).json({ok:false,error:'Delivery failed'});
  }
};
