var Dissolve = require('dissolve');

var parseHeader = require('./parseHeader');
var parseTracks = require('./parseTracks');

module.exports = function(opt){
  var stream = Dissolve();
  parseHeader(stream, opt);
  parseTracks(stream, opt);
  stream.tap(function(){
    stream.emit('done', this.vars);
  });
  return stream;
};