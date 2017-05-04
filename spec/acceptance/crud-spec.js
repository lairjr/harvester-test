const harvesterApp = require('../../app/api');

describe('CRUD operations', () => {
  let app;

  beforeEach((done) => {
    app = harvesterApp.listen(3000, () => done());
  });

  afterEach(() => {
    return server = null;
  });

  describe('POST /books', () => {
    beforeEach(() => app.adapter.db.models.author.remove({}));

    it('creates a book', (done) => {
      const author = {
        'authors':
        [
          {
            'name': 'Stephen King'
          }
        ]
      };

      const schema = Joi.object().keys({
        authors: Joi.array().items(Joi.object().keys({
          id: Joi.string(),
          name: Joi.string()
        })).required()
      });

      request
        .post('http://localhost:3000/authors')
        .set('Content-Type', 'application/json')
        .send(author)
        .end((err, res) => {
          expect(res.status).to.be.equal(201);
          expect(res.body.authors[0].name).to.be.equal('Stephen King');
          const result = Joi.validate(res.body, schema);
          expect(result.error).to.be.null
          done(err);
        });
    });
  });
});
