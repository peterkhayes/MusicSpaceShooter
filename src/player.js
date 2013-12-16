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
    var v = player.velocity, i = 10
    if(key.isPressed("left")) v.x = (v.x * 1.1) + -i
    if(key.isPressed("right")) v.x = (v.x * 1.1) + i
    if(key.isPressed("up")) v.y = (v.y * 1.1) + i
    if(key.isPressed("down")) v.y = v.y + -i
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
  this.position.x += this.velocity.x * .4
  this.position.y += this.velocity.y * .2
  this.velocity.x *= .95
  this.velocity.y *= .95
  this.rotation.z = this.velocity.x * .005
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
