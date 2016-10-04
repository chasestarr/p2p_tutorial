'use strict'
const scuttleup = require('scuttleup');
const level = require('level');

const logs = scuttleup(level('logs.db'));

let stream = logs.createReadStream({valueEncoding: 'utf-8'});

stream.on('data', (data) => {
  console.log(data);
});