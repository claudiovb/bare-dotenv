/* global Bare */
// shims/supports-color/index.js
const env = require('bare-env')
const tty = require('bare-tty')

function supportsColor(stream) {
  if (env.FORCE_COLOR === 'false' || env.NO_COLOR) {
    return false
  }

  if (env.FORCE_COLOR === 'true') {
    return { level: 1, hasBasic: true, has256: false, has16m: false }
  }

  if (stream && tty.isatty && tty.isatty(stream.fd)) {
    return { level: 1, hasBasic: true, has256: false, has16m: false }
  }

  return false
}

module.exports = supportsColor
module.exports.stdout = supportsColor(Bare.stdout || { fd: 1 })
module.exports.stderr = supportsColor(Bare.stderr || { fd: 2 })
