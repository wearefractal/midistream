[![Build Status](https://travis-ci.org/wearefractal/midistream.png?branch=master)](https://travis-ci.org/wearefractal/midistream)

[![NPM version](https://badge.fury.io/js/midistream.png)](http://badge.fury.io/js/midistream)

## Information

<table>
<tr> 
<td>Package</td><td>midistream</td>
</tr>
<tr>
<td>Description</td>
<td>Streaming MIDI file parser</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.4</td>
</tr>
</table>

## Usage

```javascript
var fs = require('fs');
var midistream = require('midistream');

// create a parse stream
var parser = midistream.createStream();
var chopin = fs.createReadStream('chopin-nocturne-op9-num2.mid');

// you can listen to events that are emitted as the file is parsed
parser.on('track', function(){
  console.log(track.events);  
});

// or just wait for the entire file to parse
// totally non-standard event name fail
parser.on('done', function(file){
  console.log(file.trackCount);
  console.log(file.tracks[0].events[0]);
});

chopin.pipe(parser);

// usage info on what events are emitted and data that is available inbound
```

## Examples

You can view more examples in the [example folder.](https://github.com/wearefractal/midistream/tree/master/examples)

## LICENSE

(MIT License)

Copyright (c) 2013 Fractal <contact@wearefractal.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
