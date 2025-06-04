const dynamoose = require("dynamoose");
const { v4: uuidv4 } = require("uuid");

const tagSchema = new dynamoose.Schema({
  _idTag: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  name: {
    type: String,
    required: true,
  },
});

const Tag = dynamoose.model("Tag", tagSchema);

module.exports = Tag;