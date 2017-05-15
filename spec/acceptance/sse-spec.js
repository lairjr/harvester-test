const harvesterApp = require('../../app/api');
const EventSource = require('eventsource');
const requestTimeout = 1000;

describe('SSE events', () => {
  let app;
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
        .then(() => {
          done();
        });
    });
  });

  afterEach(() => {
    app.close()
  });

  context('when creating an author', () => {
    it('emits an SSE event with the created author', (done) => {
      const source = new EventSource('http://localhost:3000/authors/changes/stream');
      source.on('authors_i', (e) => {
        console.log('insert SSE working: ', e.data);
        const parsedAuthor = JSON.parse(e.data);
        expect(parsedAuthor.name).to.be.equal('Stephen King');
        source.close();
        done();
      });

      setTimeout(() => {
        request
          .post('http://localhost:3000/authors')
          .set('Content-Type', 'application/json')
          .send(author)
          .end((err, res) => {
            expect(res.status).to.be.equal(201);
          });
      }, requestTimeout);
    });
  });

  context('when updating an author', () => {
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
        return;
      })
    );

    it('emits an SSE event with the updated author', (done) => {
      const source = new EventSource('http://localhost:3000/authors/changes/stream');
      source.on('authors_u', (e) => {
        console.log('update SSE working: ', e.data);
        const parsedAuthor = JSON.parse(e.data);
        expect(parsedAuthor.name).to.be.equal('George R. R. Martin');
        source.close();
        done();
      });

      setTimeout(() => {
        request
          .put(`http://localhost:3000/authors/${newRecord.id}`)
          .set('Content-Type', 'application/json')
          .send(newAuthor)
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
          });
      }, requestTimeout);
    });
  });
});
