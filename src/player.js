var ship = require('./ship')
var utils = require('./utils')

module.exports = function (scene) {
  process.env.position = []
  process.env.rotation = []


  var player
  ship.load(function (ship) {
    player = extend(ship)
    scene.add(player)
  })

  document.onkeydown = function (e) {
    var key = e.which,
        nudge = { //up down left right
          38: [0, 1],
          40: [0, -1],
          39: [1, 0],
          37: [-1, 0]
        }[key]
    if (key == 32) scene.add(player.shoot())
    if (! nudge) return
    nudge = nudge.map(utils.scaleBy(10))
    e.preventDefault()
    player.velocity.x += nudge[0]
    player.velocity.y += nudge[1]
  }
}

function extend(player) {
  player.step = step
  player.velocity = new THREE.Vector3()
  player.shoot = shoot
  player.position.x = (process.bounds.right - process.bounds.left) / 2
  return player
}


function step () {
  process.env.position = this.position.toArray().slice(0,2)
  process.env.rotation = [this.rotation.toArray()[2] * 180]
  var bounds = process.bounds
  if (this.position.x > bounds.right) this.position.x = process.bounds.left
  if (this.position.y > bounds.top)  this.position.y = process.bounds.bottom
  if (this.position.x < -100) this.position.x = bounds.right
  if (this.position.y < -100)  this.position.y = bounds.left
  this.rotation.z = this.velocity.x * .05
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
  this.velocity.x *= .9
  this.velocity.y *= .9
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
