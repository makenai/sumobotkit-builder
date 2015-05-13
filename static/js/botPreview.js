var container = document.getElementById('previewPane');
var camera, cameraTarget, scene, renderer;

var PREVIEW_WIDTH = 480,
    PREVIEW_HEIGHT = 360,
    PREVIEW_SCALE = 0.01;

var params = {
  material_thickness: 4.75,
  battery_case_height: 16,
  servo_height: 21.5,
  servo_length: 42.5,
  sled_length: 80.5,
  sled_width: 63.5,
  tab_edge_distance: 5,
  tab_length: 10,
  ramp_angle: 80,
  shovel_width: 100,
  shovel_height: 45,
  shovel_side_height: 20,
  ziptie_height: 5,
  ziptie_width: 2.5,
  screw_diameter: 2.25,
  caster_screw_spacing: 25,
  caster_position: 12,
  wheel_radius: 30
};

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera( 35, PREVIEW_WIDTH / PREVIEW_HEIGHT, 1, 15 );
  camera.position.set( 3, 1, 3 );
  cameraTarget = new THREE.Vector3( 0, -0.25, 0 );

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x72645b, 2, 15 );

  // Ground
  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 40, 40 ),
    new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
  );
  plane.rotation.x = radians(-90);
  plane.position.y = scaled(-20);
  scene.add( plane );

  plane.receiveShadow = true;

  var side_pos = (params.sled_width/2) + (params.material_thickness/2);

  addPiece('build/bottom.stl', [0, -15, 0], [ 90, 0, 0 ]);
  addPiece('build/top.stl',    [0, 15, 0], [ 90, 0, 0 ]);
  addPiece('build/side.stl',   [0, 0,  side_pos], [ 0, 0, 0 ]);
  addPiece('build/side.stl',   [0, 0, -side_pos], [ 0, 0, 0 ]);

  addPiece('build/wheel.stl',   [0, 0,  side_pos + 15], [ 0, 0, 0 ]);
  addPiece('build/wheel.stl',   [0, 0, -side_pos - 15], [ 0, 0, 0 ]);


  // Lights
  scene.add( new THREE.AmbientLight( 0x777777 ) );

  addShadowedLight( 1, 1, 1, 0xffffff, 0.9 );
  // addShadowedLight( 0.5, 1, -1, 0xffaa00, 1 );

  // Renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( scene.fog.color );
  renderer.setSize( PREVIEW_WIDTH, PREVIEW_HEIGHT );

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.shadowMapEnabled = true;
  renderer.shadowMapCullFace = THREE.CullFaceBack;

  container.appendChild( renderer.domElement );
}

function radians(degrees) {
  return degrees * Math.PI / 180;
}

function scaled(mm) {
  return mm * PREVIEW_SCALE;
}

function addPiece( filename, position, rotation ) {
  var loader = new THREE.STLLoader();
  loader.load( filename, function ( geometry ) {
    var material = new THREE.MeshPhongMaterial({
      color: 0xC6B37D,
      // specular: 0x111111,
      // shininess: 200,
      shading: THREE.FlatShading,
      vertexColors: THREE.VertexColors
    });
    var mesh = new THREE.Mesh( geometry, material );
    mesh.geometry.center();

    mesh.position.set( scaled(position[0]), scaled(position[1]), scaled(position[2]) );
    mesh.rotation.set( radians(rotation[0]), radians(rotation[1]), radians(rotation[2]) );
    mesh.scale.set( PREVIEW_SCALE, PREVIEW_SCALE, PREVIEW_SCALE );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add( mesh );
  });
}


function addShadowedLight( x, y, z, color, intensity ) {
  var directionalLight = new THREE.DirectionalLight( color, intensity );
  directionalLight.position.set( x, y, z )
  scene.add( directionalLight );

  directionalLight.castShadow = true;
  // directionalLight.shadowCameraVisible = true;

  var d = 1;
  directionalLight.shadowCameraLeft = -d;
  directionalLight.shadowCameraRight = d;
  directionalLight.shadowCameraTop = d;
  directionalLight.shadowCameraBottom = -d;

  directionalLight.shadowCameraNear = 1;
  directionalLight.shadowCameraFar = 4;

  directionalLight.shadowMapWidth = 1024;
  directionalLight.shadowMapHeight = 1024;

  directionalLight.shadowBias = -0.005;
  directionalLight.shadowDarkness = 0.15;
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  var timer = Date.now() * 0.0005;
  camera.position.x = Math.cos( timer ) * 2;
  camera.position.z = Math.sin( timer ) * 2;
  camera.lookAt( cameraTarget );
  renderer.render( scene, camera );
}
