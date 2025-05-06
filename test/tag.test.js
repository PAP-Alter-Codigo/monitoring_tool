const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const tagController = require('../controllers/tagController');
const Tag = require('../models/tag');

describe('Tag Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  // GET BY ID
  it('getById should respond with a tag', async () => {
    const req = { params: { id: '3' } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    sinon.stub(Tag, 'getById').resolves({ _idTag: 3, name: 'Contaminación' });

    await tagController.getById(req, res);

    expect(res.json.calledWith({ _idTag: 3, name: 'Contaminación' })).to.be.true;
  });

  // GET ALL
  it('getAll should respond with a list of tags', async () => {
    const req = {};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    const mockTags = [
      { _idTag: 3, name: 'Contaminación' },
      { _idTag: 4, name: 'Cambio Climático' }
    ];

    sinon.stub(Tag, 'getAll').resolves(mockTags);

    await tagController.getAll(req, res);

    expect(res.json.calledWith(mockTags)).to.be.true;
  });

  // CREATE
  it('create should return status 201 on success', async () => {
    const req = { body: { _idTag: 5, name: 'Desarrollo Sostenible' } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    sinon.stub(Tag, 'create').resolves();

    await tagController.create(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith({ message: 'tag created' })).to.be.true;
  });

  // UPDATE
  it('update should respond with a success message', async () => {
    const req = {
      params: { id: '6' },
      body: { value: 'Medio Ambiente' }
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    sinon.stub(Tag, 'update').resolves();

    await tagController.update(req, res);

    expect(res.json.calledWith({ message: 'tag updated' })).to.be.true;
  });

  // REMOVE
  it('remove should respond with a success message', async () => {
    const req = { params: { id: '7' } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    sinon.stub(Tag, 'remove').resolves();

    await tagController.remove(req, res);

    expect(res.json.calledWith({ message: 'tag deleted' })).to.be.true;
  });

  // NEGATIVE TEST
  it('getById should return 500 on model error', async () => {
    const req = { params: { id: 'abc' } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    sinon.stub(Tag, 'getById').throws(new Error('Invalid ID'));

    await tagController.getById(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
});
