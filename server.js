const express = require('express');
const bodyParser = require('body-parser');
const articlesRoutes = require('./routes/articles');
const actorsRoutes = require('./routes/actors');
const tagsRoutes = require('./routes/tags');
const locationsRoutes = require('./routes/locations');

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