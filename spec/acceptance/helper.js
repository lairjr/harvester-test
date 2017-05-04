const request = require('superagent');
const chai = require('chai');
const Joi = require('joi');

global.request = request;
global.expect = chai.expect;
global.Joi = Joi;
