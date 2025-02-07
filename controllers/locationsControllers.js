const Location = require('../models/location.js');

const getAll = async (req, res) => {
  try {
    const location = await Location.getAll();
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const location = await Location.getById(req.params.id);
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await Location.create(req.body);
    res.status(201).json({ message: 'location created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    await Location.update(req.params.id, req.body);
    res.json({ message: 'location updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await Location.remove(req.params.id);
    res.json({ message: 'location deleted' });
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