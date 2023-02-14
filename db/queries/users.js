const db = require('../connection');

const getUsers = () => {
  console.log(db.query('SELECT * FROM users;'));
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getUsers };
