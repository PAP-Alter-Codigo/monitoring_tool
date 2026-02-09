// utils/jwt.js
const jwt = require("jsonwebtoken");

function signAccessToken(user) {
  // Ajusta estos campos a tu modelo real de usuario
  const payload = {
    sub: String(user.id || user._id || user.googleId || user.email),
    email: user.email,
    name: user.name || user.displayName,
    // roles: user.roles || [], // si manejas roles
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
}

module.exports = { signAccessToken };
