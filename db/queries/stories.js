const db = require('../connection');

const addStory = (owner_id, title, story) => {

  return db.query(`INSERT INTO stories (owner_id, title, story) VALUES ($1, $2, $3) RETURNING *;`, [owner_id, title, story])
  .then(data => {
    return data.rows[0]
  })

}

module.exports = {addStory}
