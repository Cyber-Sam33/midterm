// load .env data into process.env
require('dotenv').config();

//connection to database
const db = require('./db/connection');


// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));
app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');
const { getUsers } = require('./db/queries/users');
const { addStory } = require('./db/queries/stories');
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);

// Note: mount other resources here, using the same pattern above
// const {getUsers} = require("./db/queries/users")
// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const clause = `SELECT * FROM users WHERE email = '${email}';`;
  getUsers(clause).then((db) => {
    req.session.user_id = db[0].id;
    console.log(req.session.user_id);
  });
  res.redirect('/');
});

app.get("/register", (req, res) => {
  console.log("Register Not Implemeted");
});

app.get("/story", (req, res) => {
  console.log("Sorry not working atm. redirect to mainpage");
  res.render('story');
});

app.post("/story/:id", (req, res) => {
  //store story variable
  story_contribution = req.body.text;
  console.log('variable here: ', story_contribution);

  // use a query to store the contribution in the database
  const storyId = req.params.id;
  console.log('story ID', storyId);
  const clause = `INSERT INTO contributions (story_id, contribution, upvotes) VALUES (${storyId}, '${story_contribution}', 0);
  `;
  // insert value into data base
  db.query(clause)
    .then(data => {
      console.log(data.rows);
    });

  ///selct contribution element by ID from db and append to the page (3 max)
  res.redirect(`/story/${storyId}`);

});

app.get("/story/upvotes/:story_id/:contribution_id", (req, res) => {

  console.log('req params: ', req.params.story_id);
  console.log('Contribution req params: ', req.params.contribution_id);
  const clause = `UPDATE contributions SET upvotes = upvotes + 1 WHERE id = $1 AND story_id = $2`;
  db.query(clause, [req.params.contribution_id, req.params.story_id])
    .then((result) => {
      console.log(result);
      res.redirect(`/story/${req.params.story_id}`);
    }
    );
});


app.get("/story/:id", (req, res) => {
  const storyId = req.params.id;
  const clause = `SELECT * FROM stories WHERE id = ${storyId};`;
  // console.log('clause', clause);
  // console.log('storyID', storyId);

  getUsers(clause).then((data) => {
    const clause2 = `SELECT * FROM contributions WHERE story_id = ${storyId} ORDER BY upvotes DESC`;
    console.log(clause2);
    db.query(clause2).then((contributions) => {
      // console.log('contributions', contributions);
      res.render('story', { data, storyId, contributions: contributions.rows }); //db to data

    });
  });
});



app.get("/mystory", (req, res) => {
  res.render("mystory");
});

app.get('/', (req, res) => {
  const clause = 'SELECT * FROM stories;';
  getUsers(clause).then((db) => {
    res.render('index', { db });
  });
});

app.get("/:id", (req, res) => {
  const pageId = req.params.id;
  const offset = (pageId - 1) * 3;
  console.log(offset);
  const clause = `SELECT * FROM stories LIMIT 3 OFFSET ${offset};`;
  getUsers(clause).then((db) => {
    res.render('index', { db });
  });
});

app.post("/story", (req, res) => {
  addStory(req.session.user_id, req.body.title, req.body.story).then((data) => {
    console.log("Data is", data);
    res.redirect("/");
  });

});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});







