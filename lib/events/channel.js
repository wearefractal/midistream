var constants = require('../constants');
var readVarInt = require('../readVarInt');

module.exports = function(parent, stream){

  // parse out event channel
  /*
  stream.uint8be('channel');

  stream.tap(function(){
    if (typeof this.vars.channel  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event channel'));
  });
  */

  stream.tap(function(){
    var type = this.vars.type;
    this.vars.type = type >> 4;
    this.vars.channel = type & 0x0f;
  });

  // parse out event param1 and param2
  stream.buffer('data', 2);

  stream.tap(function(){
    if (typeof this.vars.data  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event data'));
  });

  // TODO: make the event nice
  return stream;
};