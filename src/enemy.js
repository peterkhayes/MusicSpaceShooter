var ship = require('./ship')
var _ = require('underscore')

var colors = {
  red: [0, .7, .5]
, orange: [0.083, .7, .5]
, yellow: [.16666, .7, .5]
, green: [.333, .7, .5]
, blue: [.6666, .7, .5]
, purple: [.75, .7, .5]
}

_.mixin({choice: function (arr) {
           return arr[~~ (Math.random() * arr.length - 1)]
         }})
function circular(arr) {
  var i = 0, l = arr.length - 1
  return function () {
    return arr[++i % l]
  }
}


var vals = _.values(colors)
var eeny = circular(vals)

module.exports = function (scene) {
  _.range(30).forEach(function (i) {
    ship.load(function (ship) {
      var c = eeny()
      ship.material.color.setHSL(c[0], c[1], c[2])
      ship.step = function () {
        if (Math.random() < .9) return
        ship.position.set(
          Math.random() * 400,
          Math.random() * 400,
          0
        )
      }
      scene.add(ship)
    })
  })
}