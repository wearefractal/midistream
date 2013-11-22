var constants = require('./constants');
var readVarInt = require('./readVarInt');

module.exports = function(eventNum, parent, stream, event){
  // parse out event delta time
  readVarInt(stream, 'deltaTime');

  stream.tap(function(vars){
    if (typeof vars.deltaTime  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event delta time'));
  });

  // parse out event type
  stream.buffer('type', 1);
  stream.tap(function(vars){
    if (typeof vars.type  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event type'));

    vars.type = vars.type[0];

    if (constants.events[vars.type])
      return parent.emit('error', new Error('Invalid event type value '+vars.type));
  });

  stream.word32bu('subtype', 1);
  stream.tap(function(vars){
    if (typeof vars.subtype  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event subtype'));

    console.log(vars);

    if (constants.events[vars.type])
      return parent.emit('error', new Error('Invalid event subtype value '+vars.type));
  });

  return stream;
};