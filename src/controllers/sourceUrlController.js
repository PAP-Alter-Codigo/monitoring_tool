const SourceUrl = require('../models/sourceUrl.js');

const VALID_TYPES = ['rss', 'html'];

const isValidName = (name) => typeof name === 'string' && name.trim().length > 0;
const isValidSourceUrl = (url) => typeof url === 'string' && url.trim().length > 0;
const isValidType = (type) => VALID_TYPES.includes(type);

const getAll = async (req, res) => {
  try {
    const sourceUrls = await SourceUrl.scan().exec();
    res.status(200).json(sourceUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const sourceUrl = await SourceUrl.get({ id });
    if (!sourceUrl) {
      return res.status(404).json({ error: `Source URL with ID ${id} not found.` });
    }
    res.status(200).json(sourceUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, source_url, type } = req.body;

    if (!isValidName(name)) {
      return res.status(400).json({ error: 'Missing or invalid field: "name" must be a non-empty string.' });
    }
    if (!isValidSourceUrl(source_url)) {
      return res.status(400).json({ error: 'Missing or invalid field: "source_url" must be a non-empty string.' });
    }
    if (!isValidType(type)) {
      return res.status(400).json({ error: `Missing or invalid field: "type" must be one of [${VALID_TYPES.join(', ')}].` });
    }

    const nameExists = await SourceUrl.query('name').using('name-index').eq(name).exec();
    if (nameExists && nameExists.length > 0) {
      return res.status(409).json({ error: `Source URL with name "${name}" already exists.` });
    }

    const urlExists = await SourceUrl.query('source_url').using('source_url-index').eq(source_url).exec();
    if (urlExists && urlExists.length > 0) {
      return res.status(409).json({ error: `Source URL "${source_url}" already exists.` });
    }

    const newSourceUrl = new SourceUrl({ name, source_url, type });
    await newSourceUrl.save();
    res.status(201).json({ message: 'Source URL successfully created.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, source_url, type } = req.body;

    const existing = await SourceUrl.get({ id });
    if (!existing) {
      return res.status(404).json({ error: `Source URL with ID ${id} not found.` });
    }

    const updateData = {};

    if (name !== undefined) {
      if (!isValidName(name)) {
        return res.status(400).json({ error: 'Invalid field: "name" must be a non-empty string.' });
      }
      if (name !== existing.name) {
        const nameExists = await SourceUrl.query('name').using('name-index').eq(name).exec();
        if (nameExists && nameExists.length > 0) {
          return res.status(409).json({ error: `Source URL with name "${name}" already exists.` });
        }
      }
      updateData.name = name;
    }

    if (source_url !== undefined) {
      if (!isValidSourceUrl(source_url)) {
        return res.status(400).json({ error: 'Invalid field: "source_url" must be a non-empty string.' });
      }
      if (source_url !== existing.source_url) {
        const urlExists = await SourceUrl.query('source_url').using('source_url-index').eq(source_url).exec();
        if (urlExists && urlExists.length > 0) {
          return res.status(409).json({ error: `Source URL "${source_url}" already exists.` });
        }
      }
      updateData.source_url = source_url;
    }

    if (type !== undefined) {
      if (!isValidType(type)) {
        return res.status(400).json({ error: `Invalid field: "type" must be one of [${VALID_TYPES.join(', ')}].` });
      }
      updateData.type = type;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    await SourceUrl.update({ id }, updateData);
    res.status(200).json({ message: 'Source URL successfully updated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await SourceUrl.get({ id });
    if (!existing) {
      return res.status(404).json({ error: `Source URL with ID ${id} not found.` });
    }

    await SourceUrl.delete({ id });
    res.status(200).json({ message: 'Source URL successfully deleted.' });
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
};
