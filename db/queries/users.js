const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM stories;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getUsers };

