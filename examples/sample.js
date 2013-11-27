var midistream = require('../');

var fs = require('fs');
var path = require('path');
var midiFile = path.join(__dirname, './minute_waltz.mid');

// create a parse stream
var parser = midistream.createStream();
var chopin = fs.createReadStream(midiFile);

parser.on('done', function(file){
  console.dir(file.tracks[0]);
});

chopin.pipe(parser);