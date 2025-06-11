const express = require('express');
const bodyParser = require('body-parser');
const dynamoose = require('dynamoose')
const config = require('./config.js');

const swaggerConfig = require('./swagger.config.json');
const { serve, setup } = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const articlesRoutes = require('./routes/articleRoutes');
const actorsRoutes = require('./routes/actorRoutes');
const tagsRoutes = require('./routes/tagRoutes');
const locationsRoutes = require('./routes/locationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const ddb = new dynamoose.aws.ddb.DynamoDB({
  region: config.AWS_REGION,
	credentials: {
		accessKeyId: config.AWS_ACCESS_KEY,
		secretAccessKey: config.AWS_SECRET_KEY
	},
});
dynamoose.aws.ddb.set(ddb);

app.use('/articles', articlesRoutes);
app.use('/actors', actorsRoutes);
app.use('/tags', tagsRoutes);
app.use('/locations', locationsRoutes);

const swaggerDocs = swaggerJSDoc(swaggerConfig);
app.use('/api-docs', serve, setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});