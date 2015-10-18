var express = require('express');
var Upload = require('upload-file');
var encryptor = require('file-encryptor');
var path = require('path');
var stats = require('../statsHandler');
var encryption = require('../encryption');

// upload post request
exports.handle = function(req, res) {

  var key = Math.random().toString(36).substring(6);

  var filename;
  var realname;
  var temp = false;
  if(req.headers.selfdestruct == 'true') {
    temp = true;
  }

  var upload = new Upload({
    dest: storageLocation,
    // rename function is called at start of upload
    rename: function(name, file) {
      stats.uploadIncrement(file.size);
      realname = file.filename;
      log(req.cf_ip, 'has started uploading ' + realname);
      return encryption.getHashedName(realname, key) + '.dat';
    }
  });

  // upload complete
  upload.on('end', function(fields, files) {
    // encrypt the file
    log(req.cf_ip, 'has finnished uploading ' + realname + ', starting encryption');
    encryption.encryptFile(realname, key, temp, function() {
      log(req.cf_ip, 'file encryption complete');
      // handle clients using the unix upload script
      if(req.headers['cmdline']) {
        res.send("UPLOAD COMPLETE: \nDirect Download: " + serverAddress + "/dl/" + key + "/" + realname + "\n");
      } else {
        res.send({
          "key" : key,
          "name" : realname
        });
      }
    });
  });

  // upload error handler
  upload.on('error', function(err) {
    log(req.cf_ip, 'threw error ' + err);
    res.send('Error uploading file.');
  });

  upload.parse(req);
};
