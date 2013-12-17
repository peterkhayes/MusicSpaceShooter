var enemy = require('./enemy')
var _ = require('underscore')


module.exports = function (ship, scene) {
  process.on('spawn', function (type) {
    spawn(100, types[type])
  })
  spawn(100, circle)
  function spawn (n, step) {
    _.range(n).forEach(function (index) {
      var foe = enemy(ship(), scene)
      foe.index = index
      scene.add(foe)
      scene.enemies.push(foe)
      foe.step = step
    })
  }
}



var types = {
    rows: rows
  , circle: circle
}


function rows(delta) {
  this.position.x = 300 + ((((this.index += delta * 10) % 20) % 200) * 100)
  this.position.y =  300 + ((((this.index += delta * 10) % 200) / 10) * 50)
}


function circle(delta) {
  this.position.x = process.mid[0] + (Math.cos(this.index += delta) * 1000) + 150
  this.position.y =  process.mid[1] + (Math.sin(this.index += delta) *  300) + 150
}