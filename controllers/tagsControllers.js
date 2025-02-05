const Tag = require('../models/tag.js');

const getAll = async (req, res) => {
  try {
    const tag = await Tag.getAll();
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const tag = await Tag.getById(req.params.id);
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await Tag.create(req.body);
    res.status(201).json({ message: 'tag created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    await Tag.update(req.params.id, req.body);
    res.json({ message: 'tag updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await Tag.remove(req.params.id);
    res.json({ message: 'tag deleted' });
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