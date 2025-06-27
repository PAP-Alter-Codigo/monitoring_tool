const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articleController.js');
const { ensureAuthenticated } = require('../middlewares/auth');

/**
 * @swagger
 * /articles:
 *   get:
 *    tags: [Articles]
 *    description: Get all articles
 *    responses: 
 *      '200':
 *       description: Array of articles
 *      '500': 
 *       description: Internal server error
 */
router.get('/', ensureAuthenticated, articlesController.getAll);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     tags: [Articles]
 *     description: Get article by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Article ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Article object
 *       '404':
 *         description: Article not found
 *       '500':
 *         description: Internal server error
 */
router.get('/:id', ensureAuthenticated, articlesController.getById);

/** 
 * @swagger
 * /articles:
 *   post:
 *     tags: [Articles]
 *     description: Create a new article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicationDate:
 *                 type: string
 *               sourceName:
 *                 type: string
 *               paywall:
 *                 type: boolean
 *               headline:
 *                 type: string
 *               url:
 *                 type: string
 *               author:
 *                 type: string
 *               coverageLevel:
 *                 type: string
 *               actorsMentioned:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               geolocation:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Article successfully created
 *       '400':
 *         description: Bad request
 *       '409':
 *         description: Conflict - article with URL already exists
 *       '500':
 *         description: Internal server error
 */
router.post('/', articlesController.create);

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     tags: [Articles]
 *     description: Update an existing article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Article ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicationDate:
 *                 type: string
 *               sourceName:
 *                 type: string
 *               paywall:
 *                 type: boolean
 *               headline:
 *                 type: string
 *               url:
 *                 type: string
 *               author:
 *                 type: string
 *               coverageLevel:
 *                 type: string
 *               actorsMentioned:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               geolocation:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Article successfully updated
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Article not found
 *       '500':
 *         description: Internal server error
 */
router.put('/:id', articlesController.update);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     tags: [Articles]
 *     description: Delete article by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Article ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Article successfully deleted
 *       '404':
 *         description: Article not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/:id', articlesController.remove);

module.exports = router;