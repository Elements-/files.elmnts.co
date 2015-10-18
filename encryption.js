var encryptor = require('file-encryptor');
var crypto = require('crypto');
var fs = require('fs');

// 'encryption.js' handles encrypting and decrypting
// files from/to storage in real time

var options = { algorithm: 'aes256' };

// encrypts /path/bla.dat into /path/bla and deletes source (temp is a boolean)
exports.encryptFile = function(filename, key, temp, callback) {
  var source = storageLocation + exports.getHashedName(filename, key) + '.dat';
  var destination = storageLocation + exports.getHashedName(filename, key);
  if(temp) destination += '.temp';

  encryptor.encryptFile(source, destination, key, function(err) {
    if(err) {
      log('local', 'Encryption Error ' + err);
      throw err;
    }
    exports.removeFile(source);
    callback();
  });
}

// decrypts /path/bla into /path/bla.dat and DOES NOT delete source
exports.decryptFile = function(filename, key, temp, callback) {
  var source = storageLocation + exports.getHashedName(filename, key);
  var destination = storageLocation + exports.getHashedName(filename, key) + '.dat';
  if(temp) source += '.temp';

  encryptor.decryptFile(source, destination, key, function(err) {
    if(err) {
      log('local', 'Decryption Error ' + err);
      throw err;
    }
    callback();
  });
}

exports.removeFile = function(path) {
  fs.unlinkSync(path);
}

exports.getHashedName = function(name, key) {
  return crypto.createHash('md5').update(key + '-' + name).digest('hex');
}
