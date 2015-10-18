var express = require('express');
var mongo = require('./mongoHandler');

// keeps these ugly queries out of the main code
// and deals with incrementing stats

var db = 'Information';

exports.downloadIncrement = function(size) {
  mongo.updateDocument(db, {}, { $inc : { "downloads" : 1 } });
  mongo.updateDocument(db, {}, { $inc : { "bandwidth" : size } });
}

exports.uploadIncrement = function(size) {
  mongo.updateDocument(db, {}, { $inc : { "storage" : size } });
  mongo.updateDocument(db, {}, { $inc : { "bandwidth" : size } });
  mongo.updateDocument(db, {}, { $inc : { "uploads" : 1 } });
}
