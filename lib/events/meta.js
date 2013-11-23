var constants = require('../constants');
var readVarInt = require('../readVarInt');

module.exports = function(parent, stream){

  // parse out event subtype
  stream.buffer('subtype', 1);

  stream.tap(function(){
    if (typeof this.vars.subtype  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event subtype'));

    this.vars.subtype = this.vars.subtype[0];
  });

  // read variable length data packet
  readVarInt(stream, 'dataSize');
  stream.tap(function(){
    if (typeof this.vars.dataSize  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event dataSize'));

  });

  stream.buffer('data', 'dataSize');
  stream.tap(function(){
    console.log(this.vars);
  });

  return stream;
};