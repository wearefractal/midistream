var constants = require('./constants');
var parseTrack = require('./parseTrack');

module.exports = function(stream){
  stream.tap(function(){
    stream.tracksLeft = this.vars.trackCount;
    stream.tracks = []; // hack for loop not working
  });

  stream.loop('tracks', function(end){
    parseTrack(stream, this);

    this.tap(function(){
      stream.tracks.push(this.vars);
      stream.emit('track', this.vars);
      
      if (--stream.tracksLeft === 0) {
        return end();
      }
    });
  });

  stream.tap(function(){
    this.vars.tracks = stream.tracks;
    delete stream.tracks;
    delete stream.tracksLeft;
  });
  return stream;
};