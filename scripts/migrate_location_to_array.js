require('dotenv').config();
const { DynamoDBClient, ScanCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  ...(process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  }),
});

const TABLE_NAME = 'Articles';

const migrate = async () => {
  console.log('Fetching all articles...');

  const { Items: articles } = await client.send(new ScanCommand({ TableName: TABLE_NAME }));

  const toMigrate = articles.filter(a => a.location?.S !== undefined);

  console.log(`Total articles: ${articles.length}`);
  console.log(`Articles to migrate: ${toMigrate.length}`);

  if (toMigrate.length === 0) {
    console.log('Nothing to migrate.');
    return;
  }

  let success = 0;
  let failed = 0;

  for (const article of toMigrate) {
    const id = article.id.S;
    const locationStr = article.location.S;

    try {
      await client.send(new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: { id: { S: id } },
        UpdateExpression: 'SET #loc = :newVal',
        ExpressionAttributeNames: { '#loc': 'location' },
        ExpressionAttributeValues: { ':newVal': { L: [{ S: locationStr }] } },
      }));
      console.log(`  [OK] ${id} — "${locationStr}" → ["${locationStr}"]`);
      success++;
    } catch (err) {
      console.error(`  [ERROR] ${id} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nMigration complete. Success: ${success} | Failed: ${failed}`);
};

migrate().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
