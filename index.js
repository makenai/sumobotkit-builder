var fs = require('fs'),
    _ = require('underscore'),
    tempfile = require('tempfile'),
    nodeSCAD = require('nodescad');

var openSCADPath = '/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD';

nodeSCAD.render({
  binaryPath: openSCADPath,
  inputFile: __dirname + '/scad/sumobot.scad',
  variables: {
    'cat': 'dog'
  }
}, function (error, dataBuffer) {
  if (error) { throw error; }

  console.log(dataBuffer.toString())
});


//
//
// var partsList = [ 'wheel', 'top', 'shovel', 'bottom', 'side' ];
//
// fs.readFile('./scad/sumobot.scad', 'utf-8', function (err, data) {
//   if (err) { throw err; }
//
//   console.log( data );
// });
