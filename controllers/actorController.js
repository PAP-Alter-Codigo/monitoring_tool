const Actors = require('../models/actor.js');

const isValidActor = (actor) => {
  if (
    typeof actor._actorId !== 'number' ||
    typeof actor.name !== 'string' ||
    typeof actor.tag !== 'string' ||
    !Array.isArray(actor.articleIds)
  ) {
    return false;
  }
  return true;
};

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
    const actor = await Actors.getById(req.params.id);
    if (!actor) {
      return res.status(404).json({ error: `Actor with ID ${req.params.id} not found.` });
    }
    res.json(actor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const actor = req.body;

    if (!isValidActor(actor)) {
      return res.status(400).json({ error: 'Invalid or incomplete data to create an actor.' });
    }

    await Actors.create(actor);
    res.status(201).json({ message: 'Actor created successfully.' });
  } catch (error) {
    if (error.message.startsWith('VALIDATION_ERROR')) {
      return res.status(422).json({ error: 'Validation error: ' + error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const actor = req.body;
    const { id } = req.params;

    if (!actor.name || !actor.tag || !Array.isArray(actor.articleIds)) {
      return res.status(400).json({ error: 'Incomplete data to update the actor.' });
    }

    const existing = await Actors.getById(id);
    if (!existing) {
      return res.status(404).json({ error: `Actor with ID ${id} not found.` });
    }

    await Actors.update(id, actor);
    res.status(200).json({ message: 'Actor updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Actors.getById(id);
    if (!existing) {
      return res.status(404).json({ error: `Actor with ID ${id} not found.` });
    }

    await Actors.remove(id);
    res.status(200).json({ message: 'Actor deleted successfully.' });
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