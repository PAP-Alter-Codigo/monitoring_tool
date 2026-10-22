require('dotenv').config();
const dynamoose = require('dynamoose');

const useLocalDynamo = process.env.USE_LOCAL_DYNAMODB === "true";
const opts = { region: process.env.AWS_REGION || "us-east-2" };

if (useLocalDynamo) {
  opts.endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
  opts.credentials = {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  };
}

const ddb = new dynamoose.aws.ddb.DynamoDB(opts);
dynamoose.aws.ddb.set(ddb);

const Actor = require('./src/models/actor');
const Article = require('./src/models/article');
const Location = require('./src/models/location');
const SourceUrl = require('./src/models/sourceUrl');
const Tag = require('./src/models/tag');

(async () => {
  const models = { Actor, Article, Location, SourceUrl, Tag };

  for (const [name, Model] of Object.entries(models)) {
    try {
      console.log(`⏳ Inicializando tabla para ${name}...`);
      await Model.scan().limit(1).exec(); // operación trivial, solo para forzar create+waitForActive
      console.log(`✅ ${name} lista`);
    } catch (err) {
      console.error(`❌ Error en ${name}:`, err.message);
    }
  }

  process.exit(0);
})();