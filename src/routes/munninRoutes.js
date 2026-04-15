const express = require('express');
const router = express.Router();
const { createFromMunnin } = require('../controllers/articleController.js');
const { munninAuth } = require('../middlewares/munninAuth.js');

/**
 * @swagger
 * /articles/munnin-post:
 *   post:
 *     tags: [Articles]
 *     description: Create a new article from the Munnin LLM tool. Resolves location and tag names to their corresponding IDs.
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicationDate
 *               - sourceName
 *               - headline
 *               - url
 *               - location
 *               - tags
 *             properties:
 *               publicationDate:
 *                 type: string
 *               sourceName:
 *                 type: string
 *               headline:
 *                 type: string
 *               url:
 *                 type: string
 *               author:
 *                 type: string
 *               coverageLevel:
 *                 type: string
 *               location:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                 description: Array of location names to resolve to IDs
 *               tags:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                 description: Array of tag names to resolve to IDs
 *               summary:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       '201':
 *         description: Article successfully created
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Invalid API key
 *       '409':
 *         description: Conflict - article with URL already exists
 *       '500':
 *         description: Internal server error
 */
router.post('/munnin-post', munninAuth, createFromMunnin);

module.exports = router;
