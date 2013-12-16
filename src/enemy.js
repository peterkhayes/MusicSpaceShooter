var ship = require('./ship')
  , _ = require('underscore')

console.log('fuck')
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
  _.range(10).forEach(function (index) {
    ship.load(function (ship) {
      var c = pickColor()
      ship.material.color.setHSL(c[0], c[1], c[2])
      ship.rotation.y += Math.PI
      ship.step = function (delta) {
        ship.position.x = 1000 + Math.random() * 1000
        ship.position.y = Math.random() * 1000
      }
      scene.add(ship)
    })
  })
}
