// utils/jwt.js
const jwt = require("jsonwebtoken");

function signAccessToken(user) {
  // Google OAuth profile uses emails[0].value; plain objects use email directly
  const email =
    user.email ??
    user.emails?.[0]?.value ??
    null;

  const payload = {
    sub: String(user.id || user._id || user.googleId || email),
    email,
    name: user.name || user.displayName,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
}

module.exports = { signAccessToken };
