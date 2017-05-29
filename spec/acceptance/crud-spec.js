const harvesterApp = require('../../app/api')();

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
    app = harvesterApp.listen(3000, () => {
      app.adapter.db.models.author.remove({})
        .then(() => done());
    });
  });

  afterEach(() => {
    app.close()
  });

  describe('POST /authors', () => {
    it('creates an author', (done) => {
      request
        .post(`${baseUrl}/authors`)
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
    beforeEach(() => app.adapter.create('author', { name: 'Stephen King' }));

    it('returns a collection of authors', (done) => {
      request
        .get(`${baseUrl}/authors`)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.authors[0].name).to.be.equal('Stephen King');
          const result = Joi.validate(res.body, authorSchema);
          expect(result.error).to.be.null
          done(err);
        });
    });
  });

  describe('PUT /authors', () => {
    let newRecord;
    const newAuthor = {
      'authors':
      [
        {
          'name': 'George R. R. Martin'
        }
      ]
    };

    beforeEach(() => app.adapter.create('author', { name: 'Stephen King' })
      .then((record) => {
        newRecord = record;
        return app.adapter.find('author', {});
      })
    );

    it('updates the author', (done) => {
      request
        .put(`${baseUrl}/authors/${newRecord.id}`)
        .set('Content-Type', 'application/json')
        .send(newAuthor)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.authors[0].name).to.be.equal('George R. R. Martin');
          const result = Joi.validate(res.body, authorSchema);
          expect(result.error).to.be.null
          done(err);
        });
    });
  });

  describe('DELETE /authors', () => {
    let authorId;

    beforeEach(() => {
      return app.adapter.create('author', { name: 'Stephen King' })
        .then(author => authorId = author.id);
    });

    it('deletes an existing author', (done) => {
      request
          .del(`${baseUrl}/authors/${1200}`)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.be.equal(204);
          app.adapter.find('author', {}).then(author => {
            done(err);
          });
        });
    });
  });
});
