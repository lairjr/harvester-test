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
        done();
      });

      setTimeout(() => {
        request
          .post('http://localhost:3000/authors')
          .set('Content-Type', 'application/json')
          .send(author)
          .end((err, res) => {
            console.log('>>> res', res.status);
            expect(res.status).to.be.equal(201);
          });
      }, requestTimeout);
    });
  });
});
