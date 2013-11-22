var constants = require('./constants');
var parseEvent = require('./parseEvent');

module.exports = function(parent, stream){
  // parse out track header segment
  stream.buffer('header', 4);
  stream.tap(function(track){
    if (typeof track.header  === 'undefined')
      return parent.emit('error', new Error('Failed to parse track header'));

    track.header = track.header.toString();

    if (track.header !== constants.tracks.header)
      return parent.emit('error', new Error('Invalid track header value '+track.header));
  });

  // parse out track chunk size
  stream.word32bu('chunkSize');
  stream.tap(function(track){
    if (typeof track.chunkSize === 'undefined')
      return parent.emit('error', new Error('Failed to parse chunkSize'));
  });

  // emit header info
  stream.tap(function(track){
    parent.emit('trackHeader', track);
  });

  // parse track events
  stream.loop(function(end, track){
    if (track.lastEvent >= 0) {
      delete track.lastEvent;
      return end();
    }

    if (typeof track.lastEvent === 'undefined') {
      track.lastEvent = 0;
    } else {
      track.lastEvent++;
    }

    this.into('events.'+track.lastEvent, function(){
      parseEvent(parent, this);
    });
  });

  // skip the unparsed event chunks
  //stream.skip('chunkSize');
  return stream;
};