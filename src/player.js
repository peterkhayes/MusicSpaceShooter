var ship = require('./ship')
var utils = require('./utils')
var key = require('./key')

module.exports = function (scene) {
  process.env.position = []
  process.env.rotation = []


  var player
  ship.load(function (ship) {
    player = extend(ship)
    scene.add(player)
  })

  key('left, right, up, down, space', function (e) {
    if(key.isPressed("left")) player.velocity.x += -100
    if(key.isPressed("right")) player.velocity.x += 100
    if(key.isPressed("up")) player.velocity.y += 100
    if(key.isPressed("down")) player.velocity.y += -100
    if(key.isPressed("space")) scene.add(player.shoot())
  })
}

function extend(player) {
  player.step = step
  player.velocity = new THREE.Vector3()
  player.shoot = shoot
  player.position.x = (process.bounds.right - process.bounds.left) / 2
  player.position.y += 50
  return player
}


function step () {
  process.env.position = this.position.toArray().slice(0,2)
  process.env.rotation = [this.rotation.toArray()[2] * 180]
  var bounds = process.bounds
  if (this.position.x > bounds.right) this.position.x = process.bounds.left
  if (this.position.y > bounds.top)  this.position.y = process.bounds.bot
  if (this.position.x < -100) this.position.x = bounds.right
  if (this.position.y < -100)  this.position.y = bounds.left
  this.rotation.z = this.velocity.x * .9
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
  this.velocity.x *= .1
  this.velocity.y *= .1
}


var cubes = []
function lazer () {
  return new THREE.Mesh(new THREE.CubeGeometry(10, 200, 10),  new THREE.MeshBasicMaterial(0x00FF00))
}

function shoot() {
  var player = this
  return [-50, 50].forEach(function (offsetX) {
           var beam = lazer()
           beam.position = player.position.clone()
           beam.position.x += offsetX
           beam.step = function () {
             (beam.position.y *= 1.2) > 1000 &&
               beam.parent.remove(beam)
             beam.position.y += 1
           }
           player.parent.add(beam)
         })
}
