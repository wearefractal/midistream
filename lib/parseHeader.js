var constants = require('./constants');

module.exports = function(stream){
  // parse out midi header segment
  stream.buffer('header', 4);
  stream.tap(function(vars){
    if (typeof vars.header === 'undefined')
      return stream.emit('error', new Error('Failed to parse header'));

    vars.header = vars.header.toString();

    if (vars.header !== constants.header)
      return stream.emit('error', new Error('Invalid header value '+vars.header));
  });

  // parse out track chunk size
  stream.word32bu('chunkSize');
  stream.tap(function(vars){
    if (typeof vars.chunkSize === 'undefined')
      return stream.emit('error', new Error('Failed to parse chunkSize'));

    if (vars.chunkSize !== constants.chunkSize)
      return stream.emit('error', new Error('Invalid chunkSize value '+vars.chunkSize));
  });

  // parse midi file format
  stream.word16bu('format');
  stream.tap(function(vars){
    if (typeof vars.format === 'undefined')
      return stream.emit('error', new Error('Failed to parse track format'));

    if (!~constants.supportedFormats.indexOf(vars.format))
      return stream.emit('error', new Error('Invalid format value '+vars.format+ ' supported formats are '+JSON.stringify(constants.supportedFormats)));
  });

  // parse out track count
  stream.word16bu('trackCount');
  stream.tap(function(vars){
    if (typeof vars.trackCount === 'undefined')
      return stream.emit('error', new Error('Failed to parse track count'));

    if (vars.trackCount < 1)
      return stream.emit('error', new Error('Invalid track count value '+vars.trackCount));
  });

  // parse out time division type
  stream.buffer('timeDivisionType', 1);
  stream.tap(function(vars){
    if (typeof vars.timeDivisionType === 'undefined')
      return stream.emit('error', new Error('Failed to parse time division type'));

    vars.timeDivisionType = vars.timeDivisionType[0];

    if (!constants.timeDivisions[vars.timeDivisionType])
      return stream.emit('error', new Error('Invalid time division type value '+vars.timeDivisionType));

    vars.timeDivisionType = constants.timeDivisions[vars.timeDivisionType];

    if (vars.timeDivisionType === 'tpb') {
      this.buffer('timeDivision', 1);
    } else if (vars.timeDivisionType === 'fps') {
      // TODO: tests for this
      // TODO: parse SMTPE frame count and clock ticks per frame
      return stream.emit('error', new Error('SMPTE frames not supported'));
      this.buffer('timeDivision', 1);
    }
  });

  stream.tap(function(vars){
    if (typeof vars.timeDivision === 'undefined')
      return stream.emit('error', new Error('Failed to parse time division'));

    // TODO: adjust for tpb/fps
    vars.timeDivision = vars.timeDivision[0];
  });

  stream.tap(stream.emit.bind(stream, 'header'));
  return stream;
};