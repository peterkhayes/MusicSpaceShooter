var player = require('./player.js')
var _ = require('underscore')

var camera, scene, renderer;
var geometry, material, mesh;
var width = innerWidth * .5
var clock
init();
runLoop();

function init() {
  clock = new THREE.Clock()
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera( 75, width / window.innerHeight, 1, 4000 )
  camera.position.set(-20.660876025161585,80.96198634158289,702.2238140148065)
  camera.rotation.set(-0.11478688891932705,-0.029220126927448863,-0.003368404667652551)

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth * .5, window.innerHeight );

  buildScene()
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  document.body.appendChild( renderer.domElement );
  player(scene)
}

function runLoop() {
  requestAnimationFrame(runLoop);
  renderer.render(scene, camera);
  scene.children.forEach(function (obj) {
    if (obj.step) obj.step(clock.getDelta())
  })
}

function buildScene() {
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

  floor.position.y = -150
  scene.add(floor)
}