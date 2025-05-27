const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const articleController = require('../controllers/articleController');
const Article = require('../models/article'); 

describe('Article Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  // GET BY ID
  it('getById should respond with an article', async () => {
    const req = { params: { id: '123' } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    const mockArticle = { _articleId: 123, publicationDate: "2025-04-22", source: { name: "Test Source" } };
    sinon.stub(Article, 'getById').resolves(mockArticle);

    await articleController.getById(req, res);

    expect(res.json.calledWith(mockArticle)).to.be.true;
  });

  // GET ALL
  it('getAll should respond with list of articles', async () => {
    const req = {};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    const mockArticles = [
      { _articleId: 1, source: { name: "El País" } }
    ];

    sinon.stub(Article, 'getAll').resolves(mockArticles);

    await articleController.getAll(req, res);

    expect(res.json.calledWith(mockArticles)).to.be.true;
  });

 // CREATE
it('create should respond with 201 on success', async () => {
  const req = {
    body: {
      _articleId: 10,
      publicationDate: "2024-12-01",
      source: {
        name: "BBC",
        paywall: false,
        headline: "Nuevo descubrimiento fósil",
        url: "https://bbc.com/fossil",
        author: "Laura Smith",
        coverageLevel: "global"
      },
      actorsMentioned: [1, 2],
      tags: [3, 4],
      geolocation: 999
    }
  };
  const res = {
    json: sinon.spy(),
    status: sinon.stub().returnsThis()
  };

  sinon.stub(Article, 'create').resolves();

  await articleController.create(req, res);

  expect(res.status.calledWith(201)).to.be.true;
  expect(res.json.calledWith({ message: 'Article created' })).to.be.true; // Corregido aquí
});


// UPDATE
it('update should respond with a success message', async () => {
  const req = {
    params: { id: '11' },
    query: { publicationDate: "2024-11-15" },
    body: {
      source: {
        name: "CNN",
        paywall: true,
        headline: "Incendios forestales en aumento",
        url: "https://cnn.com/incendios",
        author: "Carlos Ruiz",
        coverageLevel: "regional"
      },
      actorsMentioned: [5],
      tags: [7],
      geolocation: 888
    }
  };
  const res = {
    json: sinon.spy(),
    status: sinon.stub().returnsThis()
  };

  sinon.stub(Article, 'update').resolves();

  await articleController.update(req, res);

  expect(res.json.calledWith({ message: 'Artículo actualizado correctamente' })).to.be.true;
});


  // REMOVE
  it('remove should respond with a success message', async () => {
    const req = {
      params: { id: '12' },
      query: { publicationDate: "2024-09-20" }
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    sinon.stub(Article, 'remove').resolves();

    await articleController.remove(req, res);

    expect(res.json.calledWith({ message: 'Artículo eliminado correctamente' })).to.be.true;
  });

  // CREATE - error on missing fields
  it('create should return 500 if required fields are missing', async () => {
    const req = {
      body: {
        _articleId: 100,
        publicationDate: "2024-01-01",
        actorsMentioned: [],
        tags: [],
        geolocation: 0
      }
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    sinon.stub(Article, 'create').throws(new Error('Missing source'));

    await articleController.create(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  // GET BY ID - error
  it('getById should return 500 on invalid ID', async () => {
    const req = { params: { id: 'abc' } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    sinon.stub(Article, 'getById').throws(new Error('Invalid ID'));

    await articleController.getById(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  // CREATE - invalid types
  it('create should return 500 on invalid source types', async () => {
    const req = {
      body: {
        _articleId: 101,
        publicationDate: "2024-01-01",
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
      }
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    sinon.stub(Article, 'create').throws(new Error('Invalid source structure'));

    await articleController.create(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  // GET BY ID - not found
  it('getById should return 404 if article is not found', async () => {
    const req = { params: { id: '999' } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    sinon.stub(Article, 'getById').resolves(null);

    await articleController.getById(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Article not found' })).to.be.true;
  });
});
