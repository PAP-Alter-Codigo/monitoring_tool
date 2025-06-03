const Tag = require('../models/tag.js');

// Validadores auxiliares
const isValidId = (id) => Number.isInteger(Number(id));

const isValidTagPayload = (tag) => (
  tag &&
  typeof tag._idTag === 'number' &&
  typeof tag.value === 'string'
);

const isValidUpdatePayload = (tag) => (
  tag &&
  typeof tag.value === 'string'
);

const getAll = async (req, res) => {
  try {
    const tags = await Tag.getAll();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Invalid ID format. Must be a number.' });
  }

  try {
    const tag = await Tag.getById(id);
    if (!tag) {
      return res.status(404).json({ error: `Tag with ID ${id} not found.` });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  const tag = req.body;

  if (!isValidTagPayload(tag)) {
    return res.status(400).json({ error: 'Missing or invalid fields: "_idTag" must be number and "value" must be string.' });
  }

  try {
    const exists = await Tag.getById(tag._idTag);
    if (exists) {
      return res.status(409).json({ error: `Tag with ID ${tag._idTag} already exists.` });
    }

    await Tag.create(tag);
    res.status(201).json({ message: 'Tag successfully created.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  const id = Number(req.params.id);
  const { value } = req.body;

  if (!isValidId(id) || !isValidUpdatePayload({ value })) {
    return res.status(400).json({ error: 'Invalid ID or value format. ID must be number and value must be non-empty string.' });
  }

  try {
    const existing = await Tag.getById(id);
    if (!existing) {
      return res.status(404).json({ error: `Tag with ID ${id} not found.` });
    }

    await Tag.update(id, { value });
    res.status(200).json({ message: 'Tag successfully updated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Invalid ID format. Must be a number.' });
  }

  try {
    const existing = await Tag.getById(id);
    if (!existing) {
      return res.status(404).json({ error: `Tag with ID ${id} not found.` });
    }

    await Tag.remove(id);
    res.status(200).json({ message: 'Tag successfully deleted.' });
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