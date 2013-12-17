var ship = require('./ship')
  , _ = require('underscore')

var colors = {
  red: [0, .7, .5]
, orange: [0.083, .7, .5]
, yellow: [.16666, .7, .5]
, green: [.333, .7, .5]
, blue: [.6666, .7, .5]
, purple: [.75, .7, .5]
}

_.mixin({ choice: function (arr) {
            return arr[~~ (Math.random() * arr.length - 1)]
          }})

function circular(arr) {
  var i = 0, l = arr.length - 1
  return function () {
    return arr[++i % l]
  }
}

var vals = _.values(colors)
var pickColor = circular(vals)

module.exports = function (scene) {
  var n = 10
  _.range(n).forEach(function (index) {
    ship.load(function (ship) {
      var k = 360 / n
      var c = pickColor()
      ship.material.color.setHSL(c[0], c[1], c[2])
      ship.rotation.y += Math.PI
      ship.morality = 'foe'
      scene.enemies.push(ship)
      scene.add(ship)
      ship.kill = function () {
        ship.step = function () { ship.scale.divideScalar(1.09) }
        setTimeout(function () { scene.remove(ship) }, 2000)
      }
      ship.step = function (delta) {
        ship.position.x = process.mid[0] + (Math.cos(index += delta) * 300)
        ship.position.y =  process.mid[1] + (Math.sin(index += delta) *  300) + 600
        ship.geometry.computeBoundingBox()
      }
    })
  })
}
