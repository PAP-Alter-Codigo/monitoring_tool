const Article = require('../models/article.js');

const getAll = async (req, res) => {
  try {
    const articles = await Article.getAll();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const article = await Article.getById(req.params.id);
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await Article.create(req.body);
    res.status(201).json({ message: 'Article created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    await Article.update(req.params.id, req.body);
    res.json({ message: 'Article updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await Article.remove(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};