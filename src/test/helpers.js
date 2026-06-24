const jwt = require('jsonwebtoken');
const authJwtModule = require('../middlewares/authJwt');
const apiKeyModule = require('../middlewares/apiKey');
const adminAllowlistModule = require('../middlewares/adminAllowList');

function createTestToken(email = 'test@admin.com', name = 'Test Admin') {
  const payload = {
    sub: email,
    email,
    name,
  };
  return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '15m',
  });
}

function mockAuthMiddleware(sandbox, adminEmail = 'test@admin.com') {
  // Mock authJwtCookie to auto-authenticate
  sandbox.stub(authJwtModule, 'authJwtCookie').callsFake((req, res, next) => {
    req.user = {
      sub: adminEmail,
      email: adminEmail,
      name: 'Test Admin',
      roles: [],
    };
    next();
  });

  // Mock apiKeyAuth
  sandbox.stub(apiKeyModule, 'apiKeyAuth').callsFake((req, res, next) => {
    req.user = { email: 'lambda-service', roles: ['service'] };
    next();
  });

  // Mock adminAllowlist to always allow
  sandbox.stub(adminAllowlistModule, 'adminAllowlist').returns((req, res, next) => {
    next();
  });
}

module.exports = {
  createTestToken,
  mockAuthMiddleware,
};
