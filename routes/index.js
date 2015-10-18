var express = require('express');
var mongo = require('../mongoHandler');

// home page
exports.handle = function(req, res) {
  // get stats data for labels
  mongo.findDocuments('Information', {}, function(docs) {
    var storage = round(docs[0].storage / 1000000000); // bytes -> GB
    var bandwidth = round(docs[0].bandwidth / 1000000000); // bytes -> GB
    var downloads = round(docs[0].downloads / 1000); // # -> #K

    res.render('index', {
      "siteTitle" : title,
      "downloads" : downloads,
      "uploads" : docs[0].uploads,
      "storage" : storage,
      "bandwidth" : bandwidth
    });

    log(req.cf_ip, 'visited the index page');
  });
};

function round(num) {
  return +(Math.round(num + "e+1")  + "e-1");
}
