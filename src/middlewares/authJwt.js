const jwt = require("jsonwebtoken");

function authJwtCookie(req, res, next) {
  try {
    const token = req.cookies?.access_token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      roles: payload.roles || [],
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

module.exports = {
  authJwtCookie,
};
