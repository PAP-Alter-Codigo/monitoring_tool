const Tag = require('../models/tag.js');

const isValidName = (name) => typeof name === 'string' && name.trim().length > 0;

const isValidTag = (tag) => {
  return isValidName(tag?.name);
};

const getAll = async (req, res) => {
  try {
    const tags = await Tag.scan().exec();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const tag = await Tag.get({ id: id});
    if (!tag) {
      return res.status(404).json({ error: `Tag with ID ${id} not found.` });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const tag = req.body;

    if (!isValidTag(tag)) {
      return res.status(400).json({ error: 'Missing or invalid fields: "value" must be string.' });
    }

    const newTag = new Tag({
      name: tag.name
    });
  
    await newTag.save();
    res.status(201).json({ message: 'Tag successfully created.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    
    const existing = await Tag.get({ id: id });
    if (!existing) {
      return res.status(404).json({ error: `Tag with ID ${id} not found.` });
    }

    const updateData = {};

    if(name){
      if (!isValidName(name)) {
        return res.status(400).json({ error: 'Invalid name format. Must be a non-empty string.' });
      }
      updateData.name = name;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    await Tag.update({ id: id}, updateData);
    res.status(200).json({ message: 'Tag successfully updated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
  const id = req.params.id;

    const existing = await Tag.get({ id: id });
    if (!existing) {
      return res.status(404).json({ error: `Tag with ID ${id} not found.` });
    }

    await Tag.delete({ id: id });
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