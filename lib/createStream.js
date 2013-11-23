var Dissolve = require('dissolve');

var parseHeader = require('./parseHeader');
var parseTracks = require('./parseTracks');

module.exports = function(opt){
  var stream = Dissolve();
  stream = parseHeader(stream);
  stream = parseTracks(stream);
  return stream;
};