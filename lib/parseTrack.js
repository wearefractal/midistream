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

  stream.tap(function(vars){
    vars.tempo = 120; // default tempo is 120bpm
  });

  // emit header info
  stream.tap(parent.emit.bind(parent, 'trackHeader', trackNum));

  /*
  // parse track events
  stream.loop(function(end, vars){
    //console.log(parent);
    //vars.eventCount = 1;
    //if (vars.lastEvent >= vars.eventCount) return end();
    vars.lastEvent = (typeof vars.lastTrack === 'undefined' ? 1 : ++vars.lastEvent);

    this.into('events.'+vars.lastEvent, function(){
      parseEvent(vars.lastEvent, parent, this);
    });
    end();
  });
  */

  // skip the events chunk for now
  stream.skip('chunkSize');
  return stream;
};