const ALLOWED_METHODS = ['GET', 'HEAD', 'OPTIONS'];

function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== process.env.LAMBDA_API_KEY) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  if (!ALLOWED_METHODS.includes(req.method)) {
    return res.status(403).json({ message: 'API key only allows read-only operations' });
  }

  req.user = { email: 'lambda-service', roles: ['service'] };
  next();
}

module.exports = { apiKeyAuth };
