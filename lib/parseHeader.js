var constants = require('./constants');

module.exports = function(stream){
  // parse out midi header segment
  stream.buffer('header', 4);
  stream.tap(function(song){
    if (typeof song.header === 'undefined')
      return stream.emit('error', new Error('Failed to parse header'));

    song.header = song.header.toString();

    if (song.header !== constants.header)
      return stream.emit('error', new Error('Invalid header value '+song.header));
  });

  // parse out track chunk size
  stream.word32bu('chunkSize');
  stream.tap(function(song){
    if (typeof song.chunkSize === 'undefined')
      return stream.emit('error', new Error('Failed to parse chunkSize'));

    if (song.chunkSize !== constants.chunkSize)
      return stream.emit('error', new Error('Invalid chunkSize value '+song.chunkSize));
  });

  // parse midi file format
  stream.word16bu('format');
  stream.tap(function(song){
    if (typeof song.format === 'undefined')
      return stream.emit('error', new Error('Failed to parse track format'));

    if (!~constants.supportedFormats.indexOf(song.format))
      return stream.emit('error', new Error('Invalid format value '+song.format+ ' supported formats are '+JSON.stringify(constants.supportedFormats)));
  });

  // parse out track count
  stream.word16bu('trackCount');
  stream.tap(function(song){
    if (typeof song.trackCount === 'undefined')
      return stream.emit('error', new Error('Failed to parse track count'));

    if (song.trackCount < 1)
      return stream.emit('error', new Error('Invalid track count value '+song.trackCount));
  });

  // parse out time division type
  stream.buffer('timeDivisionType', 1);
  stream.tap(function(song){
    if (typeof song.timeDivisionType === 'undefined')
      return stream.emit('error', new Error('Failed to parse time division type'));

    song.timeDivisionType = song.timeDivisionType[0];

    if (!constants.timeDivisions[song.timeDivisionType])
      return stream.emit('error', new Error('Invalid time division type value '+song.timeDivisionType));

    song.timeDivisionType = constants.timeDivisions[song.timeDivisionType];

    if (song.timeDivisionType === 'tpb') {
      this.buffer('timeDivision', 1);
    } else if (song.timeDivisionType === 'fps') {
      // TODO: tests for this
      // TODO: parse SMTPE frame count and clock ticks per frame
      return stream.emit('error', new Error('SMPTE frames not supported'));
      //this.buffer('timeDivision', 1);
    }
  });

  stream.tap(function(song){
    if (typeof song.timeDivision === 'undefined')
      return stream.emit('error', new Error('Failed to parse time division'));

    // TODO: adjust for tpb/fps
    song.timeDivision = song.timeDivision[0];
  });

  stream.tap(stream.emit.bind(stream, 'header'));
  return stream;
};