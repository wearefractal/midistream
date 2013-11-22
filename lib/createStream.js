var binary = require('binary');

var parseHeader = require('./parseHeader');

module.exports = function(opt){
  var stream = binary();
  parseHeader(stream);
  parseTracks(stream);
  return stream;
};