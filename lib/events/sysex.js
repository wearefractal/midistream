var constants = require('../constants');
var readVarInt = require('../readVarInt');
var formatEvent = require('../formatEvent');

module.exports = function(parent, stream){
  // get variable length of data packet
  readVarInt(stream, 'dataSize');
  stream.tap(function(){
    if (typeof this.vars.dataSize  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event dataSize'));
  });

  // read in the data
  stream.buffer('data', 'dataSize');
  stream.tap(function(){
    if (typeof this.vars.data  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event data'));
  });

  formatEvent(parent, stream);
  return stream;
};