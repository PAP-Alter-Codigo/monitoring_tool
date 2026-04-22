const Article = require('../models/article.js');
const Location = require('../models/location.js');
const Tag = require('../models/tag.js');

// Se usa en POST (create)
const isValidPublicationDate = (date) => typeof date === 'string';

const isValidSourceName = (name) => typeof name === 'string';
const isValidPaywall = (paywall) => typeof paywall === 'boolean';
const isValidHeadline = (headline) => typeof headline === 'string';
const isValidUrl = (url) => typeof url === 'string';
const isValidAuthor = (author) => typeof author === 'string';
const isValidCoverageLevel = (coverageLevel) => typeof coverageLevel === 'string';

const isValidActorsMentioned = (actors) => Array.isArray(actors);

const isValidTags = (tags) => Array.isArray(tags);

const isValidLocation = (location) => Array.isArray(location) && location.every(id => typeof id === 'string');


const validateArticlePayload = (article) => {
  if (!article) return 'Article payload is missing.';
  if (!isValidPublicationDate(article.publicationDate)) return 'Invalid publicationDate.';
  if (!isValidSourceName(article.sourceName)) return 'Invalid sourceName.';
  if (!isValidPaywall(article.paywall)) return 'Invalid paywall.';
  if (!isValidHeadline(article.headline)) return 'Invalid headline.';
  if (!isValidUrl(article.url)) return 'Invalid url.';
  if (!isValidAuthor(article.author)) return 'Invalid author.';
  if (!isValidCoverageLevel(article.coverageLevel)) return 'Invalid coverageLevel.';
  if (!isValidActorsMentioned(article.actorsMentioned)) return 'Invalid actorsMentioned.';
  if (!isValidTags(article.tags)) return 'Invalid tags.';
  if (article.location !== undefined && !isValidLocation(article.location)) return 'Invalid location.';
  return null;
};

const populateLocations = async (article) => {
  const plain = JSON.parse(JSON.stringify(article));
  const locationIds = plain.location || [];
  const locations = await Promise.all(
    locationIds.map(id => Location.get({ id }).catch(() => null))
  );
  plain.location = locations.filter(Boolean);
  return plain;
};

const parseDate = (dateStr) => {
  if (!dateStr) return 0;
  const [day, month, year] = dateStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
};

