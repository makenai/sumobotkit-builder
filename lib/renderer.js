var fs = require('fs'),
    _ = require('underscore'),
    nodeSCAD = require('nodescad');

var openSCADPath = '/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD';
var openSCADSource = __dirname + '/../scad/sumobot.scad'

exports.stlFile = function(options, target, outFile) {
  var targetOption = {};
  targetOption[ 'build_' + target ] = 1;

  nodeSCAD.render({
    binaryPath: openSCADPath,
    inputFile: openSCADSource,
    outputFile: outFile,
    variables: _.extend({}, options, targetOption)
  }, function (error, dataBuffer) {
    if (error) { throw error; }
    console.log('Wrote ' + outFile);
  });
};

exports.svgFile = function(options, target, outFile) {
  var targetOption = {};
  targetOption[ 'build_' + target ] = 1;

  nodeSCAD.render({
    binaryPath: openSCADPath,
    inputFile: openSCADSource,
    outputFile: outFile,
    variables: _.extend({}, options, targetOption)
  }, function (error, dataBuffer) {
    if (error) { throw error; }
    console.log('Wrote ' + outFile);
  });
};
