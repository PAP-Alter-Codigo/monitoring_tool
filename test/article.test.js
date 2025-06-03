const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const articleController = require('../controllers/articleController');
const Article = require('../models/article');

describe('Article - Unit Testing', () => {
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
    it('should respond with an article', async () => {
      req.params = { id: 101 };
      req.query = { publicationDate: "2024-12-10" };
      const mockArticle = {
        _articleId: 101,
        publicationDate: "2024-12-10",
        source: { name: "La Jornada" }
      };
      sandbox.stub(Article, 'getById').resolves(mockArticle);

      await articleController.getById(req, res);
      expect(res.json.calledWith(mockArticle)).to.be.true;
    });

    it('should return 500 on internal error when getting article by ID', async () => {
      req.params = { id: 123 };
      req.query = { publicationDate: '2024-01-01' };
      sandbox.stub(Article, 'getById').throws(new Error('Invalid ID'));

      await articleController.getById(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });

    it('should return 404 if not found', async () => {
      req.params = { id: 999 };
      req.query = { publicationDate: "2025-01-01" };
      sandbox.stub(Article, 'getById').resolves(null);

      await articleController.getById(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe('getAll', () => {
    it('should respond with list of articles', async () => {
      sandbox.stub(Article, 'getAll').resolves([{ _articleId: 1 }]);
      await articleController.getAll(req, res);
      expect(res.json.called).to.be.true;
    });
  });

  describe('create', () => {
    it('should respond with 201 on success', async () => {
      req.body = {
        _articleId: 101,
        publicationDate: "2024-12-10",
        source: {
          name: "La Jornada",
          paywall: false,
          headline: "Comunidades denuncian afectaciones por termoeléctrica en Juanacatlán",
          url: "https://www.jornada.com.mx/nota/termica-juanacatlan",
          author: "Laura Gómez",
          coverageLevel: "regional"
        },
        actorsMentioned: [1, 3],
        tags: [2, 4],
        geolocation: 20
      };
      sandbox.stub(Article, 'getById').resolves(null);
      sandbox.stub(Article, 'create').resolves();

      await articleController.create(req, res);
      expect(res.status.calledWith(201)).to.be.true;
    });

    it('should return 400 if source is missing', async () => {
      req.body = {
        _articleId: 100,
        publicationDate: "2024-01-01",
        actorsMentioned: [],
        tags: [],
        geolocation: 0
      };
      await articleController.create(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 409 if article already exists', async () => {
      req.body = {
        _articleId: 101,
        publicationDate: "2024-12-10",
        source: {
          name: "La Jornada",
          paywall: false,
          headline: "Comunidades denuncian afectaciones por termoeléctrica en Juanacatlán",
          url: "https://www.jornada.com.mx/nota/termica-juanacatlan",
          author: "Laura Gómez",
          coverageLevel: "regional"
        },
        actorsMentioned: [1, 3],
        tags: [2, 4],
        geolocation: 20
      };
      sandbox.stub(Article, 'getById').resolves({ _articleId: 101 });
      await articleController.create(req, res);
      expect(res.status.calledWith(409)).to.be.true;
    });

    it('should return 500 on internal error during create', async () => {
      req.body = {
        _articleId: 123,
        publicationDate: "2024-11-01",
        source: {
          name: "El Informador",
          paywall: false,
          headline: "Caso de contaminación en el Río Santiago",
          url: "https://www.informador.mx/rio-santiago",
          author: "Ana Martínez",
          coverageLevel: "local"
        },
        actorsMentioned: [5],
        tags: [3],
        geolocation: 20
      };
      sandbox.stub(Article, 'getById').resolves(null);
      sandbox.stub(Article, 'create').throws(new Error('Internal DB error'));

      await articleController.create(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('update', () => {
    it('should respond with 200 on success', async () => {
      req.params = { id: 101 };
      req.query = { publicationDate: "2024-12-10" };
      req.body = {
        source: {
          name: "Proceso",
          paywall: true,
          headline: "Minería amenaza patrimonio natural en Wirikuta",
          url: "https://www.proceso.com.mx/wirikuta",
          author: "Carlos Pérez",
          coverageLevel: "nacional"
        },
        actorsMentioned: [5],
        tags: [6],
        geolocation: 21.6822
      };
      sandbox.stub(Article, 'getById').resolves({ _articleId: 101, publicationDate: "2024-12-10" });
      sandbox.stub(Article, 'update').resolves();
      await articleController.update(req, res);
      expect(res.status.calledWith(200)).to.be.true;
    });

    it('should return 404 if not found', async () => {
      req.params = { id: 202 };
      req.query = { publicationDate: "2025-01-01" };
      req.body = {
        source: {
          name: "Proceso",
          paywall: true,
          headline: "Minería amenaza patrimonio natural en Wirikuta",
          url: "https://www.proceso.com.mx/wirikuta",
          author: "Carlos Pérez",
          coverageLevel: "nacional"
        },
        actorsMentioned: [],
        tags: [],
        geolocation: 21.6822
      };
      sandbox.stub(Article, 'getById').resolves(null);
      await articleController.update(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 400 if payload is invalid', async () => {
      req.params = { id: 203 };
      req.query = { publicationDate: "2025-01-01" };
      req.body = {
        source: {
          name: 123,
          paywall: "no",
          headline: null,
          url: {},
          author: [],
          coverageLevel: 456
        },
        actorsMentioned: [1],
        tags: [2],
        geolocation: 0
      };
      sandbox.stub(Article, 'getById').resolves({ _articleId: 203, publicationDate: "2025-01-01" });
      await articleController.update(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });
  });

  describe('remove', () => {
    it('should respond with 200 on success', async () => {
      req.params = { id: 101 };
      req.query = { publicationDate: "2024-12-10" };
      sandbox.stub(Article, 'getById').resolves({ _articleId: 101, publicationDate: "2024-12-10" });
      sandbox.stub(Article, 'remove').resolves();
      await articleController.remove(req, res);
      expect(res.status.calledWith(200)).to.be.true;
    });

    it('should return 404 if article does not exist', async () => {
      req.params = { id: 888 };
      req.query = { publicationDate: "2023-10-01" };
      sandbox.stub(Article, 'getById').resolves(null);

      await articleController.remove(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 500 if error occurs during deletion', async () => {
      req.params = { id: 777 };
      req.query = { publicationDate: "2023-10-01" };
      sandbox.stub(Article, 'getById').resolves({ _articleId: 777, publicationDate: "2023-10-01" });
      sandbox.stub(Article, 'remove').throws(new Error('Failed to delete'));

      await articleController.remove(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });
});