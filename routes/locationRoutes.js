const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locationController.js');

router.get('/', locationsController.getAll);
router.get('/:id', locationsController.getById);
router.post('/', locationsController.create);
router.put('/:id', locationsController.update);
router.delete('/:id', locationsController.remove);

module.exports = router;