const dynamoose = require("dynamoose");
const { v4: uuidv4 } = require("uuid");

const sourceUrlSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      default: uuidv4,
    },
    name: {
      type: String,
      required: true,
      index: {
        global: true,
        name: "name-index",
      },
    },
    source_url: {
      type: String,
      required: true,
      index: {
        global: true,
        name: "source_url-index",
      },
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const isProd = process.env.IS_PRODUCTION || true;

const SourceUrl = dynamoose.model("SourceUrls", sourceUrlSchema, {
  create: !isProd,
  update: !isProd,
  waitForActive: !isProd,
});

module.exports = SourceUrl;
