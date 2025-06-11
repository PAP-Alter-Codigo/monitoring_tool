const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tagController.js');

/**
 * @swagger
 * /tags:
 *   get:
 *     tags: [Tags]
 *     description: Get all tags
 *     responses:
 *       '200':
 *         description: Array of tags
 *       '500':
 *         description: Internal server error
 */
router.get('/', tagsController.getAll);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     tags: [Tags]
 *     description: Get tag by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Tag ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tag object
 *       '404':
 *         description: Tag not found
 *       '500':
 *         description: Internal server error
 */
router.get('/:id', tagsController.getById);

/**
 * @swagger
 * /tags:
 *   post:
 *     tags: [Tags]
 *     description: Create a new tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Tag successfully created
 *       '400':
 *         description: Invalid or incomplete payload for creating tag
 *       '500':
 *         description: Internal server error
 */ 
router.post('/', tagsController.create);

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     tags: [Tags]
 *     description: Update an existing tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Tag ID
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
 *     responses:
 *       '200':
 *         description: Tag successfully updated
 *       '400':
 *         description: Invalid or incomplete payload for updating tag
 *       '404':
 *         description: Tag not found
 *       '500':
 *         description: Internal server error
 */
router.put('/:id', tagsController.update);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     tags: [Tags]
 *     description: Delete a tag by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Tag ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tag successfully deleted
 *       '404':
 *         description: Tag not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/:id', tagsController.remove);

module.exports = router;
