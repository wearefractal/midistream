var midistream = require('../');

var fs = require('fs');

// create a parse stream
var parser = midistream.createStream();
var chopin = fs.createReadStream('chopin-nocturne-op9-num2.mid');

chopin.pipe(parser);