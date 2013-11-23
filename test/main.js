var should = require('should');
require('mocha');

var Dissolve = require('dissolve');
var midistream = require('../');

Dissolve.prototype.autoRead = function(){
  this.on("readable", function() {
    var e;
    while (e = this.read()) {
      console.log(e);
    }
  }.bind(this));
};

describe('createStream()', function() {
  it('should create a writeable stream', function(done) {
    var stream = midistream.createStream();
    should.exist(stream, 'should return something');
    should.exist(stream.write, 'should return a stream with .write');
    done();
  });
});
