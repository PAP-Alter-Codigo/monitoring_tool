const Article = require('../models/article.js');

// Counts the number of active articles referencing a given entity.
const countReferences = async (fieldName, id) => {
  const articles = await Article.scan().exec();
  const referencingArticles = articles.filter(article => {
    const list = article[fieldName];
    if (!Array.isArray(list)) {
      return false;
    }
    return list.some(item => {
      if (item && typeof item === 'object' && typeof item.S === 'string') {
        return item.S === id;
      }
      return false;
    });
  });
  return referencingArticles.length;
};


module.exports = {
  countReferences
};

