const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const devAuthRoutes = require('./devAuthRoutes');
const articlesRoutes = require('./articleRoutes');
const actorsRoutes = require('./actorRoutes');
const tagsRoutes = require('./tagRoutes');
const locationsRoutes = require('./locationRoutes');
const { authJwtCookie } = require('../middlewares/authJwt');
const { adminAllowlist } = require("../middlewares/adminAllowList");

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

router.use('/auth', authRoutes);
router.use('/auth', devAuthRoutes); // dev routes

//MIDDLEWARE
router.use(authJwtCookie);

router.use(
  adminAllowlist({
    allowedEmails: ADMIN_EMAILS,
  })
);

router.use('/articles', articlesRoutes);
router.use('/actors', actorsRoutes);
router.use('/tags', tagsRoutes);
router.use('/locations', locationsRoutes);

module.exports = router;