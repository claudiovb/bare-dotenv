// tests/test-helpers.js
let mockTTY = null

function mockBareIsTTY (value) {
  mockTTY = value
}

function restoreBareIsTTY () {
  mockTTY = null
}

function getMockedIsTTY () {
  if (mockTTY !== null) {
    return mockTTY
  }

  try {
    const tty = require('bare-tty')
    return tty.isatty && tty.isatty(1)
  } catch {
    return false
  }
}

module.exports = {
  mockBareIsTTY,
  restoreBareIsTTY,
  getMockedIsTTY
}
