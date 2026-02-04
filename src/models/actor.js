const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');

const actorSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  name: {
    type: String,
    required: true,
  },
  tagId: {
    type: String,
  },
  articleIds: {
    type: Array,
    schema: [String],
    validate: (val) => Array.isArray(val) && val.every(id => typeof id === 'string'),
  },
});

const isProd = process.env.IS_PRODUCTION || true;

const Actor = dynamoose.model("Actors", actorSchema, {
  create: !isProd,
  update: !isProd,
  waitForActive: !isProd,
});

module.exports = Actor;