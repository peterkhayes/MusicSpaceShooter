var hero = require('./hero')
var enemy = require('./enemy')
var template = require('./templates')
var _ = require('underscore')
var music = require('./music')
var ship = require('./ship')
var wave = require('./wave')

var camera, scene, renderer;
var geometry, material, mesh;
var width = innerWidth * .5
var clock

process.bounds = {
  left: 0
, right: 2200
, top: 1000
, bot: 0
, zed: 700
}

process.mid = [
  (process.bounds.right - process.bounds.left) >> 1
, (process.bounds.top - process.bounds.bottom) >> 1
]

//Wait for textures, music, models, etc. to load before initializing game so we don't have to muck with async shit everywhere
ship.load(init)
function init(load) {
  var ship = load.ship
  process.__proto__ = Object.create(require('events').EventEmitter.prototype)

  music()

  clock = new THREE.Clock()
  scene = new THREE.Scene()

  setupCamera()

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(480, 640);

  buildScene()

  window.scene = scene

  document.body.appendChild( renderer.domElement );
  process.env.fps = [0]
  scene.enemies = []
  hero(ship(), scene)
  wave(ship, scene)
  template()
  runLoop()
}

function runLoop() {
  var delta = clock.getDelta()
  if(Math.random() > .9) process.env.fps = [delta * 1000]
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


function setupCamera() {
  camera = new THREE.PerspectiveCamera( 75, width / window.innerHeight, 1, 4000 )
  camera.position.set(process.bounds.top, (process.bounds.right - process.bounds.left) >> 2, 700)
  camera.aspect = (480 / 640) * 2
  camera.updateProjectionMatrix();
}