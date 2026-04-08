const express = require('express');
const router = express.Router();
const sourceUrlController = require('../controllers/sourceUrlController.js');
const { ensureAuthenticated } = require('../middlewares/auth');

/**
 * @swagger
 * /source-urls:
 *   get:
 *     tags: [SourceUrls]
 *     description: Get all source URLs
 *     responses:
 *       '200':
 *         description: Array of source URL objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   source_url:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [rss, html]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       '500':
 *         description: Internal server error
 */
router.get('/', ensureAuthenticated, sourceUrlController.getAll);

/**
 * @swagger
 * /source-urls/{id}:
 *   get:
 *     tags: [SourceUrls]
 *     description: Get a source URL by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Source URL ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Source URL object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 source_url:
 *                   type: string
 *                 type:
 *                   type: string
 *                   enum: [rss, html]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       '404':
 *         description: Source URL not found
 *       '500':
 *         description: Internal server error
 */
router.get('/:id', ensureAuthenticated, sourceUrlController.getById);

/**
 * @swagger
 * /source-urls:
 *   post:
 *     tags: [SourceUrls]
 *     description: Create a new source URL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - source_url
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "BBC News RSS"
 *               source_url:
 *                 type: string
 *                 example: "https://feeds.bbci.co.uk/news/rss.xml"
 *               type:
 *                 type: string
 *                 enum: [rss, html]
 *                 example: "rss"
 *     responses:
 *       '201':
 *         description: Source URL successfully created
 *       '400':
 *         description: Missing or invalid fields
 *       '409':
 *         description: Source URL with that name or URL already exists
 *       '500':
 *         description: Internal server error
 */
router.post('/', sourceUrlController.create);

/**
 * @swagger
 * /source-urls/{id}:
 *   put:
 *     tags: [SourceUrls]
 *     description: Update an existing source URL
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Source URL ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "BBC News RSS"
 *               source_url:
 *                 type: string
 *                 example: "https://feeds.bbci.co.uk/news/rss.xml"
 *               type:
 *                 type: string
 *                 enum: [rss, html]
 *                 example: "rss"
 *     responses:
 *       '200':
 *         description: Source URL successfully updated
 *       '400':
 *         description: Invalid fields or no fields provided
 *       '404':
 *         description: Source URL not found
 *       '409':
 *         description: Another source URL with that name or URL already exists
 *       '500':
 *         description: Internal server error
 */
router.put('/:id', sourceUrlController.update);

/**
 * @swagger
 * /source-urls/{id}:
 *   delete:
 *     tags: [SourceUrls]
 *     description: Delete a source URL by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Source URL ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Source URL successfully deleted
 *       '404':
 *         description: Source URL not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/:id', sourceUrlController.remove);

module.exports = router;
