var constants = require('./constants');

module.exports = function(stream){
  // parse out midi header segment
  stream.buffer('header', 4);
  stream.tap(function(headerInfo){
    if (typeof headerInfo.header === 'undefined')
      return stream.emit('error', new Error('Failed to parse header'));

    headerInfo.header = headerInfo.header.toString();

    if (headerInfo.header !== constants.header)
      return stream.emit('error', new Error('Invalid header value '+headerInfo.header));
  });

  // parse out track chunk size
  stream.word32bu('chunkSize');
  stream.tap(function(headerInfo){
    if (typeof headerInfo.chunkSize === 'undefined')
      return stream.emit('error', new Error('Failed to parse chunkSize'));

    if (headerInfo.chunkSize !== constants.chunkSize)
      return stream.emit('error', new Error('Invalid chunkSize value '+headerInfo.chunkSize));
  });

  // parse midi file format
  stream.word16bu('format');
  stream.tap(function(headerInfo){
    if (typeof headerInfo.format === 'undefined')
      return stream.emit('error', new Error('Failed to parse track format'));

    if (!~constants.supportedFormats.indexOf(headerInfo.format))
      return stream.emit('error', new Error('Invalid format value '+headerInfo.format+ ' supported formats are '+JSON.stringify(constants.supportedFormats)));
  });

  // parse out track count
  stream.word16bu('trackCount');
  stream.tap(function(headerInfo){
    if (typeof headerInfo.trackCount === 'undefined')
      return stream.emit('error', new Error('Failed to parse track count'));

    if (headerInfo.trackCount < 1)
      return stream.emit('error', new Error('Invalid track count value '+headerInfo.trackCount));
  });

  // parse out time division type
  stream.buffer('timeDivisionType', 1);
  stream.tap(function(headerInfo){
    if (typeof headerInfo.timeDivisionType === 'undefined')
      return stream.emit('error', new Error('Failed to parse time division type'));

    headerInfo.timeDivisionType = headerInfo.timeDivisionType[0];

    if (!constants.timeDivisions[headerInfo.timeDivisionType])
      return stream.emit('error', new Error('Invalid time division type value '+headerInfo.timeDivisionType));

    headerInfo.timeDivisionType = constants.timeDivisions[headerInfo.timeDivisionType];

    if (headerInfo.timeDivisionType === 'tpb') {
      this.buffer('timeDivision', 1);
    } else if (headerInfo.timeDivisionType === 'fps') {
      // TODO: tests for this
      // TODO: parse SMTPE frame count and clock ticks per frame
      return stream.emit('error', new Error('SMPTE frames not supported'));
      //this.buffer('timeDivision', 1);
    }
  });

  stream.tap(function(headerInfo){
    if (typeof headerInfo.timeDivision === 'undefined')
      return stream.emit('error', new Error('Failed to parse time division'));

    // TODO: adjust for tpb/fps
    headerInfo.timeDivision = headerInfo.timeDivision[0];
  });

  stream.tap(stream.emit.bind(stream, 'header'));
  return stream;
};