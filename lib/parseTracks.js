var constants = require('./constants');
var parseTrack = require('./parseTrack');

module.exports = function(stream){
  stream.loop(function(end, song){
    if (song.lastTrack === song.trackCount-1) {
      delete song.lastTrack;
      return end();
    }

    if (typeof song.lastTrack === 'undefined') {
      song.lastTrack = 0;
    } else {
      song.lastTrack++;
    }

    this.into('tracks.'+song.lastTrack, function(track){
      parseTrack(stream, this, track);
    });
  });
  return stream;
};