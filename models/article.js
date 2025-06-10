const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');

const articleSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4
  },
  publicationDate: {
    type: String,
    required: true,
  },
  source: { // We don't need a source object. Flatten every 'schema' attribute to have the same hierarchy as id.
    type: Object,
    schema: {
      name: String, //required
      paywall: Boolean,
      headline: String, // required
      url: String, // required
      author: String,
      coverageLevel: String
    },
    required: true
  },
  actorsMentioned: {
    type: Array,
    schema: [String],
    required: true,
  },
  tags: {
    type: Array,
    schema: [String],
    required: true,
  },
  geolocation: {
    type: String,
    required: true,
  },
})


Article = dynamoose.model('Articles', articleSchema);

module.exports = Article;
