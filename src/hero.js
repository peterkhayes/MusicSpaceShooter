var ship = require('./ship')
var utils = require('./utils')
var key = require('./key')
var _ = require('underscore')

module.exports = function (ship, scene) {
  process.env.position = []
  process.env.rotation = []
  process.env.velocity = []
  scene.add(extend(ship))
}

function extend(hero) {
  hero.step = step
  hero.velocity = new THREE.Vector3()
  hero.shoot = _.throttle(shoot, 100)
  hero.position.x = (process.bounds.right - process.bounds.left) / 2
  hero.position.y += 100
  var light = new THREE.DirectionalLight(0xffeedd, 10);
  scene.hero = hero
  light.rotation = hero.rotation
  //hero.add(light)
  return hero
}

function step () {
  process.env.position = this.position.toArray().slice(0,2)
  process.env.rotation = [this.rotation.toArray()[2] * 180]
  process.env.velocity = this.velocity.toArray().slice(0, 2)
  var bounds = process.bounds
  var v = this.velocity
  var fwa = 2
  var sa = 3
  if(key.isPressed("left")) v.x -= sa
  if(key.isPressed("right")) v.x += sa
  if(key.isPressed("up")) v.y += fwa
  if(key.isPressed("down")) v.y -= fwa
  if(key.isPressed("space")) this.parent.add(this.shoot())
  if (this.position.x > bounds.right) this.position.x = process.bounds.left
  if (this.position.y > bounds.top)  this.position.y = process.bounds.bot
  if (this.position.x < -100) this.position.x = bounds.right
  if (this.position.y < bounds.bot)  this.position.y = bounds.top - 10
  this.velocity.x *= .9
  this.velocity.y *= .9
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
  //this.rotation.x += this.velocity.y * .005
  this.rotation.z = this.velocity.x * .015
}

var cubes = []
function lazer () {
  return new THREE.Mesh(new THREE.CubeGeometry(10, 10, 10),  new THREE.MeshBasicMaterial(0x00FF00))
}

function shoot() {
  var hero = this
  return [-50, 50].forEach(function (offsetX) {
           var beam = lazer(), scene = hero.parent
           beam.position = hero.position.clone()
           beam.position.x += offsetX
           scene.add(beam)
           beam.step = function () {
             if ((beam.position.y += 50) > 2000) beam.parent.remove(beam)
             scene.enemies.forEach(function (foe) {
               if (foe.position.distanceTo(beam.position) > 50) return
               if (foe.color == process.colorIndices[process.env.chord])
                 foe.kill(), scene.remove(beam)
               else process.emit('falseHit')
             })
           }
         })
}
