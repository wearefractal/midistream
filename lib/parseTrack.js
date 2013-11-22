var constants = require('./constants');
var parseEvent = require('./parseEvent');

module.exports = function(trackNum, parent, stream){
  // parse out track header segment
  stream.buffer('header', 4);
  stream.tap(function(vars){
    if (typeof vars.header  === 'undefined')
      return parent.emit('error', new Error('Failed to parse track header'));

    vars.header = vars.header.toString();

    if (vars.header !== constants.tracks.header)
      return parent.emit('error', new Error('Invalid track header value '+vars.header));
  });

  // parse out track chunk size
  stream.word32bu('chunkSize');
  stream.tap(function(vars){
    if (typeof vars.chunkSize === 'undefined')
      return parent.emit('error', new Error('Failed to parse chunkSize'));
  });

  // emit header info
  stream.tap(parent.emit.bind(parent, 'trackHeader', trackNum));

  // parse track events
  /*
  stream.loop(function(end, vars){
    //if (vars.lastEvent >= 1) return end();
    vars.lastEvent = (typeof vars.lastTrack === 'undefined' ? 0 : ++vars.lastEvent);

    this.into('events.'+vars.lastEvent, function(){
      parseEvent(vars.lastEvent, parent, this);
    });
    return end();
  });
  */
  // skip the unparsed event chunks for now
  //stream.scan('junk', new Buffer(constants.tracks.header));
  stream.skip('chunkSize');
  return stream;
};