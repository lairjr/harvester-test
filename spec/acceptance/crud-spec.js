const harvesterApp = require('../../app/api');

describe('CRUD operations', () => {
  let app;
  const authorSchema = Joi.object().keys({
    authors: Joi.array().items(Joi.object().keys({
      id: Joi.string(),
      name: Joi.string()
    })).required()
  });
  const author = {
    'authors':
    [
      {
        'name': 'Stephen King'
      }
    ]
  };

  beforeEach((done) => {
    app = harvesterApp.listen(3000, () => done());
  });

  afterEach(() => {
    app.close()
  });

  describe('POST /authors', () => {
    beforeEach(() => app.adapter.db.models.author.remove({}));

    it('creates an author', (done) => {
      request
        .post('http://localhost:3000/authors')
        .set('Content-Type', 'application/json')
        .send(author)
        .end((err, res) => {
          expect(res.status).to.be.equal(201);
          expect(res.body.authors[0].name).to.be.equal('Stephen King');
          const result = Joi.validate(res.body, authorSchema);
          expect(result.error).to.be.null
          done(err);
        });
    });
  });

  describe('GET /authors', () => {
    beforeEach(() => app.adapter.db.models.author.remove({})
      .then(() => app.adapter.create('author', author)));

    it('returns a collection of authors', () => {
      request
        .get('http://localhost:3000/authors')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.authors[0].name).to.be.equal('Stephen King');
          const result = Joi.validate(res.body, schema);
          expect(result.error).to.be.null
          done(err);
        });
    });
  });
});
