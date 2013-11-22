var constants = require('./constants');

module.exports = function(eventNum, parent, stream){
  // parse out event delta time
  stream.word8bu('deltaTime');
  stream.tap(function(vars){
    if (typeof vars.deltaTime  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event delta time'));
  });

  // parse out event type
  stream.buffer('type', 1);
  stream.tap(function(vars){
    if (typeof vars.type  === 'undefined')
      return parent.emit('error', new Error('Failed to parse event type'));

    console.log(vars);

    if (constants.events[vars.type])
      return parent.emit('error', new Error('Invalid event type value '+vars.type));
  });

  return stream;
};