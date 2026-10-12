const { BOOKING_CLOSES_AT, OPTIONS, ensureSchema, sql, sendEmail, formatAmount } = require('../lib/body-language-booking');

const links = Object.freeze({ member_single: 'https://www.paypal.com/ncp/payment/922D49UUV5ERJ', member_pair: 'https://www.paypal.com/ncp/payment/TST9KXP2UAW92', non_member_single: 'https://www.paypal.com/ncp/payment/HQBWX8D68LUSL', member_plus_non_member: 'https://www.paypal.com/ncp/payment/X8Y68TRRR3W5A', non_member_pair: 'https://www.paypal.com/ncp/payment/DV5E9YUFTCRLG' });

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ message: 'Method not allowed' }); }
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ message: 'Unauthorized' });
  if (new Date() > BOOKING_CLOSES_AT) return res.status(200).json({ sent: 0, closed: true });
  try {
    await ensureSchema();
    const query = sql();
    const rows = await query`SELECT * FROM body_language_bookings WHERE event_key='body-language-2026-11-28' AND status='payment_pending' AND ((payment_reminder_count=0 AND created_at <= now() - interval '24 hours') OR (payment_reminder_count=1 AND created_at <= now() - interval '120 hours')) AND (last_payment_reminder_at IS NULL OR last_payment_reminder_at <= now() - interval '23 hours') ORDER BY created_at ASC LIMIT 50`;
    let sent = 0;
    for (const booking of rows) {
      const english = booking.locale === 'en';
      const label = OPTIONS[booking.payment_option][english ? 'en' : 'de'];
      const amount = formatAmount(booking.amount_cents, booking.locale);
      const reference = booking.id.slice(0, 8).toUpperCase();
      const route = booking.payment_method === 'studio_cash'
        ? (english ? 'You chose cash payment at Clever Fit Amberg-Kümmersbruck. Please pay by 14 November 2026 and give your full name and booking reference at the studio.' : 'Du hast Barzahlung im Clever Fit Amberg-Kümmersbruck gewählt. Bitte bezahle bis einschließlich 14. November 2026 und nenne im Studio deinen vollständigen Namen und deine Buchungsreferenz.')
        : (english ? `You chose online payment. Complete it here: ${links[booking.payment_option]}` : `Du hast Online-Zahlung gewählt. Schließe sie hier ab: ${links[booking.payment_option]}`);
      const text = english ? `Hello ${booking.participant_name},\n\nwe have not yet been able to match a payment to your BODY LANGUAGE booking.\n\n${route}\n\nReference: ${reference}\nSelected option: ${label}\nAmount: ${amount}\n\nBookings and payments close on 14 November 2026. If you have already paid, you do not need to do anything; we will match it shortly.\n\nHuman Architecture®\nhello@human-architecture.info` : `Hallo ${booking.participant_name},\n\nwir konnten deiner BODY LANGUAGE Anmeldung bisher noch keine Zahlung zuordnen.\n\n${route}\n\nBuchungsreferenz: ${reference}\nGewählte Option: ${label}\nBetrag: ${amount}\n\nAnmeldungen und Zahlungen schließen am 14. November 2026. Wenn du bereits bezahlt hast, musst du nichts weiter tun; wir ordnen die Zahlung zeitnah zu.\n\nHuman Architecture®\nhello@human-architecture.info`;
      await sendEmail({ to: booking.email, subject: english ? 'BODY LANGUAGE: payment reminder' : 'BODY LANGUAGE: Erinnerung zu deiner Zahlung', text });
      await query`UPDATE body_language_bookings SET payment_reminder_count=payment_reminder_count+1,last_payment_reminder_at=now(),updated_at=now() WHERE id=${booking.id}::uuid AND status='payment_pending'`;
      sent += 1;
    }
    return res.status(200).json({ sent });
  } catch (error) {
    console.error('BODY LANGUAGE payment reminders failed', error);
    return res.status(500).json({ message: 'Reminder job failed' });
  }
};
