var constants = require('./constants');
var readVarInt = require('./readVarInt');
var events = require('./events');
var findEventType = require('./findEventType');

module.exports = function(parent, stream){
  // parse out event delta time
  readVarInt(stream, 'deltaTime');

  stream.tap(function(){
    if (typeof this.vars.deltaTime  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event delta time'));
  });

  // parse out event type
  stream.buffer('type', 1);
  stream.tap(function(){
    if (typeof this.vars.type  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event type'));

    this.vars.type = this.vars.type[0];
    this.vars.eventType = findEventType(this.vars.type);

    if (!this.vars.eventType)
      return parent.emit('error', new Error('Invalid event type value '+this.vars.type));
  });


  // call event parser if found
  stream.tap(function(){
    var handler = events[this.vars.eventType];

    if (!handler)
      return parent.emit('error', new Error('Invalid MIDI message (no event handler) '+this.vars));

    handler(parent, this);
  });

  stream.tap(function(){
    console.log(this.vars);
  });
  return stream;
};