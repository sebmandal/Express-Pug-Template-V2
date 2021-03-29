// imports
var express = require('express');
var fs = require('fs-extra');
var router = express.Router();

// to use the todo router
todoRouter = require('./todoRouter');
router.use(todoRouter);

router.get('/', function (req, res) {
  // res.render('index', { name: 'sebmandal', age: 15 });
  res.render('index', req.session);
});

router.get('/profile', function (req, res) {
  if (req.session.authorized) {
    res.render('profile', req.session);
  } else {
    res.redirect('/');
  }
});

router.get('/logout', function (req, res) {
  if (req.session.authorized) { req.session.destroy(); res.redirect('/'); }
  else { res.redirect('/'); }
});

router.post('/login', function (req, res) {
  // reading the database (users.json)
  dbPath = './db/users.json';
  db = fs.readJSONSync(dbPath);

  // checking for a match
  db.map(user => { if (req.body.secret + req.body.email === user.password + user.email.toLowerCase()) { req.session.authorized = true; req.session.user = user; } });

  // redirecting back to index or to profile page
  if (req.session.authorized) {
    // adding todos to the session
    var todos = fs.readJSONSync('./db/projects.json');
    var available = [];
    todos.map(todo => { if (todo.author === req.session.user.email) { available.push(todo); } });
    req.session.todos = available;
    return res.redirect('/profile');
  } else {
    return res.redirect('/');
  }
});

router.post('/signup', function (req, res) {
  // reading the database (users.json)
  dbPath = './db/users.json';
  db = fs.readJSONSync(dbPath);

  // to make sure there are no duplicates
  userExists = false;
  db.map(user => { if (user.email === req.body.email.toLowerCase()) { userExists = true; } });
  
  if (!userExists) {
    // creating the new user
    var newUser = {
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: req.body.secret
    }
  
    // appending the new user to the user database
    db = [...db, newUser];
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // sending back to index
    res.redirect('/');
  } else {
    // user exists, send Forbidden message
    res.send('Email already registered, <a href="/">Return to index</a>');
  }
});

// to be able to require this from server.js
module.exports = router;