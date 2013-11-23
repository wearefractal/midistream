var constants = require('../constants');
var readVarInt = require('../readVarInt');

module.exports = function(parent, stream){

  // parse out event channel
  stream.buffer('channel', 4);

  stream.tap(function(){
    if (typeof this.vars.channel  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event channel'));
  });

  // parse out event param1 and param2
  stream.buffer('data', 2);

  stream.tap(function(){
    if (typeof this.vars.data  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event data'));
  });
  return stream;
};