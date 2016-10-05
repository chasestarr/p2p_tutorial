'use strict'
require('lookup-multicast-dns/global');
const topology = require('fully-connected-topology');
const streamSet = require('stream-set');
const hashToPort = require('hash-to-port');
const register = require('register-multicast-dns');
const scuttleup = require('scuttleup');
const level = require('level');

const toAddress = (username) => {
  return username + '.local:' + hashToPort(username);
};

let connections = streamSet();

const me = process.argv[2];
const peers = process.argv.slice(3);

register(me);

let seq = 0;
let id = Math.random();

console.log(me, toAddress(me), peers);

let t = topology(toAddress(me), peers.map(toAddress));

var logs = scuttleup(level(me + '.db')) // use a database per user

t.on('connection', (socket, id) => {
  console.log('info> new connection from', id);
  socket.pipe(logs.createReplicationStream({live: true})).pipe(socket);

  logs.createReadStream({live: true})
    .on('data', (data) => {
      let messageObject = JSON.parse(data.entry.toString());
      if (messageObject.seq > seq) {
        process.stdout.write(messageObject.username + ': ' + messageObject.message);
        seq = messageObject.seq;
      }
    });

    connections.add(socket);
})

process.stdin.on('data', (data) => {
  seq++;
    let messageObject = {'username': me, 'message': data.toString(), 'seq': seq, 'id': id};
    logs.append(JSON.stringify(messageObject));
});
