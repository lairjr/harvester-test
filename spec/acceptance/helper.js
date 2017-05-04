const request = require('superagent');
const chai = require('chai');

global.request = request;
global.expect = chai.expect;
