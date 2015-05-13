var Hapi = require('hapi'),
    _ = require('underscore'),
    renderer = require('./lib/renderer');

var server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 3000
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'static'
        }
    }
});

server.start();

function buildStlFiles() {
  var partsList = [ 'wheel', 'top', 'shovel', 'bottom', 'side' ];
  _.each(partsList, function(part) {
    renderer.stlFile({}, part, 'static/build/' + part + '.stl');
  });
}

function buildLaserFile() {
  renderer.svgFile({}, 'laser_sheet', 'static/build/sumobot-laser.svg');
}
