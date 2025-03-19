const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articleController.js');

router.get('/', articlesController.getAll);
router.get('/:id', articlesController.getById);
router.post('/', articlesController.create);
router.put('/:id', articlesController.update);
router.delete('/:id', articlesController.remove);

module.exports = router;