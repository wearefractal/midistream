module.exports = function(byte) {
  // meta events
  if ((byte & 0xf0) === 0xf0) {
    if (byte === 0xf0) return 'sysex';
    if (byte === 0xf7) return 'sysexDivided';
    return 'meta';
  }

  // channel events
  //if ((byte & 0x80) === 0) return 'continuation';
  return 'channel';
};