module.exports = function(parent, stream) {
  // meta events
  stream.tap(function(){
    if (this.vars.eventType !== 'meta') return;

    // sequence/pattern number
    if (this.vars.subtype === 0) {
      this.vars.subEventType = 'sequenceNumber';
      this.vars.number = this.vars.data.readUInt16BE(0);
      delete this.vars.data;
      return;
    }

    // text
    if (this.vars.subtype === 1) {
      this.vars.subEventType = 'text';
      this.vars.text = this.vars.data.toString();
      delete this.vars.data;
      return;
    }

    // copyright
    if (this.vars.subtype === 2) {
      this.vars.subEventType = 'copyright';
      this.vars.text = this.vars.data.toString();
      delete this.vars.data;
      return;
    }

    // name
    if (this.vars.subtype === 3) {
      this.vars.subEventType = 'trackName';
      this.vars.text = this.vars.data.toString();
      delete this.vars.data;
      return;
    }

    // instrument name
    if (this.vars.subtype === 4) {
      this.vars.subEventType = 'instrumentName';
      this.vars.text = this.vars.data.toString();
      delete this.vars.data;
      return;
    }

    // lyrics
    if (this.vars.subtype === 5) {
      this.vars.subEventType = 'lyric';
      this.vars.text = this.vars.data.toString();
      delete this.vars.data;
      return;
    }

    // marker
    if (this.vars.subtype === 6) {
      this.vars.subEventType = 'marker';
      this.vars.text = this.vars.data.toString();
      delete this.vars.data;
      return;
    }

    // cue point
    if (this.vars.subtype === 7) {
      this.vars.subEventType = 'cue';
      this.vars.text = this.vars.data.toString();
      delete this.vars.data;
      return;
    }

    // midi channel prefix
    if (this.vars.subtype === 32) {
      this.vars.subEventType = 'channelPrefix';
      this.vars.channel = this.vars.data.readUInt8(0);
      delete this.vars.data;
      return;
    }

    // end of track
    if (this.vars.subtype === 47) {
      this.vars.subEventType = 'endOfTrack';
      delete this.vars.data;
      return;
    }

    // set tempo
    if (this.vars.subtype === 81) {
      this.vars.subEventType = 'setTempo';
      // TODO: verify this is correct
      this.vars.microseconds = (this.vars.data.readUInt8(0) << 16) + (this.vars.data.readUInt8(1) << 8) + this.vars.data.readUInt8(2);
      delete this.vars.data;
      return;
    }

    // smpte offset
    if (this.vars.subtype === 84) {
      this.vars.subEventType = 'smpteOffset';
      var hourByte = this.vars.data.readUInt8(0);
      this.vars.frameRate = constants.frameRates[hourByte & 0x60];
      this.vars.hours = hourByte & 0x1f;
      this.vars.minutes = this.vars.data.readUInt8(1);
      this.vars.seconds = this.vars.data.readUInt8(2);
      this.vars.frames = this.vars.data.readUInt8(3);
      this.vars.subFrames = this.vars.data.readUInt8(4);
      delete this.vars.data;
      return;
    }

    // time signature
    if (this.vars.subtype === 88) {
      this.vars.subEventType = 'timeSignature';
      this.vars.numerator = this.vars.data.readUInt8(0);
      this.vars.denominator = Math.pow(2, this.vars.data.readUInt8(1));
      this.vars.metronomePulse = this.vars.data.readUInt8(2);
      this.vars.thirtySeconds = this.vars.data.readUInt8(3);
      delete this.vars.data;
      return;
    }

    // key signature
    if (this.vars.subtype === 89) {
      this.vars.subEventType = 'timeSignature';
      this.vars.key = this.vars.data.readInt8(0);
      this.vars.scale = this.vars.data.readUInt8(0);
      delete this.vars.data;
      return;
    }

    // sequencer specific event
    if (this.vars.subtype === 127) {
      this.vars.subEventType = 'sequencerSpecific';
      return;
    }

  });

  // channel events
  stream.tap(function(){
    if (this.vars.eventType !== 'channel') return;

    // note off
    if (this.vars.type === 8) {
      this.vars.subEventType = 'noteOff';
      this.vars.note = this.vars.data.readUInt8(0);
      this.vars.velocity = this.vars.data.readUInt8(1);
      delete this.vars.data;
      return;
    }

    // note on (also legacy note off)
    if (this.vars.type === 9) {
      this.vars.subEventType = 'noteOn';
      this.vars.note = this.vars.data.readUInt8(0);
      this.vars.velocity = this.vars.data.readUInt8(1);

      // legacy note off support i guess
      if (this.vars.velocity === 0) {
        this.vars.subEventType = 'noteOff';
      }

      delete this.vars.data;
      return;
    }

    // note after touch
    if (this.vars.type === 10) {
      this.vars.subEventType = 'noteAftertouch';
      this.vars.note = this.vars.data.readUInt8(0);
      this.vars.amount = this.vars.data.readUInt8(1);
      delete this.vars.data;
      return;
    }

    // controller
    if (this.vars.type === 11) {
      this.vars.subEventType = 'controller';
      this.vars.controllerType = this.vars.data.readUInt8(0);
      this.vars.value = this.vars.data.readUInt8(1);
      delete this.vars.data;
      return;
    }

    // program change
    if (this.vars.type === 12) {
      this.vars.subEventType = 'programChange';
      this.vars.programNumber = this.vars.data.readUInt8(0);
      delete this.vars.data;
      return;
    }

    // channel after touch
    if (this.vars.type === 13) {
      this.vars.subEventType = 'channelAftertouch';
      this.vars.amount = this.vars.data.readUInt8(0);
      delete this.vars.data;
      return;
    }

    // pitch bend
    if (this.vars.type === 14) {
      this.vars.subEventType = 'pitchBend';
      this.vars.value = this.vars.data.readUInt8(0) + (this.vars.data.readUInt8(1) << 7);
      delete this.vars.data;
      return;
    }

  });

};