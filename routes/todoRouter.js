var express = require('express');
var router = express.Router();
var fs = require('fs-extra');

router.post('/newproject', function (req, res) {
  if (req.session.authorized) {
    // read database
    dbPath = './db/projects.json';
    db = fs.readJSONSync(dbPath);

    // setting variables for new todo
    var todoName = req.body.todoName;
    var todoDescription = req.body.todoDescription;
    var todoDue = req.body.todoDate;
    var author = req.session.user.email;

    // creating the new todo
    newProject = {
      name: todoName,
      description: todoDescription,
      dueDate: todoDue,
      author: author,
      deleted: false,
      id: db.length
    };
    
    // push to database
    db = [...db, newProject];
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    //updating session
    // adding todos to the session
    var todos = fs.readJSONSync('./db/projects.json');
    var available = [];
    todos.map(todo => { if (todo.author === req.session.user.email) { available.push(todo); } });
    req.session.todos = available;

    // redirecting back to profile page
    res.redirect('/profile');
  } else {
    // redirecting back to profile page
    res.redirect('/');
  }
});

router.get('/deleteproject/:id', function (req, res) {
  try {
    dbid = parseInt(req.params.id);
  } catch {
    res.redirect('/profile');
  }
  if (req.session.authorized) {
    db = fs.readJSONSync('./db/projects.json');
    if (req.session.user.email == db[dbid].author) {
      db[dbid].deleted = true;
      fs.writeFileSync('./db/projects.json', JSON.stringify(db, null, 2))
    }
  }

  // adding todos to the session
  var todos = fs.readJSONSync('./db/projects.json');
  var available = [];
  todos.map(todo => { if (todo.author === req.session.user.email) { available.push(todo); } });
  req.session.todos = available;

  // redirecting back
  return res.redirect('/profile')
});

module.exports = router;