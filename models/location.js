const dynamoose = require("dynamoose");

const locationSchema = new dynamoose.Schema({
  _idLocation: {
    type: Number,
    hashKey: true,
    default: () => Date.now(),
  },
  name: {
    type: String,
    required: true,
  },
  geolocation: {
    type: Array,
    schema: [Number],
    required: true,
    validate: (val) => val.length === 2
  }
});

Location = dynamoose.model("Location", locationSchema);

module.exports = Location;