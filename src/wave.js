var enemy = require('./enemy')
var _ = require('underscore')


module.exports = function (ship, scene) {
  _.range(100).forEach(function (index) {
    var foe = enemy(ship(), scene)
    console.log(foe)
    scene.add(foe)
    scene.enemies.push(foe)
    foe.step = function (delta) {
      foe.position.x = process.mid[0] + (Math.cos(index += delta) * 300)
      foe.position.y =  process.mid[1] + (Math.sin(index += delta) *  300) + 600
      foe.geometry.computeBoundingBox()
    }
  })
}
