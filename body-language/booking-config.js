/*
 * BODY LANGUAGE booking configuration
 * Update confirmed commercial details here before enabling payment.
 */
window.BodyLanguageBooking = {
  workshop_title_de: 'BODY LANGUAGE | KÖRPERSPRACHE',
  workshop_title_en: 'BODY LANGUAGE | KÖRPERSPRACHE',
  date: '2026-11-28',
  start_time: '15:00',
  end_time: '17:00',
  venue_name: 'Clever Fit Amberg-Kümmersbruck',
  venue_address: null,
  capacity: 12,
  // Operational contingency only. Never rendered to participants.
  internal_max_capacity: 15,
  price: null,
  prices: {
    member_single: 29,
    member_pair: 52.2,
    non_member_single: 49,
    member_plus_non_member: 70.2,
    non_member_pair: 88.2
  },
  currency: 'EUR',
  payment_provider: 'PayPal',
  payment_links: {
    member_single: 'https://www.paypal.com/ncp/payment/922D49UUV5ERJ',
    member_pair: 'https://www.paypal.com/ncp/payment/TST9KXP2UAW92',
    non_member_single: 'https://www.paypal.com/ncp/payment/HQBWX8D68LUSL',
    member_plus_non_member: 'https://www.paypal.com/ncp/payment/X8Y68TRRR3W5A',
    non_member_pair: 'https://www.paypal.com/ncp/payment/DV5E9YUFTCRLG'
  },
  booking_confirmation_email: 'hello@human-architecture.info',
  cancellation_policy_url: '/body-language/terms/#cancellation',
  privacy_policy_url: '/datenschutz/',
  terms_url: '/body-language/terms/',
  // Temporary operational route: payment is collected through PayPal's hosted links,
  // then matched and confirmed manually. Automatic confirmation remains off.
  status: 'manual_verification'
};
