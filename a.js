var camera, scene, renderer;
var geometry, material, mesh;
var width = innerWidth * .5

init();
animate();

function init() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, width / window.innerHeight, 1, 4000 );
  camera.position.set(-20.660876025161585,80.96198634158289,702.2238140148065)
  camera.rotation.set(-0.11478688891932705,-0.029220126927448863,-0.003368404667652551)

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth * .5, window.innerHeight );

  addShit()
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  document.body.appendChild( renderer.domElement );
}

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );

  window.controls && controls.update(clock.getDelta())
}

function addShit() {
  scene.add(new THREE.AmbientLight(0x404040));
  sunLight = new THREE.DirectionalLight(0xffeedd);
  sunLight.position.set(0.3, - 1, - 1).normalize();

  scene.add(sunLight);

  light = new THREE.PointLight(0xffeedd, 1);
  light.position.set(-500, 1000, 2000);
  scene.add(light);

  floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 20, 20), new THREE.MeshBasicMaterial({
    color: 0x555555,
    wireframe: true
  }))

  floor.position.y = -150;
  scene.add(floor)

  new THREE.JSONLoader(true).load('/feisar.js', createShip)
}

function createMesh(parent, geometry, mat) {
  geometry.computeTangents();

  var mesh = new THREE.Mesh(geometry, mat);
  parent.add(mesh);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

function scaleBy(x) {
  return function (y) {
    return x * y
  }
}

function addControls(obj){
  controls = new THREE.FlyControls(obj)
  controls.movementSpeed = 1000;
  controls.rollSpeed = Math.PI / 10;
  controls.dragToLook = false;
}

function createShip(geometry, materials) {
  ship = createMesh(scene, geometry, materials[0])
  ship.scale.set(40, 10, 10)
  ship.rotation.set(Math.PI / 2, Math.PI, 0)
  addControls(ship)
}
