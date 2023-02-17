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
// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/login", (req, res) => {
  const user = req.session.user_id;
  res.render("login", {user});
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const clause = `SELECT * FROM users WHERE email = '${email}';`;
  getUsers(clause).then((data) => {
    req.session.user_id = data[0].id;
    return res.redirect("/");
  });
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.get("/register", (req, res) => {
  console.log("Register Not Implemeted");
});

app.post("/end/:id", (req, res) => {
  const pageId = req.params.id;
  const clause = `UPDATE stories SET end_story = TRUE WHERE id = ${pageId};`;
  const removeClause = `DELETE FROM contributions WHERE story_id = ${pageId};`;
  db.query(clause)
  .then(data => {
    db.query(removeClause);
  });

  res.redirect("/");
});

app.post("/add/:id", (req, res) => {
  //Need to select Current Story
  //Concatnate with Contribute
  const paragraph = req.body.text;
  const storyId = req.params.id;

  const currentStory = `SELECT story from stories WHERE id = ${storyId};`;

  getUsers(currentStory).then(data => {
    const story = data[0].story + paragraph;
    const clause = `Update stories SET story = '${story}' WHERE id = ${storyId};`;
    const removeClause = `DELETE FROM contributions WHERE story_id = ${storyId};`;
    db.query(clause).then(data => {

    });
    db.query(removeClause).then(data => {
      res.redirect(`/story/${storyId}`);
    });

  });
});

app.post("/story/:id", (req, res) => {
  //store story variable
  story_contribution = req.body.text;

  // use a query to store the contribution in the database
  const storyId = req.params.id;

  const clause = `INSERT INTO contributions (story_id, contribution, upvotes) VALUES (${storyId}, '${story_contribution}', 0);`;

  // insert value into data base
  db.query(clause)
    .then(data => {
    });

  ///selct contribution element by ID from db and append to the page (3 max)
  res.redirect(`/story/${storyId}`);

});

app.post("/story/upvotes/:story_id/:contribution_id", (req, res) => {

  const clause = `UPDATE contributions SET upvotes = upvotes + 1 WHERE id = $1 AND story_id = $2`;
  db.query(clause, [req.params.contribution_id, req.params.story_id])
    .then((result) => {
      res.redirect(`/story/${req.params.story_id}`);
    }
    );
});

app.get("/story/:id", (req, res) => {
  const user = req.session.user_id;
  const storyId = req.params.id;
  const clause = `SELECT * FROM stories WHERE id = ${storyId};`;
  getUsers(clause).then((data) => {
    const clause2 = `SELECT * FROM contributions WHERE story_id = ${storyId} ORDER BY upvotes DESC`;

    db.query(clause2).then((contributions) => {
      res.render('story', { data, storyId, contributions: contributions.rows, user}); //db to data

    });
  });
});

app.get("/mystory", (req,res) => {
  const user = req.session.user_id;
  console.log(user);

  const clause = `SELECT * FROM stories WHERE owner_id = ${user};`;
  getUsers(clause).then((data) => {
    res.render("mystory", {data, user});
  });

});


app.get('/', (req, res) => {
  res.redirect("/1");
});

app.get("/:id", (req, res) => {
  const pageId = req.params.id;
  const offset = (pageId - 1) * 3;
  const user = req.session.user_id;
  const clause = `SELECT * FROM stories LIMIT 10 OFFSET ${offset};`;
  getUsers(clause).then((data) => {
    res.render('index', { data, user });
  });
});
// ============================================================





app.post("/story", (req, res) => {
  addStory(req.session.user_id, req.body.title, req.body.story).then((data) => {
    res.redirect("/");
  });

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});



// ${req.session.user_id}
// WHERE owner_id = ${req.session.user_id}


