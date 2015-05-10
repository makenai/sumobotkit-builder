var _ = require('underscore'),
    renderer = require('./lib/renderer');

function buildStlFiles() {
  var partsList = [ 'wheel', 'top', 'shovel', 'bottom', 'side' ];

  _.each(partsList, function(part) {
    renderer.stlFile({}, part, 'build/' + part + '.stl');
  });
}

function buildLaserFile() {
  renderer.svgFile({}, 'laser_sheet', 'build/sumobot-laser.svg');
}

buildLaserFile();
