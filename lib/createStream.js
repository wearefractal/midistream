var binary = require('binary');

var parseHeader = require('./parseHeader');
var parseTracks = require('./parseTracks');

module.exports = function(opt){
  var stream = binary();
  stream = parseHeader(stream);
  stream = parseTracks(stream);
  return stream;
};