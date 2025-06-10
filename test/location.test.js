const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const LocationController = require('../controllers/locationController');
const Location = require('../models/location');

describe('Location Controller Unit Test', () => {
  let sandbox;
  let req, res;
  const fakeLocation = { id: 'abc123', name: 'Test Place', geolocation: [20, -103] };

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

  it('should get all locations', async () => {
    sandbox.stub(Location, 'scan').returns({ exec: sandbox.stub().resolves([fakeLocation]) });
    await LocationController.getAll(req, res);
    expect(res.json.calledWith([fakeLocation])).to.be.true;
  });

  it('should get location by id', async () => {
    req.params = { id: 'abc123' };
    sandbox.stub(Location, 'get').resolves(fakeLocation);
    await LocationController.getById(req, res);
    expect(res.json.calledWith(fakeLocation)).to.be.true;
  });

  it('should return 404 if location not found', async () => {
    req.params = { id: 'notfound' };
    sandbox.stub(Location, 'get').resolves(null);
    await LocationController.getById(req, res);
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ error: sinon.match.string })).to.be.true;
  });

  it('should create a new location', async () => {
    req.body = { name: 'Test Place', geolocation: [20, -103] };
    sandbox.stub(Location.prototype, 'save').resolves();
    await LocationController.create(req, res);
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Location successfully created.' })).to.be.true;
  });

  it('should return 400 for invalid create payload', async () => {
    req.body = { name: 'Missing geo' };
    await LocationController.create(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should update a location', async () => {
    req.params = { id: 'abc123' };
    req.body = { name: 'Updated', geolocation: [21, -104] };
    sandbox.stub(Location, 'get').resolves(fakeLocation);
    sandbox.stub(Location, 'update').resolves();
    await LocationController.update(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Location successfully updated.' })).to.be.true;
  });

  it('should return 404 on update if not found', async () => {
    req.params = { id: 'notfound' };
    req.body = { name: 'Updated' };
    sandbox.stub(Location, 'get').resolves(null);
    await LocationController.update(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('should delete a location', async () => {
    req.params = { id: 'abc123' };
    sandbox.stub(Location, 'get').resolves(fakeLocation);
    sandbox.stub(Location, 'delete').resolves();
    await LocationController.remove(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Location successfully deleted.' })).to.be.true;
  });

  it('should return 404 on delete if not found', async () => {
    req.params = { id: 'notfound' };
    sandbox.stub(Location, 'get').resolves(null);
    await LocationController.remove(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });
});