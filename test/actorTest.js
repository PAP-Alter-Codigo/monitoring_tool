const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const actorController = require('../controllers/actorController');
const ActorModel = require('../models/actor');

describe('Actor - Unit Testing', () => {
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
        it('should return all actors', async () => {
            const mockActors = [
                {
                    _actorId: { N: '111111' },
                    name: { S: 'Javier Prueba' },
                    tag: { S: 'PRUEBAAAAAA' },
                    articleIds: { NS: ['222222', '333333'] }
                }
            ];
            sandbox.stub(ActorModel, 'getAll').resolves(mockActors);

            await actorController.getAll(req, res);

            expect(res.json.calledWith(mockActors)).to.be.true;
        });

        it('should return 500 if an error occurs while retrieving all actors', async () => {
            sandbox.stub(ActorModel, 'getAll').rejects(new Error('Scan error'));

            await actorController.getAll(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Scan error' })).to.be.true;
        });
    });

    // ───────────────────────────────────────────────
    describe('getById', () => {
        it('should return actor by ID', async () => {
            req.params = { id: 111111 };
            const mockActor = {
                _actorId: { N: '111111' },
                name: { S: 'Javier Prueba' },
                tag: { S: 'PRUEBAAAAAA' },
                articleIds: { NS: ['222222', '333333'] }
            };
            sandbox.stub(ActorModel, 'getById').resolves(mockActor);

            await actorController.getById(req, res);

            expect(res.json.calledWith(mockActor)).to.be.true;
        });

        it('should return 404 if actor is not found', async () => {
            req.params = { id: 999999 };
            sandbox.stub(ActorModel, 'getById').resolves(null);

            await actorController.getById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithMatch({ error: sinon.match.string })).to.be.true;
        });

        it('should return 500 if an error occurs while retrieving actor by ID', async () => {
            req.params = { id: 123 };
            sandbox.stub(ActorModel, 'getById').rejects(new Error('Get error'));

            await actorController.getById(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Get error' })).to.be.true;
        });
    });

    // ───────────────────────────────────────────────
    describe('create', () => {
        it('should create a new actor and return 201', async () => {
            req.body = {
                _actorId: 111111,
                name: 'Javier Prueba',
                tag: 'PRUEBAAAAAA',
                articleIds: [222222, 333333]
            };
            const stub = sandbox.stub(ActorModel, 'create').resolves();

            await actorController.create(req, res);

            expect(stub.calledOnceWithExactly(req.body)).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({ message: 'Actor created successfully.' })).to.be.true;
        });

        it('should return 400 if actor payload is invalid', async () => {
            req.body = {
                name: 'Missing ID',
                tag: 'Invalid',
                articleIds: 'not-an-array'
            };

            await actorController.create(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ error: sinon.match.string })).to.be.true;
        });

        it('should return 422 if model throws a validation error', async () => {
            req.body = {
                _actorId: 111111,
                name: 'Javier Prueba',
                tag: 'PRUEBAAAAAA',
                articleIds: [222222, 333333]
            };
            sandbox.stub(ActorModel, 'create').rejects(new Error('VALIDATION_ERROR: Invalid format'));

            await actorController.create(req, res);

            expect(res.status.calledWith(422)).to.be.true;
            expect(res.json.calledWithMatch({ error: sinon.match.string })).to.be.true;
        });

        it('should return 500 if model throws an unexpected error', async () => {
            req.body = {
                _actorId: 111111,
                name: 'Javier Prueba',
                tag: 'PRUEBAAAAAA',
                articleIds: [222222, 333333]
            };
            sandbox.stub(ActorModel, 'create').rejects(new Error('Database error'));

            await actorController.create(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Database error' })).to.be.true;
        });
    });

    // ───────────────────────────────────────────────
    describe('update', () => {
        it('should update an actor and return 200', async () => {
            req.params = { id: 111111 };
            req.body = {
                name: 'Javier Updated',
                tag: 'New Tag',
                articleIds: [444444, 555555]
            };

            sandbox.stub(ActorModel, 'getById').resolves({ _actorId: 111111 });
            const updateStub = sandbox.stub(ActorModel, 'update').resolves();

            await actorController.update(req, res);

            expect(updateStub.calledWithExactly(111111, req.body)).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Actor updated successfully.' })).to.be.true;
        });

        it('should return 400 if update payload is incomplete', async () => {
            req.params = { id: 111111 };
            req.body = { tag: 'Only tag provided' };

            await actorController.update(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ error: sinon.match.string })).to.be.true;
        });

        it('should return 404 if actor does not exist', async () => {
            req.params = { id: 999999 };
            req.body = {
                name: 'Prueba',
                tag: 'Algo',
                articleIds: []
            };
            sandbox.stub(ActorModel, 'getById').resolves(null);

            await actorController.update(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithMatch({ error: sinon.match.string })).to.be.true;
        });

        it('should return 500 if an error occurs during update', async () => {
            req.params = { id: 111111 };
            req.body = {
                name: 'Prueba',
                tag: 'Algo',
                articleIds: []
            };
            sandbox.stub(ActorModel, 'getById').resolves({ _actorId: 111111 });
            sandbox.stub(ActorModel, 'update').rejects(new Error('Update failed'));

            await actorController.update(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Update failed' })).to.be.true;
        });
    });

    // ───────────────────────────────────────────────
    describe('remove', () => {
        it('should delete actor and return 200', async () => {
            req.params = { id: 111111 };
            sandbox.stub(ActorModel, 'getById').resolves({ _actorId: 111111 });
            const removeStub = sandbox.stub(ActorModel, 'remove').resolves();

            await actorController.remove(req, res);

            expect(removeStub.calledWithExactly(111111)).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Actor deleted successfully.' })).to.be.true;
        });

        it('should return 404 if actor does not exist before deletion', async () => {
            req.params = { id: 999999 };
            sandbox.stub(ActorModel, 'getById').resolves(null);

            await actorController.remove(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithMatch({ error: sinon.match.string })).to.be.true;
        });

        it('should return 500 if an error occurs during deletion', async () => {
            req.params = { id: 111111 };
            sandbox.stub(ActorModel, 'getById').resolves({ _actorId: 111111 });
            sandbox.stub(ActorModel, 'remove').rejects(new Error('Deletion error'));

            await actorController.remove(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Deletion error' })).to.be.true;
        });
    });
});