module.exports = async function handler(req, res) {
  res.setHeader('Allow', 'POST');
  return res.status(410).json({
    ok: false,
    error: 'This RETURN session has finished. Future dates are announced on the RETURN page.'
  });
};
