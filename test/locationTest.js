const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const locationController = require('../controllers/locationController');
const LocationModel = require('../models/location');

describe('Location - Unit Testing', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    // ───────────────────────────────────────────────
    describe('getAll', () => {
        it('should respond with all locations successfully', async () => {
            const mockLocations = [
                {
                    _idLocation: { N: '3' },
                    name: { S: 'Zapopan' },
                    geolocation: {
                        L: [
                            { N: '20.7069' },
                            { N: '-103.4117' }
                        ]
                    }
                }
            ];
            sandbox.stub(LocationModel, 'getAll').resolves(mockLocations);

            await locationController.getAll(req, res);

            expect(res.json.calledWith(mockLocations)).to.be.true;
        });

        it('should return 500 when failing to retrieve locations', async () => {
            sandbox.stub(LocationModel, 'getAll').rejects(new Error('Scan error'));

            await locationController.getAll(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Scan error' })).to.be.true;
        });
    });

    // ───────────────────────────────────────────────
    describe('getById', () => {
        it('should respond with the location when found by ID', async () => {
            req.params = { id: 3 };
            const mockLocation = {
                _idLocation: { N: '3' },
                name: { S: 'Zapopan' },
                geolocation: {
                    L: [
                        { N: '20.7069' },
                        { N: '-103.4117' }
                    ]
                }
            };
            sandbox.stub(LocationModel, 'getById').resolves(mockLocation);

            await locationController.getById(req, res);

            expect(res.json.calledWith(mockLocation)).to.be.true;
        });

        it('should return 404 when the location with given ID is missing', async () => {
            req.params = { id: 999 };
            sandbox.stub(LocationModel, 'getById').resolves(null);

            await locationController.getById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Location with ID 999 not found.' })).to.be.true;
        });

        it('should return 500 if an error occurs while retrieving by ID', async () => {
            req.params = { id: 1 };
            sandbox.stub(LocationModel, 'getById').rejects(new Error('Get error'));

            await locationController.getById(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Get error' })).to.be.true;
        });
    });

    // ───────────────────────────────────────────────
    describe('create', () => {
        it('should create a location and return 201 Created', async () => {
            req.body = {
                _idLocation: 3,
                name: 'Zapopan',
                geolocation: [20.7069, -103.4117]
            };
            const stub = sandbox.stub(LocationModel, 'create').resolves();

            await locationController.create(req, res);

            expect(stub.calledOnceWithExactly(req.body)).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({ message: 'Location successfully created.' })).to.be.true;
        });

        it('should return 400 for invalid or incomplete location payload', async () => {
            req.body = {
                name: 'Missing ID',
                geolocation: 'not an array'
            };

            await locationController.create(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Invalid or incomplete payload for creating location.' })).to.be.true;
        });

        it('should return 422 for validation errors from model layer', async () => {
            req.body = {
                _idLocation: 3,
                name: 'Zapopan',
                geolocation: [20.7069, -103.4117]
            };
            sandbox.stub(LocationModel, 'create').rejects(new Error('VALIDATION_ERROR: invalid geolocation'));

            await locationController.create(req, res);

            expect(res.status.calledWith(422)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'VALIDATION_ERROR: invalid geolocation' })).to.be.true;
        });

        it('should return 500 for unexpected errors during creation', async () => {
            req.body = {
                _idLocation: 3,
                name: 'Zapopan',
                geolocation: [20.7069, -103.4117]
            };
            sandbox.stub(LocationModel, 'create').rejects(new Error('Database error'));

            await locationController.create(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Database error' })).to.be.true;
        });
    });

    // ───────────────────────────────────────────────
    describe('update', () => {
        it('should update an existing location and return 200 OK', async () => {
            req.params = { id: 3 };
            req.body = {
                name: 'Zapopan Updated',
                geolocation: [20.7069, -103.4117]
            };
            sandbox.stub(LocationModel, 'getById').resolves({ _idLocation: 3 });
            const updateStub = sandbox.stub(LocationModel, 'update').resolves();

            await locationController.update(req, res);

            expect(updateStub.calledWithExactly(3, req.body)).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Location successfully updated.' })).to.be.true;
        });

        it('should return 400 for invalid or incomplete update payload', async () => {
            req.params = { id: 3 };
            req.body = {
                name: '',
                geolocation: 'not an array'
            };

            await locationController.update(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Invalid or incomplete payload for updating location.' })).to.be.true;
        });

        it('should return 404 if location to update does not exist', async () => {
            req.params = { id: 999 };
            req.body = {
                name: 'Non-existent',
                geolocation: [20, -100]
            };
            sandbox.stub(LocationModel, 'getById').resolves(null);

            await locationController.update(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Location with ID 999 not found.' })).to.be.true;
        });

        it('should return 500 for unexpected errors during update', async () => {
            req.params = { id: 3 };
            req.body = {
                name: 'Error',
                geolocation: [0, 0]
            };
            sandbox.stub(LocationModel, 'getById').resolves({ _idLocation: 3 });
            sandbox.stub(LocationModel, 'update').rejects(new Error('Update failed'));

            await locationController.update(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Update failed' })).to.be.true;
        });
    });

    // ───────────────────────────────────────────────
    describe('remove', () => {
        it('should delete the location and return 200 OK', async () => {
            req.params = { id: 3 };
            sandbox.stub(LocationModel, 'getById').resolves({ _idLocation: 3 });
            const removeStub = sandbox.stub(LocationModel, 'remove').resolves();

            await locationController.remove(req, res);

            expect(removeStub.calledWithExactly(3)).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Location successfully deleted.' })).to.be.true;
        });

        it('should return 404 if location to delete does not exist', async () => {
            req.params = { id: 999 };
            sandbox.stub(LocationModel, 'getById').resolves(null);

            await locationController.remove(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Location with ID 999 not found.' })).to.be.true;
        });

        it('should return 500 for unexpected errors during deletion', async () => {
            req.params = { id: 3 };
            sandbox.stub(LocationModel, 'getById').resolves({ _idLocation: 3 });
            sandbox.stub(LocationModel, 'remove').rejects(new Error('Delete failed'));

            await locationController.remove(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Delete failed' })).to.be.true;
        });
    });
});