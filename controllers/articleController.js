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
  const { id } = req.params;
  const { publicationDate } = req.query; 
  const article = req.body;

  if (!publicationDate) {
    return res.status(400).json({ error: "publicationDate es obligatorio" });
  }

  try {
    await Article.update(id, publicationDate, article);
    res.json({ message: "Artículo actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const remove = async (req, res) => {
  const { id } = req.params;
  const { publicationDate } = req.query; 

  if (!publicationDate) {
    return res.status(400).json({ error: "publicationDate es obligatorio" });
  }

  try {
    await Article.remove(id, publicationDate);
    res.json({ message: "Artículo eliminado correctamente" });
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
