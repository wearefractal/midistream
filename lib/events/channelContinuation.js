var constants = require('../constants');
var readVarInt = require('../readVarInt');

module.exports = function(parent, stream){

  stream.tap(function(){
    this.vars.oldType = this.vars.type;
    this.vars.type = parent.lastEvent.type;
  });

  stream.tap(function(){
    var type = this.vars.type;
    this.vars.type = type >> 4;
    this.vars.channel = type & 0x0f;
  });

  // parse out event param1
  stream.buffer('data', 1);

  stream.tap(function(){
    if (typeof this.vars.data  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event data'));
  });

  // recombine param1 and param2
  stream.tap(function(){
    this.vars.data = new Buffer([this.vars.data[0], this.vars.oldType]);
    delete this.vars.oldType;
  });

  // TODO: make the event nice
  return stream;
};