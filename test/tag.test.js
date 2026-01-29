const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const TagController = require('../controllers/tagController.js');
const Tag = require('../models/tag.js');

describe('Tag Controller Unit Test', function() {
  let sandbox;
  let fakeTag;
  let req, res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fakeTag = { id: '123', name: 'TestTag' };
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a new tag', async function() {
    req.body = { name: 'TestTag' };
    sandbox.stub(Tag.prototype, 'save').resolves();
    await TagController.create(req, res);
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Tag successfully created.' })).to.be.true;
  });

  it('should get all tags', async function() {
    sandbox.stub(Tag, 'scan').returns({ exec: sandbox.stub().resolves([fakeTag]) });
    await TagController.getAll(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith([fakeTag])).to.be.true;
  });

  it('should get tag by id', async function() {
    req.params = { id: '123' };
    sandbox.stub(Tag, 'get').resolves(fakeTag);
    await TagController.getById(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(fakeTag)).to.be.true;
  });

  it('should update a tag', async function() {
    req.params = { id: '123' };
    req.body = { name: 'UpdatedTag' };
    sandbox.stub(Tag, 'get').resolves(fakeTag);
    sandbox.stub(Tag, 'update').resolves();
    await TagController.update(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Tag successfully updated.' })).to.be.true;
  });

  it('should delete a tag', async function() {
    req.params = { id: '123' };
    sandbox.stub(Tag, 'get').resolves(fakeTag);
    sandbox.stub(Tag, 'delete').resolves();
    await TagController.remove(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Tag successfully deleted.' })).to.be.true;
  });
});