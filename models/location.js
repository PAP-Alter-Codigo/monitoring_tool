const { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const config = require('../config');

const client = new DynamoDBClient({
    region: config.AWS_REGION,
    credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
}
});

const LOCATION = 'Location';

const getAll = async () => {
    const params = {
        TableName: LOCATION
    };
    const command = new ScanCommand(params);
    const data = await client.send(command);
    return data.Items;
}

const getById = async (id) => {
    const params = {
        TableName: LOCATION,
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
        TableName: LOCATION,
        Item: {
            "_idLocation": { N: location._idLocation.toString() },
            "name": { S: location.name },
            "geolocation": {
                L: [
                    { N: location.geolocation[0].toString() },
                    { N: location.geolocation[1].toString() }
                ]
            }
        }
    };
    const command = new PutItemCommand(params);
    await client.send(command);
};

const update = async (id, location) => {
    const params = {
        TableName: LOCATION,
        Key: {
            "_idLocation": { N: id.toString() }
        },
        UpdateExpression: 'SET #name = :name, #geolocation = :geolocation',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#geolocation': 'geolocation'
        },
        ExpressionAttributeValues: {
            ':name': { S: location.name },
            ':geolocation': location.geolocation
                ? {
                    L: [
                        { N: location.geolocation[0].toString() },
                        { N: location.geolocation[1].toString() }
                    ]
                }
                : { L: [] }
        }
    };
    const command = new UpdateItemCommand(params);
    await client.send(command);
};

const remove = async (id) => {
    // Primero verificamos si la ubicación existe antes de eliminarla
    const getParams = {
        TableName: LOCATION,
        Key: { "_idLocation": { N: id.toString() } }
    };

    const getCommand = new GetItemCommand(getParams);
    const existingLocation = await client.send(getCommand);

    if (!existingLocation.Item) {
        throw new Error(`Location con ID ${id} no encontrado.`);
    }

    // Si la ubicación existe, procedemos con la eliminación
    const deleteParams = {
        TableName: LOCATION,
        Key: { "_idLocation": { N: id.toString() } }
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
