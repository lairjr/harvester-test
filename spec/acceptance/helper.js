const request = require('superagent');
const chai = require('chai');
const Joi = require('joi');

global.baseUrl = 'http://localhost:3000';
global.request = request;
global.expect = chai.expect;
global.Joi = Joi;
global.timeout = 5000;
