const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const ActorController = require('../controllers/actorController');
const Actor = require('../models/actor');

describe('Actor Controller - Unit Test', () => {
    let sandbox;
    let req, res;
    const fakeActor = { id: 'a1b2c3', name: 'Javier Prueba', tagId: 'Termo-eléctrica', articleIds: ['art1', 'art2'] };

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {};
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should get all actors', async () => {
        sandbox.stub(Actor, 'scan').returns({ exec: sandbox.stub().resolves([fakeActor]) });
        await ActorController.getAll(req, res);
        expect(res.json.calledWith([fakeActor])).to.be.true;
    });

    it('should get actor by id', async () => {
        req.params = { id: 'a1b2c3' };
        sandbox.stub(Actor, 'get').resolves(fakeActor);
        await ActorController.getById(req, res);
        expect(res.json.calledWith(fakeActor)).to.be.true;
    });

    it('should return 404 if actor not found', async () => {
        req.params = { id: 'not-found' };
        sandbox.stub(Actor, 'get').resolves(null);
        await ActorController.getById(req, res);
        expect(res.status.calledWith(404)).to.be.true;
    });

    it('should create a new actor', async () => {
        req.body = {
            name: 'Nuevo',
            tagId: 'Basurero',
            articleIds: ['art3']
        };
        sandbox.stub(Actor.prototype, 'save').resolves();
        await ActorController.create(req, res);
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Actor successfully created.' })).to.be.true;
    });

    it('should return 400 for invalid create payload', async () => {
        req.body = {
            name: 'Sin artículos',
            tagId: 'Error',
            articleIds: 'no-es-array'
        };
        await ActorController.create(req, res);
        expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 422 if validation error occurs', async () => {
        req.body = {
            name: 'Nombre',
            tagId: 'Tag',
            articleIds: ['ok']
        };
        sandbox.stub(Actor.prototype, 'save').rejects(new Error('VALIDATION_ERROR: formato incorrecto'));
        await ActorController.create(req, res);
        expect(res.status.calledWith(422)).to.be.true;
    });

    it('should update actor', async () => {
        req.params = { id: 'a1b2c3' };
        req.body = {
            name: 'Actualizado',
            tagId: 'Nuevo Tag',
            articleIds: ['nuevo1']
        };
        sandbox.stub(Actor, 'get').resolves(fakeActor);
        sandbox.stub(Actor, 'update').resolves();
        await ActorController.update(req, res);
        expect(res.status.calledWith(200)).to.be.true;
    });

    it('should return 404 if actor to update not found', async () => {
        req.params = { id: 'no-existe' };
        req.body = { name: 'X' };
        sandbox.stub(Actor, 'get').resolves(null);
        await ActorController.update(req, res);
        expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 400 if update has no valid fields', async () => {
        req.params = { id: 'a1b2c3' };
        req.body = {};
        sandbox.stub(Actor, 'get').resolves(fakeActor);
        await ActorController.update(req, res);
        expect(res.status.calledWith(400)).to.be.true;
    });

    it('should delete actor', async () => {
        req.params = { id: 'a1b2c3' };
        sandbox.stub(Actor, 'get').resolves(fakeActor);
        sandbox.stub(Actor, 'delete').resolves();
        await ActorController.remove(req, res);
        expect(res.status.calledWith(200)).to.be.true;
    });

    it('should return 404 if actor not found on delete', async () => {
        req.params = { id: 'not-found' };
        sandbox.stub(Actor, 'get').resolves(null);
        await ActorController.remove(req, res);
        expect(res.status.calledWith(404)).to.be.true;
    });
});
