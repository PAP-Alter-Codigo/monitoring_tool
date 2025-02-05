const { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const config = require('../config');

const client = new DynamoDBClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
  }
});

const tableName = 'Tags';

const getAll = async () => {
  const params = {
    TableName: tableName
  };
  const command = new ScanCommand(params);
  const data = await client.send(command);
  return data.Items;
}

const getById = async (id) => {
  const params = {
    TableName: tableName,
    Key: {
      _idTag: { N: id.toString() }
    }
  };
  const command = new GetItemCommand(params);
  const data = await client.send(command);
  return data.Item;
}

const create = async (tag) => {
  const params = {
    TableName: tableName,
    Item: tag
  };
  const command = new PutItemCommand(params);
  await client.send(command);
}

const update = async (id, tag) => {
  const params = {
    TableName: tableName,
    Key: {
      _idTag: { N: id.toString() }
    },
    UpdateExpression: 'SET #name = :name, #description = :description',
    ExpressionAttributeNames: {
      '#value': 'value',
    },
    ExpressionAttributeValues: {
      ':value': { S: tag.value }
    }
  };
  const command = new UpdateItemCommand(params);
  await client.send(command);
}

const remove = async (id) => {
  const params = {
    TableName: tableName,
    Key: {
      _idTag: { N: id.toString() }
    }
  };
  const command = new DeleteItemCommand(params);
  await client.send(command);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
