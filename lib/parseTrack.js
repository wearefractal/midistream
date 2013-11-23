var constants = require('./constants');
var parseEvent = require('./parseEvent');

module.exports = function(parent, stream){
  // parse out track header segment
  stream.string('header', 4);
  stream.tap(function(){
    if (typeof this.vars.header  === 'undefined')
      return parent.emit('error', new Error('Failed to parse track header'));

    if (this.vars.header !== constants.tracks.header)
      return parent.emit('error', new Error('Invalid track header value '+this.vars.header));
  });

  // parse out track chunk size
  stream.uint32be('chunkSize');
  stream.tap(function(){
    if (typeof this.vars.chunkSize === 'undefined')
      return parent.emit('error', new Error('Failed to parse track chunkSize'));
  });

  // emit header info
  stream.tap(function(){
    parent.emit('trackHeader', this.vars);
  });

  // parse track events
  stream.loop('events', function(end){
    // TODO: end when startOffset+chunkSize == currentOffset
    // right now it is only parsing the first event of the track
    if (this.vars.lastEvent >= 0) {
      delete this.vars.lastEvent;
      return end(true);
    }

    if (typeof this.vars.lastEvent === 'undefined') {
      this.vars.lastEvent = 0;
    } else {
      this.vars.lastEvent++;
    }

    parseEvent(parent, this);
  });
 
  // skip the unparsed event chunks
  //stream.buffer('contents', 'chunkSize');
  return stream;
};