var events = Object.create(require('events').EventEmitter.prototype)
var _ = require('underscore')
events.setMaxListeners(200)
module.exports = { load: function (cb) {
                     geo ? cb() : events.once('load', cb)

                   }
                 }
var geo, mat
new THREE.JSONLoader(true).load('models/feisar.js', function (g, m) {
  geo = g
  mat = m[0]
  events.emit('load', { ship: createShip })
})

function createShip() {
  var ship = new THREE.Mesh(geo, mat.clone())
  ship.castShadow = true;
  ship.receiveShadow = true;
  ship.scale.set(20, 20, 10)
  ship.rotation.set(Math.PI / 2, Math.PI, 0)
  return ship
}
