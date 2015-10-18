var express = require('express');
var crypto = require('crypto');
var fs = require('fs');
var stats = require('../statsHandler');

exports.handle = function(req, res) {
  // calculate the encrypted filename using the key and real name
  var filename = crypto.createHash('md5').update(req.params.key + '-' + req.params.filename).digest('hex');

  fileExists(storageLocation + filename, function(stat) {
    // file exists
    res.sendFile(storageLocation + filename);
    log(req.cf_ip, 'has downloaded ' + req.params.filename);
    stats.downloadIncrement(stat.size);
  }, function() {
    // regular file does not exist, check if a .temp version exists
    fileExists(storageLocation + filename + '.temp', function(stat) {
      // temp file exists
      stats.downloadIncrement(stat.size);
      res.sendFile(storageLocation + filename + '.temp', function(err) {
        log(req.cf_ip, 'has downloaded ' + req.params.filename);
        // delete the file
        fs.unlinkSync(storageLocation + filename + '.temp');
        log('local', 'has destroyed ' + storageLocation + filename + '.temp')
      });
    }, function() {
      // temp file doesn't exist
      res.status(404).send('Sorry, we couldnt find that file!');
    });
  });

};

function fileExists(location, successCallback, failCallback) {
  fs.stat(location, function(err, stat) {
    if(err) {
      failCallback();
    } else {
      successCallback(stat);
    }
  });
}
