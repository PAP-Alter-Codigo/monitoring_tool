const { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const config = require('../config');
const { QueryCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
  }
});

const ARTICLE = 'Articles';

const getAll = async () => {
  const params = {
    TableName: ARTICLE
  };
  const command = new ScanCommand(params);
  const data = await client.send(command);
  return data.Items;
};

const getById = async (id) => {
  const articleIdNum = parseInt(id, 10);
  if (isNaN(articleIdNum)) {
    throw new Error(`Invalid article ID: ${id}`);
  }

  const params = {
    TableName: ARTICLE,
    KeyConditionExpression: "#articleId = :articleId",
    ExpressionAttributeNames: {
      "#articleId": "_articleId"
    },
    ExpressionAttributeValues: {
      ":articleId": { N: articleIdNum.toString() }
    }
  };

  try {
    const command = new QueryCommand(params);
    const data = await client.send(command);
    return data.Items.length > 0 ? data.Items[0] : null;
  } catch (error) {
    throw error;
  }
};

const create = async (article) => {
  const params = {
    TableName: ARTICLE,
    Item: article
  };
  const command = new PutItemCommand(params);
  await client.send(command);
};

const update = async (id, article) => {
  const params = {
    TableName: ARTICLE,
    Key: {
      _articleId: { N: id.toString() }
    },
    UpdateExpression: 'SET #name = :name, #headline = :headline, #url = :url, #paywall = :paywall, #coverageLevel = :coverageLevel, #author = :author',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#headline': 'headline',
      '#url': 'url',
      '#paywall': 'paywall',
      '#coverageLevel': 'coverageLevel',
      '#author': 'author'
    },
    ExpressionAttributeValues: {
      ':name': { S: article.name },
      ':headline': { S: article.headline },
      ':url': { S: article.url },
      ':paywall': { BOOL: article.paywall },
      ':coverageLevel': { S: article.coverageLevel },
      ':author': { S: article.author }
    }
  };
  const command = new UpdateItemCommand(params);
  await client.send(command);
};

const remove = async (id) => {
  const params = {
    TableName: ARTICLE,
    Key: {
      _articleId: { N: id.toString() }
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