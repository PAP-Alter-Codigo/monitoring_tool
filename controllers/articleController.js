const Article = require('../models/article.js');

const isValidId = (id) => Number.isInteger(Number(id));

// Se usa en POST (create)
const isValidArticlePayload = (article) =>
  article &&
  typeof article._articleId === 'number' &&
  typeof article.publicationDate === 'string' &&
  article.source &&
  typeof article.source.name === 'string' &&
  typeof article.source.paywall === 'boolean' &&
  typeof article.source.headline === 'string' &&
  typeof article.source.url === 'string' &&
  typeof article.source.author === 'string' &&
  typeof article.source.coverageLevel === 'string' &&
  Array.isArray(article.actorsMentioned) &&
  Array.isArray(article.tags) &&
  typeof article.geolocation === 'number';

// Se usa en PUT (update)
const isValidArticleUpdatePayload = (article) =>
  article &&
  article.source &&
  typeof article.source.name === 'string' &&
  typeof article.source.paywall === 'boolean' &&
  typeof article.source.headline === 'string' &&
  typeof article.source.url === 'string' &&
  typeof article.source.author === 'string' &&
  typeof article.source.coverageLevel === 'string' &&
  Array.isArray(article.actorsMentioned) &&
  Array.isArray(article.tags) &&
  typeof article.geolocation === 'number';

const getAll = async (req, res) => {
  try {
    const articles = await Article.getAll();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  const id = Number(req.params.id);
  const { publicationDate } = req.query;

  if (!isValidId(id) || !publicationDate) {
    return res.status(400).json({ error: 'Invalid or missing ID or publicationDate.' });
  }

  try {
    const article = await Article.getById(id, publicationDate);
    if (!article) {
      return res.status(404).json({ error: `Article with ID ${id} and publicationDate ${publicationDate} not found.` });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  const article = req.body;

  if (!isValidArticlePayload(article)) {
    return res.status(400).json({ error: 'Invalid article payload.' });
  }

  try {
    const exists = await Article.getById(article._articleId, article.publicationDate);
    if (exists) {
      return res.status(409).json({ error: `Article with ID ${article._articleId} and publicationDate ${article.publicationDate} already exists.` });
    }

    await Article.create(article);
    res.status(201).json({ message: 'Article successfully created.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  const id = Number(req.params.id);
  const { publicationDate } = req.query;
  const article = req.body;

  if (!isValidId(id) || !publicationDate || !isValidArticleUpdatePayload(article)) {
    return res.status(400).json({ error: 'Invalid input: check ID, publicationDate, or article structure.' });
  }

  try {
    const existing = await Article.getById(id, publicationDate);
    if (!existing) {
      return res.status(404).json({ error: `Article with ID ${id} and publicationDate ${publicationDate} not found.` });
    }

    await Article.update(id, publicationDate, article);
    res.status(200).json({ message: 'Article successfully updated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  const id = Number(req.params.id);
  const { publicationDate } = req.query;

  if (!isValidId(id) || !publicationDate) {
    return res.status(400).json({ error: 'Invalid or missing ID or publicationDate.' });
  }

  try {
    const existing = await Article.getById(id, publicationDate);
    if (!existing) {
      return res.status(404).json({ error: `Article with ID ${id} and publicationDate ${publicationDate} not found.` });
    }

    await Article.remove(id, publicationDate);
    res.status(200).json({ message: 'Article successfully deleted.' });
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