var constants = require('./constants');
var parseTrack = require('./parseTrack');

module.exports = function(stream){
  stream.tap(function(){
    this.vars.tracksLeft = this.vars.trackCount;
  });

  stream.loop('tracks', function(end){
    if (this.vars.tracksLeft === 0) {
      delete this.vars.tracksLeft;
      return end(true);
    }
    --this.vars.tracksLeft;
    parseTrack(stream, this);
  });
  return stream;
};