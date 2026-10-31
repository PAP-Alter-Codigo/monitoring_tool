const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articleController.js');
const { ensureAuthenticated } = require('../middlewares/auth');

/**
 * @swagger
 * /articles/search:
 *   get:
 *    tags: [Articles]
 *    description: |
 *      Search and filter articles with server-side pagination.
 *      All filter parameters are optional.
 *    parameters:
 *      - in: query
 *        name: page
 *        schema: { type: integer, default: 1 }
 *        description: 1-based page number
 *      - in: query
 *        name: limit
 *        schema: { type: integer, default: 20 }
 *        description: Items per page (max 100)
 *      - in: query
 *        name: startDate
 *        schema: { type: string, format: date }
 *        description: Lower bound (YYYY-MM-DD, inclusive)
 *      - in: query
 *        name: endDate
 *        schema: { type: string, format: date }
 *        description: Upper bound (YYYY-MM-DD, inclusive)
 *      - in: query
 *        name: headline
 *        schema: { type: string }
 *        description: Case-insensitive substring match on headline
 *      - in: query
 *        name: sourceName
 *        schema: { type: string }
 *        description: Exact match (case-insensitive)
 *      - in: query
 *        name: author
 *        schema: { type: string }
 *        description: Exact match (case-insensitive)
 *      - in: query
 *        name: coverageLevel
 *        schema: { type: string }
 *        description: Case-insensitive substring match
 *      - in: query
 *        name: paywall
 *        schema: { type: string, enum: [true, false] }
 *      - in: query
 *        name: origin
 *        schema: { type: string, enum: [user, muninn] }
 *      - in: query
 *        name: tags
 *        schema: { type: string }
 *        description: Comma-separated tag IDs (OR logic)
 *      - in: query
 *        name: actorsMentioned
 *        schema: { type: string }
 *        description: Comma-separated actor IDs (OR logic)
 *      - in: query
 *        name: location
 *        schema: { type: string }
 *        description: Location name substring (case-insensitive)
 *      - in: query
 *        name: export
 *        schema: { type: string, enum: [true] }
 *        description: When "true", returns all matching articles without pagination
 *    responses:
 *      '200':
 *        description: Paginated result ({ total, page, limit, totalPages, articles }) or array when export=true
 *      '500':
 *        description: Internal server error
 */
// NOTE: /search must be registered BEFORE /:id so Express does not treat "search" as an ID
router.get('/search', ensureAuthenticated, articlesController.getFiltered);

/**
 * @swagger
 * /articles:
 *   get:
 *    tags: [Articles]
 *    description: Get all articles (sorted newest-first). Supports optional ?limit=N query param.
 *    parameters:
 *      - in: query
 *        name: limit
 *        schema: { type: integer }
 *        description: Maximum number of articles to return
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
 *               location:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of Location IDs
 *               summary:
 *                 type: string
 *                 nullable: true
 *               relevance:
 *                 type: string
 *                 nullable: true
 *               why:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       '201':
 *         description: Article successfully created (origin set to "user" automatically)
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
 *               location:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of Location IDs
 *               summary:
 *                 type: string
 *                 nullable: true
 *               relevance:
 *                 type: string
 *                 nullable: true
 *               why:
 *                 type: string
 *                 nullable: true
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