const getAll = async (req, res) => {
  try {
    const articles = await Article.scan().exec();
    const populated = await Promise.all(articles.map(populateLocations));
    populated.sort((a, b) => parseDate(b.publicationDate) - parseDate(a.publicationDate));
    res.status(200).json(populated);
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
    const populated = await populateLocations(article);
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const create = async (req, res) => {
  try {
    const article = req.body;
  
    const validationError = validateArticlePayload(article);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const exists = await Article.query('url').eq(article.url).exec();
    if (exists && exists.length > 0) {
      return res.status(409).json({ error: `Article with URL ${article.url} already exists.` });
    }

    const newArticle = new Article({
      publicationDate: article.publicationDate,
      sourceName: article.sourceName,
      paywall: typeof article.paywall === 'boolean' ? article.paywall : false,
      headline: article.headline,
      url: article.url,
      author: article.author || '',
      coverageLevel: article.coverageLevel || '',
      actorsMentioned: article.actorsMentioned,
      tags: article.tags,
      location: article.location || [],
      origin: 'user',
      ...(article.summary !== undefined && { summary: article.summary }),
    });

    await newArticle.save();
    res.status(201).json({ message: 'Article successfully created.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { publicationDate, sourceName, paywall, headline, url, author, coverageLevel, actorsMentioned, tags, location, summary } = req.body;

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

    if(sourceName) {
      if(!isValidSourceName(sourceName)) {
        return res.status(400).json({ error: 'Invalid sourceName.' });
      }
      updateData.sourceName = sourceName;
    }

    if (paywall !== undefined) {
      if(!isValidPaywall(paywall)) {
        return res.status(400).json({ error: 'Invalid paywall.' });
      }
      updateData.paywall = paywall;
    }

    if (headline) {
      if(!isValidHeadline(headline)) {  
        return res.status(400).json({ error: 'Invalid headline.' });
      }
      updateData.headline = headline;
    }

    if (url) {
      if(!isValidUrl(url)) {
        return res.status(400).json({ error: 'Invalid url.' });
      }
      updateData.url = url;
    }

    if (author) {
      if(!isValidAuthor(author)) {
        return res.status(400).json({ error: 'Invalid author.' });
      }
      updateData.author = author;
    }

    if (coverageLevel) {
      if(!isValidCoverageLevel(coverageLevel)) {
        return res.status(400).json({ error: 'Invalid coverageLevel.' });
      }
      updateData.coverageLevel = coverageLevel;
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

    if (location !== undefined) {
      if (!isValidLocation(location)) {
        return res.status(400).json({ error: 'Invalid location. Must be an array of strings.' });
      }
      updateData.location = location;
    }

    if (summary !== undefined) {
      if (typeof summary !== 'string') {
        return res.status(400).json({ error: 'Invalid summary.' });
      }
      updateData.summary = summary;
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

const formatName = (name) => name.trim().toUpperCase().replace(/ /g, '_');

const resolveLocationIds = async (locationNames) => {
  const results = await Promise.all(
    locationNames.map(({ name }) =>
      Location.scan('name').eq(formatName(name)).exec()
    )
  );
  locationNames.forEach(({ name }, i) => {
    if (!results[i] || results[i].length === 0) {
      console.warn(`[muninn] Location not found in DB — skipped: "${name}" (normalized: "${formatName(name)}")`);
    }
  });
  return results.flat().map(l => l.id);
};

const resolveTagIds = async (tagNames) => {
  const results = await Promise.all(
    tagNames.map(({ name }) =>
      Tag.scan('name').eq(formatName(name)).exec()
    )
  );
  tagNames.forEach(({ name }, i) => {
    if (!results[i] || results[i].length === 0) {
      console.warn(`[muninn] Tag not found in DB — skipped: "${name}" (normalized: "${formatName(name)}")`);
    }
  });
  return results.flat().map(t => t.id);
};

const validateMunninPayload = (article) => {
  if (!article) return 'Article payload is missing.';
  if (!isValidPublicationDate(article.publicationDate)) return 'Invalid publicationDate.';
  if (!isValidSourceName(article.sourceName)) return 'Invalid sourceName.';
  if (!isValidHeadline(article.headline)) return 'Invalid headline.';
  if (!isValidUrl(article.url)) return 'Invalid url.';
  if (!Array.isArray(article.location)) return 'Invalid location. Must be an array of { name } objects.';
  if (!Array.isArray(article.tags)) return 'Invalid tags. Must be an array of { name } objects.';
  return null;
};

const createFromMunnin = async (req, res) => {
  try {
    const article = req.body;

    const validationError = validateMunninPayload(article);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const exists = await Article.query('url').eq(article.url).exec();
    if (exists && exists.length > 0) {
      return res.status(409).json({ error: `Article with URL ${article.url} already exists.` });
    }

    const [locationIds, tagIds] = await Promise.all([
      resolveLocationIds(article.location),
      resolveTagIds(article.tags),
    ]);

    const newArticle = new Article({
      publicationDate: article.publicationDate,
      sourceName: article.sourceName,
      paywall: false,
      headline: article.headline,
      url: article.url,
      author: article.author || '',
      coverageLevel: article.coverageLevel || '',
      actorsMentioned: [],
      tags: tagIds,
      location: locationIds,
      origin: 'muninn',
      ...(article.summary !== undefined && { summary: article.summary }),
    });

    await newArticle.save();
    res.status(201).json({ message: 'Article successfully created.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  createFromMunnin,
};