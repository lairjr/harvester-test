const harvest = require('harvesterjs');
const Joi = require('joi');

const config = require('../config');

const options = {
  adapter: 'mongodb',
  connectionString: config.mongoUrl,
  db: 'blog',
  inflect: true,
  oplogConnectionString: config.oplogUrl
};

// define 2 resources
const harvesterMaker = (observer = {}) => {
  const harvestApp = harvest(options)
    .resource('author', {
      name: Joi.string()
    })
    .onChange({
      insert: (id) => {
        console.log(`inserted: ${id}`);
        observer.setId(id);
      },
      update: (id) => {
        console.log(`updated: ${id}`);
        observer.setId(id);
      },
      delete: (id) => {
        console.log(`deleted: ${id}`);
        observer.setId(id);
      }
    })
    .resource('book', {
      title: Joi.string(),
      author: 'author'
    });

  return harvestApp;
};

module.exports = harvesterMaker;
