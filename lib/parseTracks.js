var constants = require('./constants');
var parseTrack = require('./parseTrack');

module.exports = function(stream){
  stream.loop(function(end, vars){
    vars.index = (typeof vars.index === 'undefined' ? 1 : vars.index+1);
    if (vars.index > vars.trackCount) return end();

    this.into('tracks.'+vars.index, function(track){
      console.log('parsing track', vars.index);
      parseTrack(this);
    });
  });
  return stream;
};