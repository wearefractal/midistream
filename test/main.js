var should = require('should');
require('mocha');

var Dissolve = require('dissolve');
var midistream = require('../');

describe('createStream()', function() {
  it('should create a writeable stream', function(done) {
    var stream = midistream.createStream();
    should.exist(stream, 'should return something');
    should.exist(stream.write, 'should return a stream with .write');
    done();
  });
});
