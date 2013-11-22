var path = require('path');
var fs = require('fs');
var binary = require('binary');

var should = require('should');
require('mocha');

var parseHeader = require('../lib/parseHeader');
var parseTracks = require('../lib/parseTracks');
var constants = require('../lib/constants');

var chopinPath = path.join(__dirname, './fixtures/chopin.mid');
var chopin = fs.createReadStream(chopinPath);

describe('parseTracks()', function() {
  it('should parse a MIDI header correctly', function(done) {
    var parser = binary();
    parser.once('error', done);

    parseHeader(parser);
    parseTracks(parser);

    parser.tap(function(vars){
      should.exist(vars.tracks, 'should have created tracks');
      console.log(vars);
      should.exist(vars.tracks["1"], 'should have created track 1');
      should.exist(vars.tracks["2"], 'should have created track 2');
      should.exist(vars.tracks["3"], 'should have created track 3');
      should.exist(vars.tracks["4"], 'should have created track 4');
      should.exist(vars.tracks["5"], 'should have created track 5');
      done();
    });

    chopin.pipe(parser);
  });
});