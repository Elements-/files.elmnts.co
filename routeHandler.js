var express = require('express');
var router = express.Router();

// routes
var indexRoute = require('./routes/index');
var uploadRoute = require('./routes/upload');
var downloadRoute = require('./routes/download');

// handle routes based on paths
router.get('/', function(req, res, next) {
  indexRoute.handle(req, res);
});

router.get('/dl/:key/:filename', function(req, res, next) {
  downloadRoute.handle(req, res);
});

router.post('/upload', function(req, res, next) {
  uploadRoute.handle(req, res);
});

module.exports = router;
