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

  // Priority 2: Missing 404 tests
  it('should return 404 if tag not found on getById', async function() {
    req.params = { id: 'notfound' };
    sandbox.stub(Tag, 'get').resolves(null);
    await TagController.getById(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('should return 404 if tag not found on update', async function() {
    req.params = { id: 'notfound' };
    req.body = { name: 'Updated' };
    sandbox.stub(Tag, 'get').resolves(null);
    await TagController.update(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('should return 404 if tag not found on delete', async function() {
    req.params = { id: 'notfound' };
    sandbox.stub(Tag, 'get').resolves(null);
    await TagController.remove(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  // Priority 2: Validation tests
  it('should return 400 for invalid tag name on create', async function() {
    req.body = { name: '' };
    await TagController.create(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should return 400 for missing name on create', async function() {
    req.body = {};
    await TagController.create(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should return 400 for invalid name type on update', async function() {
    req.params = { id: '123' };
    req.body = { name: 123 };
    sandbox.stub(Tag, 'get').resolves(fakeTag);
    await TagController.update(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should return 400 for empty name on update', async function() {
    req.params = { id: '123' };
    req.body = { name: '   ' };
    sandbox.stub(Tag, 'get').resolves(fakeTag);
    await TagController.update(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should return 400 for empty update body', async function() {
    req.params = { id: '123' };
    req.body = {};
    sandbox.stub(Tag, 'get').resolves(fakeTag);
    await TagController.update(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  // Priority 1: Error handling tests (500 errors)
  it('should return 500 on database error in getAll', async function() {
    sandbox.stub(Tag, 'scan').returns({ exec: sandbox.stub().rejects(new Error('Database error')) });
    await TagController.getAll(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });

  it('should return 500 on database error in getById', async function() {
    req.params = { id: '123' };
    sandbox.stub(Tag, 'get').rejects(new Error('Database error'));
    await TagController.getById(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });

  it('should return 500 on database error in create', async function() {
    req.body = { name: 'TestTag' };
    sandbox.stub(Tag.prototype, 'save').rejects(new Error('Database error'));
    await TagController.create(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });

  it('should return 500 on database error in update', async function() {
    req.params = { id: '123' };
    req.body = { name: 'Updated' };
    sandbox.stub(Tag, 'get').resolves(fakeTag);
    sandbox.stub(Tag, 'update').rejects(new Error('Database error'));
    await TagController.update(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });

  it('should return 500 on database error in delete', async function() {
    req.params = { id: '123' };
    sandbox.stub(Tag, 'get').resolves(fakeTag);
    sandbox.stub(Tag, 'delete').rejects(new Error('Database error'));
    await TagController.remove(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });
});