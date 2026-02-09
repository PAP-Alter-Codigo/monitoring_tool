require('dotenv').config();

const express = require('express');
const cookieParser = require("cookie-parser");
const dynamoose = require('dynamoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const swaggerConfig = require('../swagger.config.json');
const { serve, setup } = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const routes = require('./routes/index.js');

require('./utils/googleAuth.js');

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// DYNAMO CONFIG
const opts = { region: process.env.AWS_REGION };

if (process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY) {
  opts.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  };
}

const ddb = new dynamoose.aws.ddb.DynamoDB(opts);
dynamoose.aws.ddb.set(ddb);

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_strong_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

const swaggerDocs = swaggerJSDoc(swaggerConfig);
app.use('/api-docs', serve, setup(swaggerDocs));

module.exports = app;
