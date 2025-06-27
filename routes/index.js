const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const articlesRoutes = require('./articleRoutes');
const actorsRoutes = require('./actorRoutes');
const tagsRoutes = require('./tagRoutes');
const locationsRoutes = require('./locationRoutes');


router.use('/auth', authRoutes);
router.use('/articles', articlesRoutes);
router.use('/actors', actorsRoutes);
router.use('/tags', tagsRoutes);
router.use('/locations', locationsRoutes);

module.exports = router;