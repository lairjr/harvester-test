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

  context('when deleting an author', () => {
    beforeEach(() => app.adapter.create('author', { name: 'Stephen King' })
      .then((record) => {
        newRecord = record;
        return;
      })
    );

    it('emits an SSE event with the updated author', (done) => {
      const source = new EventSource('http://localhost:3000/authors/changes/stream');
      source.on('authors_d', (e) => {
        source.close();
        // if this event is not called the test will fail
        done();
      });

      setTimeout(() => {
        request
          .delete(`http://localhost:3000/authors/${newRecord.id}`)
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            expect(res.status).to.be.equal(204);
          });
      }, requestTimeout);
    });
  });

  context('when passing last-event-id', () => {
    it('returns the past events', function(done) {
      this.timeout(5000);
      const eventSourceInitDict = { headers: { 'Last-Event-ID': '0' } };
      const source = new EventSource('http://localhost:3000/authors/changes/stream', eventSourceInitDict);
      let insertedAuthors = [];
      let deletedAuthors = [];
      let updatedAuthors = [];

      source.on('authors_i', (e) => {
        console.log('authors_i: ', e.data);
        insertedAuthors.push(JSON.parse(e.data));
      });

      source.on('authors_d', (e) => {
        console.log('authors_d: ', e.data);
        deletedAuthors.push(JSON.parse(e.data));
      });

      source.on('authors_u', (e) => {
        console.log('authors_u ', e.data);
        updatedAuthors.push(JSON.parse(e.data));
      });

      setTimeout(() => {
        console.log('inserted authors >> ', insertedAuthors.length);
        console.log('deleted authors >> ', deletedAuthors.length);
        console.log('updated authors >> ', updatedAuthors.length);
        expect(insertedAuthors.length).to.be.at.least(7);
        expect(deletedAuthors.length).to.be.at.least(7);
        expect(updatedAuthors.length).to.be.at.least(2);

        source.close();
        done();
      }, 3000);
    });
  });
});
