const { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const config = require('../config');

const client = new DynamoDBClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
  }
});

const ARTICLES = 'Articles';

const getAll = async () => {
  const params = {
    TableName: ARTICLES
  };
  const command = new ScanCommand(params);
  const data = await client.send(command);
  return data.Items;
};

const { QueryCommand } = require("@aws-sdk/client-dynamodb");

const getById = async (id) => {
  const params = {
    TableName: ARTICLES,
    FilterExpression: "#articleId = :articleId",
    ExpressionAttributeNames: {
      "#articleId": "_articleId"
    },
    ExpressionAttributeValues: {
      ":articleId": { N: id.toString() }
    }
  };

  try {
    const command = new ScanCommand(params);
    const data = await client.send(command);
    return data.Items.length > 0 ? data.Items[0] : null;
  } catch (error) {
    throw error;
  }
};

const create = async (article) => {
  const params = {
    TableName: ARTICLES,
    Item: {
      _articleId: { N: article._articleId.toString() },
      publicationDate: { S: article.publicationDate },
      source: {
        M: {
          name: { S: article.source.name },
          paywall: { BOOL: article.source.paywall },
          headline: { S: article.source.headline },
          url: { S: article.source.url },
          author: { S: article.source.author },
          coverageLevel: { S: article.source.coverageLevel }
        }
      },
      actorsMentioned: { NS: article.actorsMentioned.map(String) },
      tags: { NS: article.tags.map(String) },
      geolocation: { N: article.geolocation.toString() }
    }
  };

  const command = new PutItemCommand(params);
  await client.send(command);
};


const update = async (id, publicationDate, article) => {
  const params = {
    TableName: ARTICLES,
    Key: {
      _articleId: { N: id.toString() },
      publicationDate: { S: publicationDate } 
    },
    UpdateExpression: 'SET #source = :source, #actorsMentioned = :actors, #tags = :tags, #geolocation = :geo',
    ExpressionAttributeNames: {
      '#source': 'source',
      '#actorsMentioned': 'actorsMentioned',
      '#tags': 'tags',
      '#geolocation': 'geolocation'
    },
    ExpressionAttributeValues: {
      ':source': { M: {
        name: { S: article.source.name },
        paywall: { BOOL: article.source.paywall },
        headline: { S: article.source.headline },
        url: { S: article.source.url },
        author: { S: article.source.author },
        coverageLevel: { S: article.source.coverageLevel }
      }},
      ':actors': { NS: article.actorsMentioned.map(String) },
      ':tags': { NS: article.tags.map(String) },
      ':geo': { N: article.geolocation.toString() }
    }
  };

  const command = new UpdateItemCommand(params);
  await client.send(command);
};

const remove = async (id, publicationDate) => {
  const params = {
    TableName: ARTICLES,
    Key: {
      _articleId: { N: id.toString() },
      publicationDate: { S: publicationDate } // 🔥 Se agrega publicationDate como clave
    }
  };

  const command = new DeleteItemCommand(params);
  await client.send(command);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};