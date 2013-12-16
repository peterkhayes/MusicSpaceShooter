var ship = require('./ship')
var utils = require('./utils')
var key = require('./key')

module.exports = function (scene) {
  process.env.position = []
  process.env.rotation = []
  process.env.velocity = []

  ship.load(function (ship) {
    scene.add(extend(ship))
  })
}

function extend(hero) {
  hero.step = step
  hero.velocity = new THREE.Vector3()
  hero.shoot = shoot
  hero.position.x = (process.bounds.right - process.bounds.left) / 2
  hero.position.y += 50
  return hero
}


function step () {
  process.env.position = this.position.toArray().slice(0,2)
  process.env.rotation = [this.rotation.toArray()[2] * 180]
  process.env.velocity = this.velocity.toArray().slice(0, 2)
  var bounds = process.bounds
  var v = this.velocity
  var fwa = 1
  var sa = 2
  if(key.isPressed("left")) v.x -= sa
  if(key.isPressed("right")) v.x += sa
  if(key.isPressed("up")) v.y += fwa
  if(key.isPressed("down")) v.y -= fwa
  if(key.isPressed("space")) this.parent.add(this.shoot())
  if (this.position.x > bounds.right) this.position.x = process.bounds.left
  if (this.position.y > bounds.top)  this.position.y = process.bounds.bot
  if (this.position.x < -100) this.position.x = bounds.right
  if (this.position.y < -100)  this.position.y = bounds.left
  this.velocity.x *= .9
  this.velocity.y *= .9
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
  this.rotation.z = this.velocity.x * .005
}


var cubes = []
function lazer () {
  return new THREE.Mesh(new THREE.CubeGeometry(10, 200, 10),  new THREE.MeshBasicMaterial(0x00FF00))
}

function shoot() {
  var hero = this
  return [-50, 50].forEach(function (offsetX) {
           var beam = lazer()
           beam.position = hero.position.clone()
           beam.position.x += offsetX
           beam.step = function () {
             (beam.position.y *= 1.2) > 1000 &&
               beam.parent.remove(beam)
             beam.position.y += 1
           }
           hero.parent.add(beam)
         })
}
