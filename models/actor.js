const { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const config = require('../config');

const client = new DynamoDBClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
  }
});

const ACTOR = 'Actors';

const getAll = async () => {
  const params = {
    TableName: ACTOR
  };
  const command = new ScanCommand(params);
  const data = await client.send(command);
  return data.Items;
};

const getById = async (id) => {
  const params = {
    TableName: ACTOR,
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
    TableName: ACTOR,
    Item: {
      "_actorId": { N: actor._actorId.toString() },
      "name": { S: actor.name },
      "tag": { S: actor.tag },
      "articleIds": actor.articleIds ? { NS: actor.articleIds.map(String) } : { NS: [] } // Validamos que articleIds exista
    }
  };
  const command = new PutItemCommand(params);
  await client.send(command);
};

const update = async (id, actor) => {
  const params = {
    TableName: ACTOR,
    Key: {
      _actorId: { N: id.toString() }
    },
    UpdateExpression: 'SET #name = :name, #tag = :tag, #articleIds = :articleIds',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#tag': 'tag',
      '#articleIds': 'articleIds'
    },
    ExpressionAttributeValues: {
      ':name': { S: actor.name },
      ':tag': { S: actor.tag },
      ':articleIds': actor.articleIds ? { NS: actor.articleIds.map(String) } : { NS: [] }
    }
  };
  const command = new UpdateItemCommand(params);
  await client.send(command);
};


const remove = async (id) => {
  // * Primero verificamos si el actor existe
  const getParams = {
    TableName: ACTOR,
    Key: { _actorId: { N: id.toString() } }
  };

  const getCommand = new GetItemCommand(getParams);
  const existingActor = await client.send(getCommand);

  if (!existingActor.Item) {
    throw new Error(`Actor con ID ${id} no encontrado.`);
  }

  // * Si el actor existe, procedemos con la eliminación
  const deleteParams = {
    TableName: ACTOR,
    Key: { _actorId: { N: id.toString() } }
  };

  const deleteCommand = new DeleteItemCommand(deleteParams);
  await client.send(deleteCommand);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
