var constants = require('./constants');

module.exports = function(stream){
  // parse out midi header segment
  stream.buffer('header', 4);
  stream.tap(function(vals){
    if (!vals.header)
      return this.emit('error', new Error('Failed to parse header'));

    vals.header = vals.header.toString();

    if (vals.header !== constants.header)
      return this.emit('error', new Error('Invalid header value '+vals.header));
  });

  // parse out track chunk size
  stream.word32bu('chunkSize');
  stream.tap(function(vals){
    if (!vals.chunkSize)
      return this.emit('error', new Error('Failed to parse chunkSize'));

    if (vals.chunkSize !== constants.chunkSize)
      return this.emit('error', new Error('Invalid chunkSize value '+vals.chunkSize));
  });

  // parse midi file format
  stream.word16bu('format');
  stream.tap(function(vals){
    if (!vals.format)
      return this.emit('error', new Error('Failed to parse track format'));

    if (!~constants.supportedFormats.indexOf(vals.format))
      return this.emit('error', new Error('Invalid format value '+vals.format+ ' supported formats are '+JSON.stringify(constants.supportedFormats)));
  });

  // parse out track count
  stream.word16bu('tracks');
  stream.tap(function(vals){
    if (!vals.tracks)
      return this.emit('error', new Error('Failed to parse track count'));

    if (vals.tracks < 1)
      return this.emit('error', new Error('Invalid track count value '+vals.tracks));
  });

  // parse out time division type
  stream.buffer('timeDivisionType', 1);
  stream.tap(function(vals){
    if (!vals.timeDivisionType)
      return this.emit('error', new Error('Failed to parse time division type'));

    vals.timeDivisionType = vals.timeDivisionType[0];

    if (!constants.timeDivisions[vals.timeDivisionType])
      return this.emit('error', new Error('Invalid time division type value '+vals.timeDivisionType));

    vals.timeDivisionType = constants.timeDivisions[vals.timeDivisionType];

    if (vals.timeDivisionType === 'tpb') {
      this.buffer('timeDivision', 1);
    // TODO: tests for this
    // TODO: parse SMTPE frame count and clock ticks per frame
    } else if (vals.timeDivisionType === 'fps') {
      this.buffer('timeDivision', 1);
    }
  });

  stream.tap(function(vals){
    if (!vals.timeDivision)
      return this.emit('error', new Error('Failed to parse time division'));

    // TODO: adjust for tpb/fps
    vals.timeDivision = vals.timeDivision[0];
  });

  return stream;
};