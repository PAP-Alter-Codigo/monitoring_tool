const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const devAuthRoutes = require('./devAuthRoutes');
const articlesRoutes = require('./articleRoutes');
const actorsRoutes = require('./actorRoutes');
const tagsRoutes = require('./tagRoutes');
const locationsRoutes = require('./locationRoutes');
const sourceUrlRoutes = require('./sourceUrlRoutes');
const munninRoutes = require('./munninRoutes');
const { authJwtCookie } = require('../middlewares/authJwt');
const { adminAllowlist } = require("../middlewares/adminAllowList");
const { apiKeyAuth } = require('../middlewares/apiKey');

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

router.use('/auth', authRoutes);
router.use('/auth', devAuthRoutes); // dev routes

// Munnin routes bypass global middleware (auth handled internally)
router.use('/articles', munninRoutes);

//MIDDLEWARE
router.use((req, res, next) => {
  if (req.headers['x-api-key']) {
    return apiKeyAuth(req, res, next);
  }
  return authJwtCookie(req, res, next);
});

router.use(
  adminAllowlist({
    allowedEmails: ADMIN_EMAILS,
  })
);

router.use('/articles', articlesRoutes);
router.use('/actors', actorsRoutes);
router.use('/tags', tagsRoutes);
router.use('/locations', locationsRoutes);
router.use('/source-urls', sourceUrlRoutes);

module.exports = router;