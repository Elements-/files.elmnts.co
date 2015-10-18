// For keymetrics.io
require('pmx').init({ http : true });

// configuration
storageLocation = '/root/nodejs/files.elmnts.co/public/files/';
serverAddress = 'http://files.elmnts.co';
title = 'files.elmnts.co';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cloudflare = require('cloudflare-express');

// routing
var routes = require('./routeHandler');

// express instance, main app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// start middleware functions
app.use(cloudflare.restore());
app.use(function (req, res, next) {
  res.removeHeader("x-powered-by");
  next();
});
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// catch 404 and redirect to home page
app.use(function(req, res, next) {
  res.redirect(serverAddress);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    siteTitle: title,
    error: {}
  });
  log("PRODUCTION ERROR:\n" + JSON.stringify(err));
  throw err;
});

// global logging function
global.log = function(ip, message) {
  var d = new Date();
  console.log('[', d.toUTCString(), ']', ip, message);
}

module.exports = app;
