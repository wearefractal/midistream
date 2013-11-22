var constants = require('./constants');
var parseTrack = require('./parseTrack');

module.exports = function(stream){
  stream.loop(function(end, vars){
    if (vars.lastTrack >= vars.trackCount) return end();
    vars.lastTrack = (typeof vars.lastTrack === 'undefined' ? 1 : ++vars.lastTrack);

    this.into('tracks.'+vars.lastTrack, function(track){
      parseTrack(vars.lastTrack, stream, this);
    });
  });
  return stream;
};