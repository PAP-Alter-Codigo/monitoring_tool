const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tagsController.js');

router.get('/', tagsController.getAll);
router.get('/:id', tagsController.getById);
router.post('/', tagsController.create);
router.put('/:id', tagsController.update);
router.delete('/:id', tagsController.remove);

module.exports = router;