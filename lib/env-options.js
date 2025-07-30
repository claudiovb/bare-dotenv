// ../config.js accepts options via environment variables
const env = require('bare-env')
const options = {}

if (env.DOTENV_CONFIG_ENCODING != null) {
  options.encoding = env.DOTENV_CONFIG_ENCODING
}

if (env.DOTENV_CONFIG_PATH != null) {
  options.path = env.DOTENV_CONFIG_PATH
}

if (env.DOTENV_CONFIG_QUIET != null) {
  options.quiet = env.DOTENV_CONFIG_QUIET
}

if (env.DOTENV_CONFIG_DEBUG != null) {
  options.debug = env.DOTENV_CONFIG_DEBUG
}

if (env.DOTENV_CONFIG_OVERRIDE != null) {
  options.override = env.DOTENV_CONFIG_OVERRIDE
}

if (env.DOTENV_CONFIG_DOTENV_KEY != null) {
  options.DOTENV_KEY = env.DOTENV_CONFIG_DOTENV_KEY
}

module.exports = options
