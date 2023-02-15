const db = require('../connection');

const getUsers = (clause) => {

  return db.query(clause)
    .then(data => {
      return data.rows;
    });
};



module.exports = { getUsers };

