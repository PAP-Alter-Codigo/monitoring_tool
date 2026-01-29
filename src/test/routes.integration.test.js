const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const request = require('supertest');
const express = require('express');
const routes = require('../routes/index');
const Actor = require('../models/actor');
const Article = require('../models/article');
const Location = require('../models/location');
const Tag = require('../models/tag');

describe('Routes Integration Tests', () => {
  let app;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    app = express();
    app.use(express.json());
    app.use('/', routes);
  });

  afterEach(() => {
    sandbox.restore();
  });

  // Actor Routes
  describe('GET /actors', () => {
    it('should return all actors', async () => {
      const mockActors = [{ id: '1', name: 'Test Actor', tagId: 'tag1', articleIds: [] }];
      sandbox.stub(Actor, 'scan').returns({ exec: sandbox.stub().resolves(mockActors) });

      const res = await request(app).get('/actors');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('POST /actors', () => {
    it('should create a new actor', async () => {
      sandbox.stub(Actor.prototype, 'save').resolves();

      const res = await request(app)
        .post('/actors')
        .send({ name: 'New Actor', tagId: 'tag1', articleIds: ['art1'] });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message');
    });

    it('should return 400 for invalid payload', async () => {
      const res = await request(app)
        .post('/actors')
        .send({ name: 'Invalid', articleIds: 'not-an-array' });

      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /actors/:id', () => {
    it('should update an actor', async () => {
      sandbox.stub(Actor, 'get').resolves({ id: '1', name: 'Old Name' });
      sandbox.stub(Actor, 'update').resolves();

      const res = await request(app)
        .put('/actors/1')
        .send({ name: 'Updated Name' });

      expect(res.status).to.equal(200);
    });

    it('should return 404 for non-existent actor', async () => {
      sandbox.stub(Actor, 'get').resolves(null);

      const res = await request(app)
        .put('/actors/999')
        .send({ name: 'Updated' });

      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /actors/:id', () => {
    it('should delete an actor', async () => {
      sandbox.stub(Actor, 'get').resolves({ id: '1', name: 'Test' });
      sandbox.stub(Actor, 'delete').resolves();

      const res = await request(app).delete('/actors/1');
      expect(res.status).to.equal(200);
    });
  });

  // Article Routes
  describe('GET /articles', () => {
    it('should return all articles', async () => {
      const mockArticles = [{
        id: '1',
        publicationDate: '2024-01-01',
        sourceName: 'Test Source',
        paywall: false,
        headline: 'Test Headline',
        url: 'http://test.com',
        author: 'Test Author',
        coverageLevel: 'local',
        actorsMentioned: [],
        tags: [],
        location: 'loc1'
      }];
      sandbox.stub(Article, 'scan').returns({ exec: sandbox.stub().resolves(mockArticles) });

      const res = await request(app).get('/articles');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('POST /articles', () => {
    it('should create a new article', async () => {
      sandbox.stub(Article, 'query').returns({
        eq: () => ({ exec: async () => [] })
      });
      sandbox.stub(Article.prototype, 'save').resolves();

      const res = await request(app)
        .post('/articles')
        .send({
          publicationDate: '2024-01-01',
          sourceName: 'Test',
          paywall: false,
          headline: 'Test',
          url: 'http://unique.com',
          author: 'Author',
          coverageLevel: 'local',
          actorsMentioned: [],
          tags: ['tag1'],
          location: 'loc1'
        });

      expect(res.status).to.equal(201);
    });

    it('should return 409 for duplicate URL', async () => {
      sandbox.stub(Article, 'query').returns({
        eq: () => ({ exec: async () => [{ id: '1' }] })
      });

      const res = await request(app)
        .post('/articles')
        .send({
          publicationDate: '2024-01-01',
          sourceName: 'Test',
          paywall: false,
          headline: 'Test',
          url: 'http://duplicate.com',
          author: 'Author',
          coverageLevel: 'local',
          actorsMentioned: [],
          tags: ['tag1'],
          location: 'loc1'
        });

      expect(res.status).to.equal(409);
    });
  });

  // Location Routes
  describe('GET /locations', () => {
    it('should return all locations', async () => {
      const mockLocations = [{ id: '1', name: 'Test Location', geolocation: [20, -103] }];
      sandbox.stub(Location, 'scan').returns({ exec: sandbox.stub().resolves(mockLocations) });

      const res = await request(app).get('/locations');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('POST /locations', () => {
    it('should create a new location', async () => {
      sandbox.stub(Location.prototype, 'save').resolves();

      const res = await request(app)
        .post('/locations')
        .send({ name: 'New Location', geolocation: [20, -103] });

      expect(res.status).to.equal(201);
    });

    it('should return 400 for invalid geolocation', async () => {
      const res = await request(app)
        .post('/locations')
        .send({ name: 'Invalid', geolocation: [20] });

      expect(res.status).to.equal(400);
    });
  });

  // Tag Routes
  describe('GET /tags', () => {
    it('should return all tags', async () => {
      const mockTags = [{ id: '1', name: 'Test Tag' }];
      sandbox.stub(Tag, 'scan').returns({ exec: sandbox.stub().resolves(mockTags) });

      const res = await request(app).get('/tags');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('POST /tags', () => {
    it('should create a new tag', async () => {
      sandbox.stub(Tag.prototype, 'save').resolves();

      const res = await request(app)
        .post('/tags')
        .send({ name: 'New Tag' });

      expect(res.status).to.equal(201);
    });

    it('should return 400 for empty name', async () => {
      const res = await request(app)
        .post('/tags')
        .send({ name: '' });

      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /tags/:id', () => {
    it('should update a tag', async () => {
      sandbox.stub(Tag, 'get').resolves({ id: '1', name: 'Old Tag' });
      sandbox.stub(Tag, 'update').resolves();

      const res = await request(app)
        .put('/tags/1')
        .send({ name: 'Updated Tag' });

      expect(res.status).to.equal(200);
    });
  });

  describe('DELETE /tags/:id', () => {
    it('should delete a tag', async () => {
      sandbox.stub(Tag, 'get').resolves({ id: '1', name: 'Test' });
      sandbox.stub(Tag, 'delete').resolves();

      const res = await request(app).delete('/tags/1');
      expect(res.status).to.equal(200);
    });
  });
});
