const { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const config = require('../config');

const client = new DynamoDBClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
  }
});

const tableName = 'Actors';

const getAll = async () => {
  const params = {
    TableName: tableName
  };
  const command = new ScanCommand(params);
  const data = await client.send(command);
  return data.Items;
};

const getById = async (id) => {
  const params = {
    TableName: tableName,
    Key: {
      _actorId: { N: id.toString() }
    }
  };
  const command = new GetItemCommand(params);
  const data = await client.send(command);
  return data.Item;
};

const create = async (actor) => {
  const params = {
    TableName: tableName,
    Item: actor
  };
  const command = new PutItemCommand(params);
  await client.send(command);
};

const update = async (id, actor) => {
  const params = {
    TableName: tableName,
    Key: {
      _actorId: { N: id.toString() }
    },
    UpdateExpression: 'SET #name = :name, #type = :type, #location = :location, #description = :description',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#type': 'type',
      '#articleId': 'articleId',
      '#location': 'location'
    },
    ExpressionAttributeValues: {
      ':name': { S: actor.name },
      ':tag': { S: actor.tag },
      ':articleId': { S: actor.articleId },
      ':location': { S: actor.location }
    }
  };
  const command = new UpdateItemCommand(params);
  await client.send(command);
};

const remove = async (id) => {
  const params = {
    TableName: tableName,
    Key: {
      _actorId: { N: id.toString() }
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
