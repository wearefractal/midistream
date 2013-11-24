module.exports = function(byt) {
  // meta events
  if ((byt & 0xf0) === 0xf0) {
    if (byt === 0xf0) return 'sysex';
    if (byt === 0xf7) return 'sysexDivided';
    return 'meta';
  }

  // channel events
  if ((byt & 0x80) === 0) {
    return 'continuation';
  }
  
  return 'channel';
};