const Location = require('../models/location.js');

const isValidName = (name) => typeof name === 'string';

const isValidGeolocation = (geolocation) => {
  if (!Array.isArray(geolocation) || geolocation.length !== 2) return false;
  const [lat, lon] = geolocation;
  return typeof lat === 'number' && typeof lon === 'number';
};

const isValidLocation = (loc) => {
  return isValidName(loc?.name) && isValidGeolocation(loc?.geolocation);
};

const getAll = async (req, res) => {
  try {
    const locations = await Location.scan().exec();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const location = await Location.get({ _idLocation: id });
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

    //missing the id part because db should assing it
    if (!isValidLocation(loc)) {
      return res.status(400).json({ error: 'Invalid or incomplete payload for creating location.' });
    }

    const newLocation = new Location({
      name: loc.name,
      geolocation: loc.geolocation
    });
    
    await newLocation.save();
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
    
    const existing = await Location.get({ _idLocation: Number(id) });
    if (!existing) {
      return res.status(404).json({ error: `Location with ID ${id} not found.` });
    }

    const updateData = {};

    if(name) {
      if(!isValidName(name)){
        return res.status(400).json({ error: 'Invalid or incomplete payload for updating location.' });
      }
      updateData.name = name;
    }

    if(geolocation){
      if(!isValidGeolocation(geolocation)) {
        return res.status(400).json({ error: 'Invalid or incomplete payload for creating location.' });
      }
      updateData.geolocation = geolocation;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    await Location.update({ _idLocation: Number(id) }, updateData);
    res.status(200).json({ message: 'Location successfully updated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = await Location.get({ _idLocation: Number(id) });
    if (!existing) {
      return res.status(404).json({ error: `Location with ID ${id} not found.` });
    }

    await Location.delete({ _idLocation: Number(id) });
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