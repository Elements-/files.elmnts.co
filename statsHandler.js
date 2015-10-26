var express = require('express');
var mongo = require('mongo-handler')('mongodb://localhost:27017/Files');

// keeps these ugly queries out of the main code
// and deals with incrementing stats

var db = 'Information';

exports.downloadIncrement = function(size) {
  increment("bandwidth", size);
  increment("downloads", 1)
}

exports.uploadIncrement = function(size) {
  increment("storage", size);
  increment("bandwidth", size);
  increment("uploads", 1);
}

function increment(field, value) {
  var obj = {};
  obj[field] = value;
  mongo.updateDocument(db, {}, { $inc : obj });
}
