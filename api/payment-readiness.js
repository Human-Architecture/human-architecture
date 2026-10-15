const { paymentEnabled: codexBookingEnabled, secureIntakeConfigured } = require('../lib/codex-booking');

const isHttpsUrl = (value) => {
  try { return new URL(value || '').protocol === 'https:'; } catch { return false; }
};

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const databaseConfigured = Boolean(process.env.HA_POSTGRES_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL);
  const codex = codexBookingEnabled()
    && secureIntakeConfigured()
    && Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)
    && databaseConfigured;
  const returnRoutes = {
    dali: isHttpsUrl(process.env.RETURN_PAYMENT_URL_DALI),
    regular: isHttpsUrl(process.env.RETURN_PAYMENT_URL_REGULAR),
    friend_dd: isHttpsUrl(process.env.RETURN_PAYMENT_URL_FRIEND_DD),
    friend_rr: isHttpsUrl(process.env.RETURN_PAYMENT_URL_FRIEND_RR),
    friend_rd: isHttpsUrl(process.env.RETURN_PAYMENT_URL_FRIEND_RD)
  };
  const astrologyRoutes = {
    solo: isHttpsUrl(process.env.ASTROLOGY_PAYMENT_URL_SOLO),
    pair: isHttpsUrl(process.env.ASTROLOGY_PAYMENT_URL_PAIR)
  };

  return res.status(200).json({
    ok: true,
    codex: { directBookingAvailable: codex },
    bodyLanguage: { hostedPaymentLinksConfigured: true },
    return: { directPaymentAvailable: Object.values(returnRoutes).every(Boolean), routes: returnRoutes },
    astrology: { directPaymentAvailable: Object.values(astrologyRoutes).every(Boolean), routes: astrologyRoutes }
  });
};
