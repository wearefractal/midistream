module.exports = function (stream, key, zigzag) {
  stream.loop(function(end, vars){
    if (!vars.started) {
      vars.pos = 0;
      vars[key] = 0;
      vars.started = true;
    }

    if (typeof vars.last !== 'undefined' && vars.last[0] < 0x80) {
      if (zigzag) vars[key] = (vars[key] >>> 1) ^ -(vars[key] & 1);
      // cleanup and kill it
      delete vars.pos;
      delete vars.started;
      delete vars.last;
      return end();
    }

    if (typeof vars.last !== 'undefined'){
      // there was a previous iteration
      // calculate it in
      vars[key] += (vars.last[0] & 0x7F) << (7 * vars.pos);
    }
    vars.pos++;
    this.buffer('last', 1);
  });
  return stream;
};