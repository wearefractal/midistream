module.exports = function (stream, key) {
  stream.loop(function(end){
    if (!this.vars.started) {
      this.vars.pos = 0;
      this.vars[key] = 0;
      this.vars.started = true;
    }
    if (typeof this.vars.last !== 'undefined'){
      // there was a previous iteration
      // calculate it in
      this.vars[key] += (this.vars.last[0] & 0x7F) << (7 * this.vars.pos);
      this.vars.pos++;

      if (this.vars.last[0] < 0x80) {
        // cleanup and kill it
        delete this.vars.pos;
        delete this.vars.started;
        delete this.vars.last;
        return end(true);
      }
    }

    this.buffer('last', 1);
  });
  return stream;
};