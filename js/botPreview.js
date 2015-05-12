var container = document.getElementById('previewPane');
var camera, cameraTarget, scene, renderer;

var PREVIEW_WIDTH = 480,
    PREVIEW_HEIGHT = 360,
    PREVIEW_SCALE = 0.01;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera( 35, PREVIEW_WIDTH / PREVIEW_HEIGHT, 1, 15 );
  camera.position.set( 3, 0.15, 3 );
  cameraTarget = new THREE.Vector3( 0, -0.25, 0 );

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x72645b, 2, 15 );

  // Ground
  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 40, 40 ),
    new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
  );
  plane.rotation.x = -Math.PI/2;
  plane.position.y = -0.5;
  scene.add( plane );

  plane.receiveShadow = true;

  // ASCII file
  var loader = new THREE.STLLoader();
  loader.load( 'build/bottom.stl', function ( geometry ) {
    var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
    var mesh = new THREE.Mesh( geometry, material );

    THREE.GeometryUtils.center( mesh.geometry );

    mesh.position.set( 0, -0.4, 0 );
    mesh.rotation.set( Math.PI/2, 0, 0 );
    mesh.scale.set( PREVIEW_SCALE, PREVIEW_SCALE, PREVIEW_SCALE );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add( mesh );
  });

  // Lights
  scene.add( new THREE.AmbientLight( 0x777777 ) );

  addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
  addShadowedLight( 0.5, 1, -1, 0xffaa00, 1 );

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
  camera.position.x = Math.cos( timer ) * 3;
  camera.position.z = Math.sin( timer ) * 3;
  camera.lookAt( cameraTarget );
  renderer.render( scene, camera );
}
