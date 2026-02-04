const Actor = require("../models/actor.js");
const isValidName = (name) => typeof name === "string";
const isValidTag = (tagId) => typeof tagId === "string";
const isValidArticleIds = (ids) =>
  Array.isArray(ids) && ids.every((id) => typeof id === "string");

const isValidActor = (actor) =>
  isValidName(actor?.name) &&
  isValidTag(actor?.tagId) &&
  isValidArticleIds(actor?.articleIds ?? []);

const getAll = async (req, res) => {
  try {
    const actors = await Actor.scan().exec();
    res.status(200).json(actors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const actor = await Actor.get({ id: req.params.id });
    if (!actor) {
      return res.status(404).json({ error: `Actor with ID ${req.params.id} not found.` });
    }
    res.status(200).json(actor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const actor = req.body;

    if (!isValidActor(actor)) {
      return res.status(400).json({ error: "Invalid or incomplete payload for creating actor." });
    }

    const newActorData = { name: actor.name };
    if (actor.tagId) newActorData.tagId = actor.tagId;
    if (actor.articleIds) newActorData.articleIds = actor.articleIds;

    const newActor = new Actor(newActorData);

    await newActor.save();
    res.status(201).json({ message: "Actor successfully created." });
  } catch (error) {
    if (error.message.startsWith("VALIDATION_ERROR")) {
      return res.status(422).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tagId, articleIds } = req.body;

    const existing = await Actor.get({ id });
    if (!existing) {
      return res.status(404).json({ error: `Actor with ID ${id} not found.` });
    }

    const updateData = {};

    if (name) {
      if (!isValidName(name)) {
        return res.status(400).json({ error: "Invalid name value." });
      }
      updateData.name = name;
    }

    if (tagId) {
      if (!isValidTag(tagId)) {
        return res.status(400).json({ error: "Invalid tag value." });
      }
      updateData.tagId = tagId;
    }

    if (articleIds) {
      if (!isValidArticleIds(articleIds)) {
        return res.status(400).json({ error: "Invalid articleIds array." });
      }
      updateData.articleIds = articleIds;
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided for update." });
    }

    await Actor.update({ id }, updateData);
    res.status(200).json({ message: "Actor successfully updated." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Actor.get({ id });
    if (!existing) {
      return res.status(404).json({ error: `Actor with ID ${id} not found.` });
    }

    await Actor.delete({ id });
    res.status(200).json({ message: "Actor successfully deleted." });
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