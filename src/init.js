var hero = require('./hero')
var enemy = require('./enemy')
var template = require('./templates')
var _ = require('underscore')

var camera, scene, renderer;
var geometry, material, mesh;
var width = innerWidth * .5
var clock

process.bounds = {
  left: 0
, right: 2099
, top: 1100
, bot: 0
}

process.mid = [
  (process.bounds.right - process.bounds.left) >> 1
, (process.bounds.top - process.bounds.bottom) >> 1
]

init()
runLoop()

function init() {
  clock = new THREE.Clock()
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera( 75, width / window.innerHeight, 1, 4000 )
  camera.position.set(1000, 650, 702)
  camera.rotation.set(-0.11478688891932705,-0.029220126927448863,-0.003368404667652551)

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(480, 640);

  buildScene()
  camera.aspect = (480 / 640) * 2
  camera.updateProjectionMatrix();

  document.body.appendChild( renderer.domElement );

  hero(scene)
  enemy(scene)
  template()
}

function runLoop() {
  var delta = clock.getDelta()
  requestAnimationFrame(runLoop);
  renderer.render(scene, camera);
  scene.children.forEach(function (obj) {
    if (obj.step) obj.step(delta)
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

  floor.position.x += process.mid[0]
  scene.add(floor)
}