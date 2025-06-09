const Article = require('../models/article.js');

// Se usa en POST (create)
const isValidPublicationDate = (date) => typeof date === 'string';

const isValidSource = (source) =>
  source &&
  typeof source.name === 'string' &&
  typeof source.paywall === 'boolean' &&
  typeof source.headline === 'string' &&
  typeof source.url === 'string' &&
  typeof source.author === 'string' &&
  typeof source.coverageLevel === 'string';

const isValidActorsMentioned = (actors) => Array.isArray(actors);

const isValidTags = (tags) => Array.isArray(tags);

const isValidGeolocation = (geo) => typeof geo === 'string';

const isValidArticlePayload = (article) =>
  article &&
  isValidPublicationDate(article.publicationDate) &&
  isValidSource(article.source) &&
  isValidActorsMentioned(article.actorsMentioned) &&
  isValidTags(article.tags) &&
  isValidGeolocation(article.geolocation);

const getAll = async (req, res) => {
  try {
    const articles = await Article.scan().exec();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const article = await Article.get({ id: req.params.id });
    if (!article) {
      return res.status(404).json({ error: `Article with ID ${req.params.id} not found.` });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  
  try {
    const article = req.body;
  
    if (!isValidArticlePayload(article)) {
      return res.status(400).json({ error: 'Invalid article payload.' });
    }

    const exists = await Article.scan('source.url').eq(article.source.url).exec();
    if (exists && exists.length > 0) {
      return res.status(409).json({ error: `Article with URL ${article.source.url} already exists.` });
    }

    const newArticle = new Article({
      publicationDate: article.publicationDate,
      source: article.source,
      actorsMentioned: article.actorsMentioned,
      tags: article.tags,
      geolocation: article.geolocation
    });

    await newArticle.save();
    res.status(201).json({ message: 'Article successfully created.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  const id = req.params;
  const { publicationDate, source, actorsMentioned, tags, geolocation } = req.body;

  try {
    const existing = await Article.get({id});
    if (!existing) {
      return res.status(404).json({ error: `Article with ID ${id} not found.` });
    }

    const updateData = {}

    if (publicationDate) {
      if(!isValidPublicationDate(publicationDate)) {
        return res.status(400).json({ error: 'Invalid publicationDate.' });
      }
      updateData.publicationDate = publicationDate;
    }

    if (source) {
      if(!isValidSource(source)) {
        return res.status(400).json({ error: 'Invalid source.' });
      }
      updateData.source = source;
    }

    if (actorsMentioned) {
      if(!isValidActorsMentioned(actorsMentioned)) {
        return res.status(400).json({ error: 'Invalid actorsMentioned.' });
      }
      updateData.actorsMentioned = actorsMentioned;
    }

    if (tags) {
      if(!isValidTags(tags)) {
        return res.status(400).json({ error: 'Invalid tags.' });
      }
      updateData.tags = tags;
    }

    if (geolocation) {
      if(!isValidGeolocation(geolocation)) {
        return res.status(400).json({ error: 'Invalid geolocation.' });
      }
      updateData.geolocation = geolocation;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    await Article.update({id}, updateData);
    res.status(200).json({ message: 'Article successfully updated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Article.get({ id });
    if (!existing) {
      return res.status(404).json({ error: `Article with ID ${id} not found.` });
    }

    await Article.delete({ id });
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