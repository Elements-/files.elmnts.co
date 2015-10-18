var express = require('express');
var Upload = require('upload-file');
var encryptor = require('file-encryptor');
var path = require("path");
var crypto = require('crypto');
var stats = require('../statsHandler');

// upload post request
exports.handle = function(req, res) {

  var key = Math.random().toString(36).substring(6);
  var id = Math.random().toString(36).substring(5);
  var filename;
  var realname;

  var upload = new Upload({
    dest: storageLocation,
    // rename function is called at start of upload
    rename: function(name, file) {
      stats.uploadIncrement(file.size);

      realname = file.filename;
      filename = key + '-' + realname;

      log(req.cf_ip, 'has started uploading ' + realname);

      var hash = crypto.createHash('md5').update(filename).digest('hex');
      if(req.headers.selfdestruct == 'true') {
        return hash + '.temp';
      } else {
        return hash;
      }
    }
  });

  // upload complete
  upload.on('end', function(fields, files) {
    // handle clients using the unix upload script
    if(req.headers['cmdline']) {
      res.send("UPLOAD COMPLETE: \nDirect Download: " + serverAddress + "/dl/" + key + "/" + realname + "\n");
    } else {
      res.send({
        "key" : key,
        "name" : realname
      });
    }
    log(req.cf_ip, 'has finnished uploading ' + realname);
  });

  // upload error handler
  upload.on('error', function(err) {
    log(req.cf_ip, 'threw error ' + err);
    res.send('Error uploading file.');
  });

  upload.parse(req);
};
