const sinon = require('sinon');
const config = require('../../config');

describe('Events Reader', () => {
  const waitForEventsReader = 1000;
  let observer = { setId: () => {} };
  let app;
  let spy;

  beforeEach(function(done) {
    this.timeout(timeout);
    spy = sinon.spy(observer, 'setId');
    const harvesterApp = require('../../app/api')(observer);
    app = harvesterApp.listen(3000, () => {
      app.adapter.db.models.author.remove({})
        .then(() => {
          return harvesterApp.eventsReader(config.oplogUrl)
        })
        .then(EventsReader => {
          new EventsReader().tail();
          setTimeout(done, 1000);
        })
        .catch(e => console.log(e));
    });
  });

  afterEach(() => {
    app.close()
  });

  context('when a record is created', () => {
    const author = {
      'authors':
      [
        {
          'name': 'Stephen King'
        }
      ]
    };

    it('emits the inserted event', function(done) {
      this.timeout(timeout);

      request
        .post(`${baseUrl}/authors`)
        .set('Content-Type', 'application/json')
        .send(author)
        .end((err, res) => {
          expect(res.status).to.be.equal(201);
          const result = res.body;
          setTimeout(() => {
            expect(spy.called).to.be.eq(true);
            expect(spy.calledWith(result.authors[0].id)).to.be.eq(true);
            done(err);
          }, waitForEventsReader);
        });
    });
  });
});
