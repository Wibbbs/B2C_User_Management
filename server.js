const port = process.env.PORT || 3001;

// load up the express framework and body-parser helper
const express = require('express');
const bodyParser = require('body-parser');

// create an instance of express to serve our end points
const app = express();

// we'll load up node's built in file system helper library here
// (we'll be using this later to serve our JSON files
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();


// configure our express instance with some body-parser settings 
// including handling JSON data
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('view engine', 'pug');


var methodOverride = require('method-override');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
var passport = require('passport');
var bunyan = require('bunyan');

app.use(methodOverride());
app.use(cookieParser());
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'))


// this is where we'll handle our various routes from
const routes = require('./routes/routes.js')(app, fs);

// finally, launch our server on port 3001.
const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});