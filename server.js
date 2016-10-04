'use strict'
const net = require('net');
const streamSet = require('stream-set');
const mdns = require('mdns');

let activeSockets = streamSet();



let ad = mdns.createAdvertisement(mdns.tcp('http'), 4321);
ad.start();




const server = net.createServer((socket) => {
  activeSockets.add(socket);

  console.log('set size is', activeSockets.size);

  socket.on('close', () => {
    console.log(activeSockets.size);
  });

  socket.on('data', (data) => {
    activeSockets.forEach((stream) => {
      if (stream !== socket) {
        stream.write(data);
      }
    });
  });
});

server.listen(10000);