const Location = require('../models/location.js');

const isValidLocation = (loc) => {
  return (
    typeof loc._idLocation === 'number' &&
    typeof loc.name === 'string' &&
    Array.isArray(loc.geolocation) &&
    loc.geolocation.length === 2 &&
    typeof loc.geolocation[0] === 'number' &&
    typeof loc.geolocation[1] === 'number'
  );
};

const getAll = async (req, res) => {
  try {
    const locations = await Location.getAll();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const location = await Location.getById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: `Location with ID ${req.params.id} not found.` });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const loc = req.body;

    if (!isValidLocation(loc)) {
      return res.status(400).json({ error: 'Invalid or incomplete payload for creating location.' });
    }

    await Location.create(loc);
    res.status(201).json({ message: 'Location successfully created.' });
  } catch (error) {
    if (error.message.startsWith('VALIDATION_ERROR')) {
      return res.status(422).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, geolocation } = req.body;

    if (
      typeof name !== 'string' ||
      !Array.isArray(geolocation) ||
      geolocation.length !== 2 ||
      typeof geolocation[0] !== 'number' ||
      typeof geolocation[1] !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid or incomplete payload for updating location.' });
    }

    const existing = await Location.getById(id);
    if (!existing) {
      return res.status(404).json({ error: `Location with ID ${id} not found.` });
    }

    await Location.update(id, req.body);
    res.status(200).json({ message: 'Location successfully updated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Location.getById(id);
    if (!existing) {
      return res.status(404).json({ error: `Location with ID ${id} not found.` });
    }

    await Location.remove(id);
    res.status(200).json({ message: 'Location successfully deleted.' });
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