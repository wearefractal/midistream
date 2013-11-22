var constants = require('./constants');
var readVarInt = require('./readVarInt');
var events = require('./events');

module.exports = function(parent, stream){
  // parse out event delta time
  readVarInt(stream, 'deltaTime');

  stream.tap(function(event){
    if (typeof event.deltaTime  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event delta time'));
  });

  // parse out event type
  stream.buffer('type', 1);
  stream.tap(function(event){
    if (typeof event.type  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event type'));

    event.type = event.type[0];
    event.eventType = constants.eventTypes[event.type];

    if (!event.eventType)
      return parent.emit('error', new Error('Invalid event type value '+event.type));

  });

  // call event parser if found
  stream.tap(function(event){
    var handler = events[event.eventType];
    if (handler) {
      console.log(event.eventType, event);
      handler(parent, this);
    }
  });
  return stream;
};