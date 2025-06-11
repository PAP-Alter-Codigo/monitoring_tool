const express = require('express');
const router = express.Router();
const actorsController = require('../controllers/actorController.js');


/**
 * @swagger
 * /actors:
 *   get:
 *    tags: [Actors]
 *    description: Get all actors
 *    responses: 
 *      '200':
 *       description: Array of actors
 *      '500': 
 *       description: Internal server error
 * 
 */
router.get('/', actorsController.getAll);

/**
 * @swagger
 * /actors/{id}:
 *   get:
 *    tags: [Actors]
 *    description: Get actor by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Actor ID
 *        schema:
 *          type: string
 *    responses: 
 *      '200':
 *       description: Actor object
 *      '404':
 *       description: Actor not found
 *      '500': 
 *       description: Internal server error
 */
router.get('/:id', actorsController.getById);

/**
 * @swagger
 * /actors:
 *   post:
 *    tags: [Actors]
 *    description: Create a new actor
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              tagId:
 *                type: string
 *              articleIds:
 *                type: array
 *                items:
 *                  type: string
 *    responses: 
 *      '201':
 *       description: Actor successfully created
 *      '400':
 *       description: Invalid or incomplete payload
 *      '422':
 *       description: Validation error
 *      '500': 
 *       description: Internal server error
 */
router.post('/', actorsController.create);

/**
 * @swagger
 * /actors/{id}:
 *   put:
 *    tags: [Actors]
 *    description: Update an existing actor
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Actor ID
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              tagId:
 *                type: string
 *              articleIds:
 *                type: array
 *                items:
 *                  type: string
 *    responses: 
 *      '200':
 *       description: Actor successfully updated
 *      '404':
 *       description: Actor not found
 *      '500': 
 *       description: Internal server error
 */
router.put('/:id', actorsController.update);

/**
 * @swagger
 * /actors/{id}:
 *   delete:
 *    tags: [Actors]
 *    description: Delete actor by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Actor ID
 *        schema:
 *          type: string
 *    responses: 
 *      '200':
 *       description: Actor successfully deleted
 *      '404':
 *       description: Actor not found
 *      '500': 
 *       description: Internal server error
 */
router.delete('/:id', actorsController.remove);

module.exports = router;