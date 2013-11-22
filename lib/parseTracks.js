var constants = require('./constants');
var parseTrack = require('./parseTrack');

module.exports = function(stream){
  stream.loop(function(end, vars){
    if (vars.lastTrack === vars.trackCount-1) {
      return end();
    }
    vars.lastTrack = (typeof vars.lastTrack === 'undefined' ? 0 : ++vars.lastTrack);

    this.into('tracks.'+vars.lastTrack, function(){
      parseTrack(stream, this);
    });
  });
  return stream;
};