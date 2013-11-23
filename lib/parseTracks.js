var constants = require('./constants');
var parseTrack = require('./parseTrack');

module.exports = function(stream){
  stream.loop('tracks', function(end){
    if (this.vars.lastTrack >= this.vars.trackCount-1) {
      delete this.vars.lastTrack;
      return end(true);
    }

    if (typeof this.vars.lastTrack === 'undefined') {
      this.vars.lastTrack = 0;
    } else {
      this.vars.lastTrack++;
    }

    parseTrack(stream, this);
  });
  return stream;
};