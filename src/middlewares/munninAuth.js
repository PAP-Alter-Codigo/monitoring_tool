function munninAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== process.env.LAMBDA_API_KEY) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  req.user = { email: 'muninn-service', roles: ['service'] };
  next();
}

module.exports = { munninAuth };
