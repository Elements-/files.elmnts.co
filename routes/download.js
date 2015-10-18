var express = require('express');
var crypto = require('crypto');
var fs = require('fs');
var stats = require('../statsHandler');
var encryption = require('../encryption');

exports.handle = function(req, res) {
  var filename = encryption.getHashedName(req.params.filename, req.params.key);

  fileExists(storageLocation + filename, function(stat) {
    // file exists
    encryption.decryptFile(req.params.filename, req.params.key, false, function() {
      res.sendFile(storageLocation + filename + '.dat', function(err) {
        log(req.cf_ip, 'has downloaded ' + req.params.filename);
        stats.downloadIncrement(stat.size);
        encryption.removeFile(storageLocation + filename + '.dat');
      });
    });
  }, function() {
    // regular file does not exist, check if a .temp version exists
    fileExists(storageLocation + filename + '.temp', function(stat) {
      // temp file exists
      encryption.decryptFile(req.params.filename, req.params.key, true, function() {
        res.sendFile(storageLocation + filename + '.dat', function(err) {
          log(req.cf_ip, 'has downloaded ' + req.params.filename);
          stats.downloadIncrement(stat.size);
          encryption.removeFile(storageLocation + filename + '.dat');
          encryption.removeFile(storageLocation + filename + '.temp');
          log('local', 'has destroyed ' + storageLocation + filename + '.temp');
        });
      });
    }, function() {
      // temp file doesn't exist
      log(req.cf_ip, 'requested unknown file ' + req.params.filename);
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
