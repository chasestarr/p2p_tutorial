'use strict'
const net = require('net');
const mdns = require('mdns');
let username = process.argv[2];
let socket;

let browser = mdns.createBrowser(mdns.tcp('http'));
browser.on('serviceUp', (service) => {
  if (service.port === 4321) {
    let ipAddress = service.addresses[2];
    socket = net.connect(10000, ipAddress)
    socket.on('data', (data) => {
      let messageObject = JSON.parse(data);
      process.stdout.write(messageObject.username + ': ' + messageObject.message);
    });
  }
});

browser.start();

process.stdin.on('data', (data) => {
  let messageObject = {'username': username, 'message': data.toString()};
  socket.write(JSON.stringify(messageObject));
});



