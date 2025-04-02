const Location = require('../models/location.js');

const getAll = async (req, res) => {
  try {
    console.log("__Ejecutando getAll() en Location__");
    const locations = await Location.getAll();
    console.log("**_Datos obtenidos:", locations);
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    console.log(`__Ejecutando getById() con ID: ${req.params.id}`);
    const location = await Location.getById(req.params.id);
    console.log("**_Datos obtenidos:", location);
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
    const { id } = req.params;
    const { name, geolocation } = req.body;

    // Primero verificamos si la ubicación existe
    const existingLocation = await Location.getById(id);
    if (!existingLocation) {
      return res.status(404).json({ error: `Location con ID ${id} no encontrada.` });
    }

    await Location.update(id, req.body);
    res.json({ message: "Location updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la ubicación existe antes de eliminarla
    const existingLocation = await Location.getById(id);
    if (!existingLocation) {
      return res.status(404).json({ error: `Location con ID ${id} no encontrada.` });
    }

    await Location.remove(id);
    res.json({ message: "Location deleted" });
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