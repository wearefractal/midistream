var constants = require('./constants');
var readVarInt = require('./readVarInt');
var events = require('./events');

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
    this.vars.eventType = constants.eventTypes[this.vars.type];

    if (!this.vars.eventType)
      return parent.emit('error', new Error('Invalid event type value '+this.vars.type));

  });


  // call event parser if found
  // TODO: figure out why this is going haywire
  stream.tap(function(){
    var handler = events[this.vars.eventType];

    if (handler) {
      console.log(this.vars.eventType, this.vars);
      handler(parent, this);
    }

  });
  return stream;
};