const express = require('express');
const bodyParser = require('body-parser');
const articlesRoutes = require('./routes/articleRoutes');
const actorsRoutes = require('./routes/actorRoutes');
const tagsRoutes = require('./routes/tagRoutes');
const locationsRoutes = require('./routes/locationRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/articles', articlesRoutes);
app.use('/actors', actorsRoutes);
app.use('/tags', tagsRoutes);
app.use('/locations', locationsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});