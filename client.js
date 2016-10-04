'use strict'
const socket = require('net').Socket();
socket.connect(8000, 'localhost');

let username = process.argv[2];

process.stdin.on('data', (data) => {

  let messageObject = {'username': username, 'message': data.toString()};
  socket.write(JSON.stringify(messageObject));
});

socket.on('data', (data) => {
  let messageObject = JSON.parse(data);
  process.stdout.write(messageObject.username + ': ' + messageObject.message);
});