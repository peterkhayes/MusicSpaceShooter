var camera, scene, renderer;
var geometry, material, mesh;
var width = innerWidth * .5

init();
runLoop();

function init() {
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

function runLoop() {
  requestAnimationFrame(runLoop);
  renderer.render(scene, camera);
  if (! window.ship) return
  if (ship.position.x > 1000) ship.position.x = -1000
  if (ship.position.y > 560)  ship.position.y = -560
  if (ship.position.x < - 1000) ship.position.x = 1000
  if (ship.position.y < - 560)  ship.position.y = 560
  ship.rotation.z = ship.velocity.x * .05
  ship.position.x += ship.velocity.x
  ship.position.y += ship.velocity.y
  ship.velocity.x *= .9
  ship.velocity.y *= .9
  cubes.forEach(function (cube) {
    cube.position.y += 5
  })
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


function createShip(geometry, materials) {
  ship = createMesh(scene, geometry, materials[0])
  ship.velocity = {x: 0, y: 0}
  ship.scale.set(40, 10, 10)
  ship.rotation.set(Math.PI / 2, Math.PI, 0)
}

var cubes = []
function lazer (x) {
  var cube = new THREE.Mesh(new THREE.CubeGeometry(10, 200, 10),  new THREE.MeshBasicMaterial(0x00FF00))
  cubes.push(cube)
  var p = ship.position.clone()
  p.x += x
  cube.position = p
  scene.add(cube)
}
function shootLazer() {
  lazer(-100)
  lazer(100)
}

document.onkeydown = function (e) {
  var key = e.which,
      nudge = { //up down left right
        38: [0, 1],
        40: [0, -1],
        39: [1, 0],
        37: [-1, 0]
      }[key]
  console.log(key)
  if (key == 32) shootLazer()
  if (! nudge) return
  nudge = nudge.map(scaleBy(10))
  e.preventDefault()
  ship.velocity.x += nudge[0]
  ship.velocity.y += nudge[1]
}
