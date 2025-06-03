const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const tagController = require('../controllers/tagController');
const Tag = require('../models/tag');

describe('Tag - Unit Testing', () => {
  let req, res, sandbox;

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

  describe('getById', () => {
    it('should return a tag', async () => {
      req.params = { id: 3 };
      const tag = { _idTag: 3, value: 'Contaminación en el Río Santiago' };
      sandbox.stub(Tag, 'getById').resolves(tag);

      await tagController.getById(req, res);

      expect(res.json.calledWith(tag)).to.be.true;
    });

    it('should return 404 if tag does not exist', async () => {
      req.params = { id: 99 };
      sandbox.stub(Tag, 'getById').resolves(null);

      await tagController.getById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: sinon.match.string })).to.be.true;
    });

    it('should return 500 on error', async () => {
      req.params = { id: 99 };
      sandbox.stub(Tag, 'getById').throws(new Error('DB error'));

      await tagController.getById(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('getAll', () => {
    it('should return list of tags', async () => {
      const mockTags = [{ _idTag: 1, value: 'Deforestación en Wirikuta' }];
      sandbox.stub(Tag, 'getAll').resolves(mockTags);

      await tagController.getAll(req, res);

      expect(res.json.calledWith(mockTags)).to.be.true;
    });

    it('should return 500 on error', async () => {
      sandbox.stub(Tag, 'getAll').throws(new Error('List error'));

      await tagController.getAll(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('create', () => {
    it('should return 201 on success', async () => {
      req.body = { _idTag: 5, value: 'Megaproyectos en Jalisco' };
      sandbox.stub(Tag, 'getById').resolves(null);
      sandbox.stub(Tag, 'create').resolves();

      await tagController.create(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ message: 'Tag successfully created.' })).to.be.true;
    });

    it('should return 400 if payload is invalid', async () => {
      req.body = { value: 'Falta ID' };

      await tagController.create(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 409 if tag already exists', async () => {
      req.body = { _idTag: 1, value: 'Duplicado' };
      sandbox.stub(Tag, 'getById').resolves({ _idTag: 1 });

      await tagController.create(req, res);

      expect(res.status.calledWith(409)).to.be.true;
    });

    it('should return 500 if model fails', async () => {
      req.body = { _idTag: 2, value: 'Nueva etiqueta' };
      sandbox.stub(Tag, 'getById').resolves(null);
      sandbox.stub(Tag, 'create').throws(new Error('Create failed'));

      await tagController.create(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('update', () => {
    it('should return 200 on success', async () => {
      req.params = { id: 6 };
      req.body = { value: 'Cambio Climático' };
      sandbox.stub(Tag, 'getById').resolves({ _idTag: 6 });
      sandbox.stub(Tag, 'update').resolves();

      await tagController.update(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Tag successfully updated.' })).to.be.true;
    });

    it('should return 400 if body is invalid', async () => {
      req.params = { id: 6 };
      req.body = {};

      await tagController.update(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 404 if tag does not exist', async () => {
      req.params = { id: 999 };
      req.body = { value: 'Desaparición de fauna' };
      sandbox.stub(Tag, 'getById').resolves(null);

      await tagController.update(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 500 on model error', async () => {
      req.params = { id: 7 };
      req.body = { value: 'Error de DB' };
      sandbox.stub(Tag, 'getById').resolves({ _idTag: 7 });
      sandbox.stub(Tag, 'update').throws(new Error('Update fail'));

      await tagController.update(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('remove', () => {
    it('should return 200 on success', async () => {
      req.params = { id: 8 };
      sandbox.stub(Tag, 'getById').resolves({ _idTag: 8 });
      sandbox.stub(Tag, 'remove').resolves();

      await tagController.remove(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Tag successfully deleted.' })).to.be.true;
    });

    it('should return 404 if tag does not exist', async () => {
      req.params = { id: 999 };
      sandbox.stub(Tag, 'getById').resolves(null);

      await tagController.remove(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 500 if model fails', async () => {
      req.params = { id: 9 };
      sandbox.stub(Tag, 'getById').resolves({ _idTag: 9 });
      sandbox.stub(Tag, 'remove').throws(new Error('Delete failed'));

      await tagController.remove(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });
});
