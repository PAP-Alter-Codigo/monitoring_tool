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
  source: {
    type: Object,
    schema: {
      name: String,
      paywall: Boolean,
      headline: String,
      url: String,
      author: String,
      coverageLevel: String
    },
    required: true
  },
  actorsMentioned: {
    type: Array,
    schema: [Number],
    required: true,
  },
  tags: {
    type: Array,
    schema: [Number],
    required: true,
  },
  geolocation: {
    type: Number,
    required: true,
  },
})

Articles = dynamoose.model('Articles', articleSchema);

module.exports = {
  Articles
};