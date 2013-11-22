var path = require('path');
var fs = require('fs');
var binary = require('binary');

var should = require('should');
require('mocha');

var parseHeader = require('../lib/parseHeader');
var constants = require('../lib/constants');

var chopinPath = path.join(__dirname, './fixtures/chopin.mid');
var chopin = fs.createReadStream(chopinPath);

describe('parseHeader()', function() {
  it('should parse a MIDI header correctly', function(done) {
    var expected = {
      header: 'MThd',
      chunkSize: 6,
      format: 1,
      trackCount: 5,
      timeDivisionType: 'tpb',
      timeDivision: 48
    };

    var parser = binary();
    parser.once('error', done);

    var returnVal = parseHeader(parser);
    should.exist(returnVal, 'should be chainable');

    parser.tap(function(vars){
      should.exist(vars, 'should have values');
      should.exist(vars.header, 'should parse out header');
      should.exist(vars.chunkSize, 'should parse out chunkSize');
      should.exist(vars.format, 'should parse out format');
      should.exist(vars.trackCount, 'should parse out trackCount');
      should.exist(vars.timeDivisionType, 'should parse out timeDivisionType');
      should.exist(vars.timeDivision, 'should parse out timeDivision');

      vars.should.eql(expected);
      done();
    });

    chopin.pipe(parser);
  });
});