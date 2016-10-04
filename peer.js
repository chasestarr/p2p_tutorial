'use strict'
const topology = require('fully-connected-topology');
const streamSet = require('stream-set');
const hashToPort = require('hash-to-port');
const register = require('register-multicast-dns');
const lookup = require('lookup-multicast-dns');

const toAddress = (username) => {
  return username + '.local' + hashToPort(username);
};

let connections = streamSet();

let username = process.argv[2];
const me = process.argv[3];
const peers = process.argv.slice(4);

register(toAddress(username));
peers.map((peer) => )

let seq = 0;
let id = Math.random();

let t = topology(me, peers);

t.on('connection', (socket, id) => {
  console.log('info> new connection from', id);
  socket.on('data', (data) => {
    let messageObject = JSON.parse(data);
    if (messageObject.seq > seq) {
      process.stdout.write(messageObject.username + ': ' + messageObject.message);
      seq = messageObject.seq;

      connections.forEach((peer) => {
        peer.write(data);
      });
    }
  });

  connections.add(socket);

});

process.stdin.on('data', (data) => {
  seq++;
  connections.forEach((socket) => {
    let messageObject = {'username': username, 'message': data.toString(), 'seq': seq};
    socket.write(JSON.stringify(messageObject));
  })
});
