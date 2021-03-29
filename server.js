// imports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const session = require('express-session');
var routes = require('./routes/router');
var path = require('path');

// setup for cookies
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'sebmandal.com=your_mom',
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //   secure: true // true if httpS
  // }
}));

// to be able to do: req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// setting up views/engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views/pages'));

// access to routes/router so we can call GETs and POSTs
app.use(routes);

// start server
app.listen(3000);