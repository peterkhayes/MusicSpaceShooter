var _ = require('underscore')

module.exports = function () {
process.on('falseHit', function () {
  document.title = ':('
  setTimeout(function () {
    document.title = ''

  }, 500)
})

  _.each(document.querySelectorAll('button'), function (button) {
    button.addEventListener('click', function ( ) {
      process.emit(button.className, button.textContent)
    })
  })
}

function dashboard() {
  var env = {}
  _.each(process.env, function (val, key) {
    var el = document.querySelector('#' + key)
    if (el) env[key] = el
  })

    setInterval(function () {
      _.each(env, function (val, key) {
        env[key].textContent = key + ': ' +
          process.env[key].map(function (d) { return (''+d).split('.')[0] }).join(', ')
      }, 100)
    })
}