const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locationController.js');

/**
 * @swagger
 * /locations:
 *   get:
 *     tags: [Locations]
 *     description: Get all locations
 *     responses:
 *       '200':
 *         description: Array of locations
 *       '500':
 *         description: Internal server error
 */
router.get('/', locationsController.getAll);

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     tags: [Locations]
 *     description: Get location by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Location ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Location object
 *       '404':
 *         description: Location not found
 *       '500':
 *         description: Internal server error
 */
router.get('/:id', locationsController.getById);

/**
 * @swagger
 * /locations:
 *   post:
 *     tags: [Locations]
 *     description: Create a new location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       '201':
 *         description: Location successfully created
 *       '400':
 *         description: Bad request
 *       '409':
 *         description: Conflict - location with name already exists
 *       '500':
 *         description: Internal server error
 */
router.post('/', locationsController.create);

/**
 * @swagger
 * /locations/{id}:
 *   put:
 *     tags: [Locations]
 *     description: Update an existing location
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Location ID
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
 *               type:
 *                 type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       '200':
 *         description: Location successfully updated
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Location not found
 *       '500':
 *         description: Internal server error
 */
router.put('/:id', locationsController.update);

/**
 * @swagger
 * /locations/{id}:
 *   delete:
 *     tags: [Locations]
 *     description: Delete location by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Location ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Location successfully deleted
 *       '404':
 *         description: Location not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/:id', locationsController.remove);

module.exports = router;