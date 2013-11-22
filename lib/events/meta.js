var constants = require('../constants');
var readVarInt = require('../readVarInt');

module.exports = function(parent, stream){

  // parse out event subtype
  stream.buffer('subtype', 1);

  stream.tap(function(event){
    if (typeof event.subtype  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event subtype'));

    event.subtype = event.subtype[0];
  });

  // read variable length data packet
  readVarInt(stream, 'dataSize');
  stream.tap(function(event){
    if (typeof event.dataSize  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event dataSize'));

    console.log(event);
  });

  return stream;
};