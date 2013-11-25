var constants = require('./constants');
var parseTrack = require('./parseTrack');

module.exports = function(stream){
  stream.tap(function(){
    stream.tracksLeft = this.vars.trackCount;
  });

  stream.loop('tracks', function(end){
    parseTrack(stream, this);

    if (--stream.tracksLeft === 0) {
      return end();
    }
  });

  return stream;
};