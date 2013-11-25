module.exports = function(status) {
  // meta events
  if ((status & 0xf0) === 0xf0) {
    if (status === 0xf0) return 'sysex';
    if (status === 0xf7) return 'sysexDivided';
    return 'meta';
  }

  // channel events
  if ((status & 0x80) === 0) {
    return 'channelContinuation';
  }

  return 'channel';
};