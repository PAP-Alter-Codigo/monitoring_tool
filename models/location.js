const { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const config = require('../config');

const client = new DynamoDBClient({
    region: config.AWS_REGION,
    credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
}
});

const tableName = 'Locations';

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
            "_idLocation": { N: id.toString() }
        }
    };
    const command = new GetItemCommand(params);
    const data = await client.send(command);
    return data.Item;
}

const create = async (location) => {
    const params = {
        TableName: tableName,
        Item: location
    };
    const command = new PutItemCommand(params);
    await client.send(command);
}

const update = async (id, location) => {
    const params = {
        TableName: tableName,
        Key: {
            "_idLocation": { N: id.toString() }
        },
        UpdateExpression: 'SET #name = :name, #description = :description',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#geolocation': 'geolocation',
        },
        ExpressionAttributeValues: {
            ':name': { S: location.name },
            ':geolocation': { S: location.geolocation }
        }
    };
    const command = new UpdateItemCommand(params);
    await client.send(command);
}

const remove = async (id) => {
    const params = {
        TableName: tableName,
        Key: {
            "_idLocation": { N: id.toString() }
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
