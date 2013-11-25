var Dissolve = require('dissolve');

var parser = Dissolve();

parser.uint8('id');

parser.loop('items', function(end){
  this.uint8('type');
  this.uint8('age');

  this.tap(function(){
    if (this.vars.type === 0) {
      return end(true);
    }
  });

});

parser.tap(function(){
  console.log(this.vars);
});

parser.write(new Buffer([1])); // collection id

parser.write(new Buffer([1, 12]));
parser.write(new Buffer([2, 10]));
parser.write(new Buffer([0, 0])); // should end here