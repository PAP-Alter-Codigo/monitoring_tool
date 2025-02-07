const Actors = require('../models/actors.js');

const getAll = async (req, res) => {
  try {
    const actors = await Actors.getAll();
    res.json(actors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const actors = await Actors.getById(req.params.id);
    res.json(actors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await Actors.create(req.body);
    res.status(201).json({ message: 'Actors created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    await Actors.update(req.params.id, req.body);
    res.json({ message: 'Actors updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await Actors.remove(req.params.id);
    res.json({ message: 'Actors deleted' });
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