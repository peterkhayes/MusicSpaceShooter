var _ = require('underscore')

module.exports = function () {
  var env = {}
  _.each(process.env, function (val, key) {
    var el = document.querySelector('#' + key)
    if (el) env[key] = el
  })
  setInterval(function () {
    _.each(env, function (val, key) {
      env[key].textContent = key + ': ' +
        process.env[key].map(function (d) { return (''+d).split('.')[0] }).join(', ')
    })
  })
}
