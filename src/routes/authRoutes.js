const express = require('express');
const passport = require('passport');
const { signAccessToken } = require('../utils/jwt')

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = signAccessToken(req.user);
    const isProd = process.env.IS_PRODUCTION;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: isProd,          // true en prod (HTTPS), false en local
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,  // 15 min
      path: "/",
    });

    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontend}/dashboard`);
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    const isProd = process.env.IS_PRODUCTION;

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    res.redirect('/');
  });
});

module.exports = router;