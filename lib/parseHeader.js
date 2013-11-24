var constants = require('./constants');

module.exports = function(stream){
  // parse out midi header segment
  stream.string('header', 4);
  stream.tap(function(){
    if (typeof this.vars.header === 'undefined')
      return stream.emit('error', new Error('Failed to parse header'));

    if (this.vars.header !== constants.header)
      return stream.emit('error', new Error('Invalid header value '+this.vars.header));
  });

  // parse out track chunk size
  stream.uint32be('chunkSize');
  stream.tap(function(){
    if (typeof this.vars.chunkSize === 'undefined')
      return stream.emit('error', new Error('Failed to parse chunkSize'));

    if (this.vars.chunkSize !== constants.chunkSize)
      return stream.emit('error', new Error('Invalid chunkSize value '+this.vars.chunkSize));
  });

  // parse midi file format
  stream.uint16be('format');
  stream.tap(function(){
    if (typeof this.vars.format === 'undefined')
      return stream.emit('error', new Error('Failed to parse track format'));

    if (!~constants.supportedFormats.indexOf(this.vars.format))
      return stream.emit('error', new Error('Invalid format value '+this.vars.format+ ' supported formats are '+JSON.stringify(constants.supportedFormats)));
  });

  // parse out track count
  stream.uint16be('trackCount');
  stream.tap(function(){
    if (typeof this.vars.trackCount === 'undefined')
      return stream.emit('error', new Error('Failed to parse track count'));

    if (this.vars.trackCount < 1)
      return stream.emit('error', new Error('Invalid track count value '+this.vars.trackCount));
  });

  // parse out time division type
  stream.buffer('timeDivisionType', 1);
  stream.tap(function(){
    if (typeof this.vars.timeDivisionType === 'undefined')
      return stream.emit('error', new Error('Failed to parse time division type'));

    this.vars.timeDivisionType = this.vars.timeDivisionType[0];

    if (!constants.timeDivisions[this.vars.timeDivisionType])
      return stream.emit('error', new Error('Invalid time division type value '+this.vars.timeDivisionType));

    this.vars.timeDivisionType = constants.timeDivisions[this.vars.timeDivisionType];

    if (this.vars.timeDivisionType === 'tpb') {
      this.uint8be('timeDivision', 1);
    } else if (this.vars.timeDivisionType === 'fps') {
      // TODO: tests for this
      // TODO: parse SMTPE frame count and clock ticks per frame
      return stream.emit('error', new Error('SMPTE frames not supported'));
      //this.buffer('timeDivision', 1);
    }
  });

  stream.tap(function(){
    if (typeof this.vars.timeDivision === 'undefined')
      return stream.emit('error', new Error('Failed to parse time division'));

    // TODO: adjust for tpb/fps
  });

  stream.tap(function(){
    stream.emit('header', this.vars);
  });
  
  return stream;
};