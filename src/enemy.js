var _ = require('underscore')

var colors = {
  red: [0, .7, .5]
//, orange: [0.083, .7, .5]
//, yellow: [.16666, .7, .5]
, green: [.333, .7, .5]
, blue: [.6666, .7, .5]
, purple: [.75, .7, .5]
}

_.mixin({ choice: function (arr) {
            return arr[~~ (Math.random() * arr.length - 1)]
          }})

function circular(arr) {
  var i = 0, l = arr.length
  return function () {
    return arr[++i % l]
  }
}
process.colorIndices = _.keys(colors)

var vals = []
_.each(colors, function (val, color) {
  vals.push(val)
  val.color = color
})

  var pickColor = circular(vals)

module.exports = function (ship, scene) {
  var c = pickColor()
  ship.material.color.setHSL(c[0], c[1], c[2])
  ship.rotation.y += Math.PI
  ship.morality = 'foe'
  ship.color = c.color
  ship.kill = function () {
    process.emit('kill', ship.color)
    scene.enemies = _.without(scene.enemies, ship)
    ship.step = function () { ship.scale.divideScalar(1.09) }
    setTimeout(function () { scene.remove(ship);  }, 2000)
  }
  return ship
}
