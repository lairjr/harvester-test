const harvestApp = require('./app/api.js');
const config = require('./config');

// initiate the oplog eventsReader with the Mongodb oplog url and start tailing
harvestApp.eventsReader(config.oplogUrl)
  .then(EventsReader => {
    console.log('start tailing the oplog');
    new EventsReader().tail();
  })
  .catch(e => console.log(e));
