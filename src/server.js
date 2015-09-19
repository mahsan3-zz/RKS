// server.js

// modules =================================================
var express        = require('express');
var app            = express();

var logger         = require('morgan');

var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var session        = require('cookie-session');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');

var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var flash          = require('connect-flash');

var multipart 	   = require('connect-multiparty');
var modRewrite     = require('connect-modrewrite');

var nodemailer     = require('nodemailer');
// configuration ===========================================

//detail log for debugging
//app.use(logger('combined'));

// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

//for files
app.use(multipart());

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

//cookies and session management
app.use(cookieParser());
app.use(session({ keys: ['1a3a6f7d-4b6e-4d69-9d23-a073f446a9bf']}));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());
//errors
app.use(flash());

// Configure passport-local to use account model for authentication
var Account = require('./app/models/User');
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//set view engine
app.set('view engine','ejs');

// connect to our mongoDB database
mongoose.connect(db.url);

// set the static files location /public/img will be /img for users
var path = require('path');
app.use(express.static(path.join(__dirname + '/public')));
//change default dir, incase it falls on default
app.set('views', path.join(__dirname + '/public'));

// add modrewrite functinality to server =================
// app.use(
//     modRewrite([
//     // '^/adminMain$ /',
//     '^/adminEvents$ / [L]',
//     '^/shiftReports$ / [L]',
//     '^/adminStudentsList$ / [L]'
//   ]));

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;
