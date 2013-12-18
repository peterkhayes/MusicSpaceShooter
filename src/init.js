var hero = require('./hero')
var enemy = require('./enemy')
var template = require('./templates')
var _ = require('underscore')
var music = require('./music')
var ship = require('./ship')
var wave = require('./wave')

var camera, scene, renderer
var geometry, material, mesh;
var width = innerWidth * .5
var clock

//Wait for textures, music, models, etc. to load before initializing game so we don't have to muck with async shit everywhere
ship.load(init)
function init(load) {
  var ship = load.ship
  setupProcess()
  music()
  setupCamera()
  buildScene()
  hero(ship(), scene)
  wave(ship, scene)
  template()
  runLoop()
}

function setupProcess() {
  process.__proto__ = Object.create(require('events').EventEmitter.prototype)
  process.bounds = {
    left: 0
  , right: 2200
  , top: 1000
  , bot: 0
  , zed: 700
  }

  process.mid = [
    (process.bounds.right - process.bounds.left) >> 1
  , (process.bounds.top - process.bounds.bot) >> 1
  ]
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
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(460, 640)
  process.env.fps = [0]

  clock = new THREE.Clock()

  scene = new THREE.Scene()
  scene.enemies = []
  window.scene = scene
  document.body.appendChild( renderer.domElement );

  var sunLight = new THREE.DirectionalLight(0xffeedd);
  sunLight.position.set(0.3, - 1, - 1).normalize();

  var light = new THREE.PointLight(0xffeedd, 1);
  light.position.set(-500, 1000, 2000);

  var floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 20, 20), new THREE.MeshBasicMaterial({
    color: 0x555555,
    wireframe: true
  }))

  floor.position.x += process.mid[0]

  scene.add(floor)
  scene.add(sunLight);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  process.on('killall', function () {
    scene.enemies.forEach(function (foe) {
      scene.remove(foe)
    })
  })
}


function setupCamera() {
  camera = new THREE.PerspectiveCamera( 75, width / window.innerHeight, 1, 4000 )
  camera.position.set(process.bounds.top, (process.bounds.right - process.bounds.left) >> 2, 700)
  camera.aspect = (480 / 640) * 2
  camera.updateProjectionMatrix();
}