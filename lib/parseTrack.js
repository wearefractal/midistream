var constants = require('./constants');

module.exports = function(trackNum, parent, stream){
  // parse out track header segment
  stream.buffer('header', 4);
  stream.tap(function(vals){
    if (typeof vals.header  === 'undefined')
      return parent.emit('error', new Error('Failed to parse track header'));

    vals.header = vals.header.toString();

    if (vals.header !== constants.tracks.header)
      return parent.emit('error', new Error('Invalid track header value '+vals.header));
  });

  // parse out track chunk size
  stream.word32bu('chunkSize');
  stream.tap(function(vals){
    if (typeof vals.chunkSize === 'undefined')
      return parent.emit('error', new Error('Failed to parse chunkSize'));
  });

  // emit header info
  stream.tap(parent.emit.bind(parent, 'trackHeader', trackNum));

  stream.skip('chunkSize');
  return stream;
};