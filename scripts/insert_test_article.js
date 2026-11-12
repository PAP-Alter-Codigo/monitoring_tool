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

const Article = require('../src/models/article');
const Tag = require('../src/models/tag');
const Location = require('../src/models/location');

(async () => {
  try {
    console.log('Connecting to DynamoDB at', opts.endpoint || 'AWS');

    // 1. Get or create a sample Tag
    let tags = await Tag.scan().exec();
    let tagId;
    if (tags && tags.length > 0) {
      tagId = tags[0].id;
      console.log(`Found existing tag: "${tags[0].name}" (${tagId})`);
    } else {
      console.log('No tags found, creating a test tag...');
      const newTag = new Tag({ name: 'AGUA' });
      await newTag.save();
      tagId = newTag.id;
      console.log(`Created tag: "${newTag.name}" (${tagId})`);
    }

    // 2. Get or create a sample Location
    let locations = await Location.scan().exec();
    let locationId;
    if (locations && locations.length > 0) {
      locationId = locations[0].id;
      console.log(`Found existing location: "${locations[0].name}" (${locationId})`);
    } else {
      console.log('No locations found, creating a test location...');
      const newLoc = new Location({ name: 'GUADALAJARA', geolocation: '20.6597,-103.3496' });
      await newLoc.save();
      locationId = newLoc.id;
      console.log(`Created location: "${newLoc.name}" (${locationId})`);
    }

    // 3. Check if test article exists, delete if existing to allow re-run
    const testUrl = "https://www.eluniversal.com.mx/estados/ajustan-calendario-de-tandeos-de-agua-en-la-zona-metropolitana-de-guadalajara-buscan-reducir-retrasos-en-suministro-del-liquido/";
    const existing = await Article.query('url').eq(testUrl).exec();
    if (existing && existing.length > 0) {
      for (const art of existing) {
        console.log(`Removing previous test article (${art.id})...`);
        await Article.delete({ id: art.id });
      }
    }

    // 4. Create Article with actorsMentioned
    const actorsList = [
      "Sistema Intermunicipal de los Servicios de Agua Potable y Alcantarillado (SIAPA)",
      "Ismael Jáuregui Castañeda"
    ];

    const articleData = {
      publicationDate: "06/11/2026",
      sourceName: "El Universal",
      paywall: false,
      headline: "Ajustan calendario de tandeos de agua en la Zona Metropolitana de Guadalajara",
      url: testUrl,
      author: "Redacción",
      coverageLevel: "regional",
      actorsMentioned: actorsList,
      tags: [tagId],
      location: [locationId],
      origin: "muninn",
      summary: "El SIAPA ajustó el calendario de tandeos de agua en la Zona Metropolitana de Guadalajara para mejorar el suministro y reducir quejas de los ciudadanos.",
      relevance: "high",
      why: "Adjustments to water supply schedules in Guadalajara address ongoing water scarcity issues, directly impacting community access to clean water."
    };

    const newArticle = new Article(articleData);
    await newArticle.save();

    console.log("✅ Successfully inserted test article with actors!");
    console.log("Article ID:", newArticle.id);
    console.log("Actors Mentioned:", newArticle.actorsMentioned);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error inserting article:", err);
    process.exit(1);
  }
})();

