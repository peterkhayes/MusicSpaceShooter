var events = Object.create(require('events').EventEmitter.prototype)

new THREE.JSONLoader(true).load('models/feisar.js', createShip)
module.exports = { load: function (cb) {
                     events.on('load', cb)
                   }
                 }

function createMesh (geometry, mat) {
  geometry.computeTangents();
  var mesh = new THREE.Mesh(geometry, mat);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

function createShip(geometry, materials) {
  console.log('wow')
  var ship = createMesh(geometry, materials[0])
  ship.scale.set(40, 10, 10)
  ship.rotation.set(Math.PI / 2, Math.PI, 0)
  events.emit('load', ship)
}
