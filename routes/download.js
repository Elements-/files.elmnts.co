var express = require('express');
var crypto = require('crypto');
var fs = require('fs');
var stats = require('../statsHandler');

exports.handle = function(req, res) {
  // calculate the encrypted filename using the key and real name
  var filename = crypto.createHash('md5').update(req.params.key + '-' + req.params.filename).digest('hex');

  fs.stat(storageLocation + filename, function(err, stat) {
    // check that regular file exists
    if(err == null) {
        res.sendFile(storageLocation + filename);
        stats.downloadIncrement(stat.size);
    } else {
      // regular file does not exist, check if a .temp version exists
    	fs.stat(storageLocation + filename + '.temp', function(err, stat) {
    		if(err == null) {
          stats.downloadIncrement(stat.size);
	        res.sendFile(storageLocation + filename + '.temp', function(err) {
	        	fs.unlinkSync(storageLocation + filename + '.temp');
	        	log('local', 'has destroyed ' + storageLocation + filename + '.temp')
	        });
	      } else {
	      	res.status(404).send('Sorry, we couldnt find that file!');
	      }
      });
    }
  });
  log(req.cf_ip, 'has downloaded ' + req.params.filename);
};
