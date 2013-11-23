module.exports = function (stream, key) {
  stream.loop(function(end){
    // get it started
    if (typeof this.vars.pos === 'undefined') {
      this.vars.pos = 0;
      this.vars[key] = 0;
    }

    // calculate previous iteration
    if (typeof this.vars.last !== 'undefined'){

      this.vars[key] += (this.vars.last[0] & 0x7F) << (7 * this.vars.pos);
      this.vars.pos++;

      // this is our last iteration
      if (this.vars.last[0] < 0x80) {
        // cleanup and kill it
        delete this.vars.pos;
        delete this.vars.last;
        return end();
      }
    }

    this.buffer('last', 1);
  });
  return stream;
};