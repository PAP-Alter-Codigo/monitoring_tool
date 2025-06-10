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
  tag: {
    type: String,
    required: true, //not- required
  },
  articleIds: {
    type: Array,
    schema: [String],
    required: true, // not required
    validate: (val) => Array.isArray(val) && val.every(id => typeof id === 'string'),
  },
});

Actor = dynamoose.model("Actors", actorSchema);

module.exports = Actor;