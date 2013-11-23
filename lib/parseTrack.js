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
    parseEvent(parent, this);

    this.tap(function(){
      // check for end of track
      if (this.vars.eventType === 'meta' && this.vars.subtype === 47) {
        return end(true);
      }
    });
  });
 
  // skip the unparsed event chunks
  //stream.buffer('contents', 'chunkSize');
  return stream;
};