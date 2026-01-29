const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const articleController = require('../controllers/articleController');
const Article = require('../models/article');

describe('Article - Unit Testing', () => {
  let req, res, sandbox;
  const mockArticle = {
    id: "abc101",
    publicationDate: "2024-12-10",
    sourceName: "La Jornada",
    paywall: false,
    headline: "Comunidades denuncian afectaciones por termoeléctrica en Juanacatlán",
    url: "https://www.jornada.com.mx/nota/termica-juanacatlan",
    author: "Laura Gómez",
    coverageLevel: "regional",
    actorsMentioned: ["1", "3"],
    tags: ["2", "4"],
    location: "20"
  };

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

  it('should respond with list of all the articles', async () => {
    sandbox.stub(Article, 'scan').returns({ exec: sandbox.stub().resolves([mockArticle]) });
    await articleController.getAll(req, res);
    expect(res.json.calledWith([mockArticle])).to.be.true;
  });

  it('should get an article by id', async () => {
    req.params = { id: 'abc101' };
    sandbox.stub(Article, 'get').resolves(mockArticle);
    await articleController.getById(req, res);
    expect(res.json.calledWith(mockArticle)).to.be.true;
  });

  it('should return 404 if not found', async () => {
    req.params = { id: 'abc999' };
    sandbox.stub(Article, 'get').resolves(null);
    await articleController.getById(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('should create a new article', async () => {
    req.body = {
      publicationDate: "2024-12-10",
      sourceName: "La Jornada",
      paywall: false,
      headline: "Comunidades denuncian afectaciones por termoeléctrica en Juanacatlán",
      url: "https://www.jornada.com.mx/",
      author: "Laura Gómez",
      coverageLevel: "regional",
      actorsMentioned: ['1', '3'],
      tags: ['2', '4'],
      location: '20'
    };

    sandbox.stub(Article, 'query').returns({
      eq: () => ({
        exec: async () => []
      })
    });

    sandbox.stub(Article.prototype, 'save').resolves();

    await articleController.create(req, res);
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Article successfully created.' })).to.be.true;
  });

  it('should return 400 if source is missing', async () => {
    req.body = {
      id: 100,
      publicationDate: "2024-01-01",
      actorsMentioned: [],
      tags: [],
      location: 0
    };
    await articleController.create(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should return 409 if article already exists', async () => {
    req.body = mockArticle;
    const execStub = sinon.stub().resolves([mockArticle]);
    const eqStub = sinon.stub().returns({ exec: execStub });
    sandbox.stub(Article, 'query').returns({ eq: eqStub });

    await articleController.create(req, res);
    expect(res.status.calledWith(409)).to.be.true;
  });

  it('should update an article', async () => {
    req.params = { id: 'abc101' };
    req.body = {
      publicationDate: "2024-12-10",
      sourceName: "Actualizado",
      paywall: true,
      headline: "Minería amenaza patrimonio natural en Wirikuta",
      url: "https://www.proceso.com.mx/wirikuta",
      author: "Carlos Pérez",
      coverageLevel: "nacional",
      actorsMentioned: ['5'],
      tags: ['6'],
      location: '21'
    };
    sandbox.stub(Article, 'get').resolves(mockArticle);
    sandbox.stub(Article, 'update').resolves();
    await articleController.update(req, res);
    expect(res.status.calledWith(200)).to.be.true;
  });

  it('should return 404 if not found', async () => {
    req.params = { id: 'notFound' };
    req.body = {
      publicationDate: "2025-01-01",
      sourceName: "Proceso",
      paywall: true,
      headline: "Minería amenaza patrimonio natural en Wirikuta",
      url: "https://www.proceso.com.mx/wirikuta",
      author: "Carlos Pérez",
      coverageLevel: "nacional",
      actorsMentioned: ['2'],
      tags: ['1'],
      location: '21.6822'
    };
    sandbox.stub(Article, 'get').resolves(null);
    await articleController.update(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

    it('should delete an article', async () => {
      req.params = { id: 'abc101' };
      sandbox.stub(Article, 'get').resolves({ id: 'abc101' });
      sandbox.stub(Article, 'delete').resolves();
      await articleController.remove(req, res);
      expect(res.status.calledWith(200)).to.be.true;
    });

    it('should return 404 if article does not exist', async () => {
      req.params = { id: 'notFound' };
      sandbox.stub(Article, 'get').resolves(null);

      await articleController.remove(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    // Priority 1: Error handling tests (500 errors)
    it('should return 500 on database error in getAll', async () => {
      sandbox.stub(Article, 'scan').returns({ exec: sandbox.stub().rejects(new Error('Database error')) });
      await articleController.getAll(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });

    it('should return 500 on database error in getById', async () => {
      req.params = { id: 'abc101' };
      sandbox.stub(Article, 'get').rejects(new Error('Database error'));
      await articleController.getById(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });

    it('should return 500 on database error in create', async () => {
      req.body = mockArticle;
      sandbox.stub(Article, 'query').returns({
        eq: () => ({ exec: async () => [] })
      });
      sandbox.stub(Article.prototype, 'save').rejects(new Error('Database error'));
      await articleController.create(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });

    it('should return 500 on database error in update', async () => {
      req.params = { id: 'abc101' };
      req.body = { headline: 'Updated' };
      sandbox.stub(Article, 'get').resolves(mockArticle);
      sandbox.stub(Article, 'update').rejects(new Error('Database error'));
      await articleController.update(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });

    it('should return 500 on database error in delete', async () => {
      req.params = { id: 'abc101' };
      sandbox.stub(Article, 'get').resolves(mockArticle);
      sandbox.stub(Article, 'delete').rejects(new Error('Database error'));
      await articleController.remove(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });

    // Priority 3: Edge case tests
    it('should return 400 for empty update body', async () => {
      req.params = { id: 'abc101' };
      req.body = {};
      sandbox.stub(Article, 'get').resolves(mockArticle);
      await articleController.update(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 400 for invalid paywall type in update', async () => {
      req.params = { id: 'abc101' };
      req.body = { paywall: 'not-a-boolean' };
      sandbox.stub(Article, 'get').resolves(mockArticle);
      await articleController.update(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 400 for invalid actorsMentioned type in update', async () => {
      req.params = { id: 'abc101' };
      req.body = { actorsMentioned: 'not-an-array' };
      sandbox.stub(Article, 'get').resolves(mockArticle);
      await articleController.update(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 400 for invalid tags type in update', async () => {
      req.params = { id: 'abc101' };
      req.body = { tags: 'not-an-array' };
      sandbox.stub(Article, 'get').resolves(mockArticle);
      await articleController.update(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 400 for invalid geolocation format', async () => {
      req.params = { id: 'abc101' };
      req.body = { geolocation: [1] };
      sandbox.stub(Article, 'get').resolves(mockArticle);
      await articleController.update(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 400 for geolocation with non-numeric values', async () => {
      req.params = { id: 'abc101' };
      req.body = { geolocation: ['a', 'b'] };
      sandbox.stub(Article, 'get').resolves(mockArticle);
      await articleController.update(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

});