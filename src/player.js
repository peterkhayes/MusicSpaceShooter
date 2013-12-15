var ship = require('./ship')
var utils = require('./utils')

module.exports = function (scene) {
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
  return player
}

function step () {
  if (this.position.x > 1000) this.position.x = -1000
  if (this.position.y > 560)  this.position.y = -560
  if (this.position.x < - 1000) this.position.x = 1000
  if (this.position.y < - 560)  this.position.y = 560
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
  return [-100, 100].forEach(function (offsetX) {
           var beam = lazer()
           beam.position = player.position.clone()
           beam.position.x += offsetX
           beam.step = function () {
             beam.position.y += 5
           }
           player.parent.add(beam)
         })
}
