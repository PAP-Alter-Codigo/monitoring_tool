const express = require("express");
const { signAccessToken } = require("../utils/jwt");

const router = express.Router();

/**
 * POST /auth/dev-login
 * Body opcional: { "email": "dev@test.com", "name": "Dev User"}
 */
router.post("/dev-login", (req, res) => {
  if (process.env.IS_PRODUCTION === true) {
    return res.status(404).json({ message: "Not found" });
  }

  const { email, name } = req.body || {};
  const devUser = {
    id: email || "dev-user",
    email: email || "dev@test.com",
    name: name || "Dev User",
  };

  const token = signAccessToken(devUser);

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  return res.status(200).json({
    ok: true,
    user: { email: devUser.email, name: devUser.name },
  });
});

router.post("/dev-logout", (req, res) => {
  if (process.env.IS_PRODUCTION === true) {
    return res.status(404).json({ message: "Not found" });
  }

  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({ ok: true });
});

module.exports = router;
