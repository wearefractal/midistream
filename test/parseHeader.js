var path = require('path');
var fs = require('fs');
var Dissolve = require('dissolve');

var should = require('should');
require('mocha');

var parseHeader = require('../lib/parseHeader');
var constants = require('../lib/constants');

var chopinPath = path.join(__dirname, './fixtures/chopin.mid');
var chopin = fs.createReadStream(chopinPath);

describe('parseHeader()', function() {
  this.timeout(10000);
  
  it('should parse a MIDI header correctly', function(done) {
    var expected = {
      header: 'MThd',
      chunkSize: 6,
      format: 1,
      trackCount: 5,
      timeDivisionType: 'tpb',
      timeDivision: 48
    };

    var parser = Dissolve();
    parser.once('error', done);

    var returnVal = parseHeader(parser);
    should.exist(returnVal, 'should be chainable');

    parser.tap(function(){
      should.exist(this.vars, 'should have values');
      should.exist(this.vars.header, 'should parse out header');
      should.exist(this.vars.chunkSize, 'should parse out chunkSize');
      should.exist(this.vars.format, 'should parse out format');
      should.exist(this.vars.trackCount, 'should parse out trackCount');
      should.exist(this.vars.timeDivisionType, 'should parse out timeDivisionType');
      should.exist(this.vars.timeDivision, 'should parse out timeDivision');

      expected.should.eql(this.vars, 'final result');
      done();
    });

    chopin.pipe(parser);
  });
});