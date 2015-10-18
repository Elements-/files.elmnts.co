var mongodb = require('mongodb');
var mongodbClient = mongodb.MongoClient;
var ObjectID = require('mongodb').ObjectID;
var debug = require('debug')('mongoHandler');
var moment = require('moment');

var mongoUrl = 'mongodb://localhost:27017/Files';
var db;

//Establish our MongoDB connection
mongodbClient.connect(mongoUrl, function(err, thedb) {
  if(err) {
    debug('MongoDB Connection Error: ' + err);
    db = null;
  } else {
  	debug('MongoDB Established to ' + mongoUrl);
    db = thedb;
  }
});

/**
	Insert a new document
**/
exports.insertDocument = function(collectionName, data, callback) {
  if(db) {
    db.collection(collectionName).insert(data, {w:1}, function(err, docs) {
      if (err) {
        debug('MongoDB Insert Query Error: ' + err);
        callback(null);
      } else {
        callback(docs);
      }
    });
  }
}

/**
	Find documents using 'search'(obj)
**/
exports.findDocuments = function(collectionName, search, callback) {
  if(db) {
    db.collection(collectionName).find(search).toArray(function(err, docs) {
      if (err) {
        debug('MongoDB Find Query Error: ' + err);
    	  callback(null);
    	} else {
    	  callback(docs);
    	}
    });
  }
}

/**
	Update a document
**/
exports.updateDocument = function(collectionName, where, data, callback) {
  if(db) {
    db.collection(collectionName).updateOne(
      where,
      data,
      function(err, docs) {
        if(err) {
          debug('MongoDB Update Query Error: ' + err);
          if(callback) {
            callback(null);
          }
        } else {
          if(callback) {
        	   callback(docs);
          }
        }
    });
  }
}
