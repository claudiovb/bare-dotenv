/* global Bare */
(function () {
  require('./lib/main').config(
    Object.assign(
      {},
      require('./lib/env-options'),
      require('./lib/cli-options')(Bare.argv)
    )
  )
})()
