const level = require('level');
const db = level('test.db');

db.put('hello', 'world', (err) => {
  if(err) console.log(err);
});