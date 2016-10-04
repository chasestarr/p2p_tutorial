const level = require('level');
const db = level('test.db');

db.get('hello', (err, value) => {
  if (err) console.log(err);
  console.log(value);
});