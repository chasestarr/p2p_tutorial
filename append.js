const scuttleup = require('scuttleup');
const level = require('level');

const logs = scuttleup(level('logs.db'));

logs.append('hello world');