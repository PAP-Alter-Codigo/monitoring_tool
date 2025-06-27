const express = require('express');
const bodyParser = require('body-parser');
const dynamoose = require('dynamoose')
const config = require('./config.js');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./utils/googleAuth.js');

const swaggerConfig = require('./swagger.config.json');
const { serve, setup } = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const routes = require('./routes/index.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173', // your frontend's origin
  credentials: true
}))

/* Use that in production with HTTPS
app.use(session({
  secret: 'your_strong_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // ⬅️ required if using HTTPS
    httpOnly: true,      // ⬅️ protects from client-side JS
    sameSite: 'lax',     // ⬅️ good balance of security & usability
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));
*/

const ddb = new dynamoose.aws.ddb.DynamoDB({
  region: config.AWS_REGION,
	credentials: {
		accessKeyId: config.AWS_ACCESS_KEY,
		secretAccessKey: config.AWS_SECRET_KEY
	},
});
dynamoose.aws.ddb.set(ddb);

app.use(session({
  secret: 'your_strong_secret', //change this to a strong secret for production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

const swaggerDocs = swaggerJSDoc(swaggerConfig);
app.use('/api-docs', serve, setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});