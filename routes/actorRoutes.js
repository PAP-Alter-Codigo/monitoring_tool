const express = require('express');
const router = express.Router();
const actorsController = require('../controllers/actorController.js');

router.get('/', actorsController.getAll);
router.get('/:id', actorsController.getById);
router.post('/', actorsController.create);
router.put('/:id', actorsController.update);
router.delete('/:id', actorsController.remove);

module.exports = router;