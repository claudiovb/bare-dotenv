const fs = require('bare-fs')
const os = require('bare-os')
const path = require('bare-path')
const test = require('brittle')
const { stub } = require('./test-stub')
const bareEnv = require('bare-env')

const dotenv = require('../lib/main')

// Use this:
const originalTTY = global.__DOTENV_TEST_TTY
global.__DOTENV_TEST_TTY = undefined

test('takes string for path option', function (t) {
  delete bareEnv.BASIC // reset

  const testPath = 'tests/.env'
  const env = dotenv.config({ path: testPath })

  t.is(env.parsed.BASIC, 'basic')
  t.is(env.BASIC, 'basic')
})

test('takes array for path option', function (t) {
  delete bareEnv.BASIC // reset

  const testPath = ['tests/.env']
  const env = dotenv.config({ path: testPath })

  t.is(env.parsed.BASIC, 'basic')
  t.is(env.BASIC, 'basic')
})

test('takes two or more files in the array for path option', function (t) {
  delete bareEnv.BASIC // reset

  const testPath = ['tests/.env.local', 'tests/.env']
  const env = dotenv.config({ path: testPath })

  t.is(env.parsed.BASIC, 'local_basic')
  t.is(env.BASIC, 'local_basic')
})

test('sets values from both .env.local and .env. first file key wins.', function (t) {
  delete bareEnv.BASIC // reset
  delete bareEnv.SINGLE_QUOTES

  const testPath = ['tests/.env.local', 'tests/.env']
  const env = dotenv.config({ path: testPath })

  // in both files - first file wins (.env.local)
  t.is(env.parsed.BASIC, 'local_basic')
  t.is(env.BASIC, 'local_basic')

  // in .env.local only
  t.is(env.parsed.LOCAL, 'local')
  t.is(env.LOCAL, 'local')

  // in .env only
  t.is(env.parsed.SINGLE_QUOTES, 'single_quotes')
  t.is(env.SINGLE_QUOTES, 'single_quotes')
})

test('sets values from both .env.local and .env. but none is used as value existed in env.', function (t) {
  const originalBasic = bareEnv.BASIC
  delete bareEnv.BASIC // reset

  const testPath = ['tests/.env.local', 'tests/.env']
  bareEnv.BASIC = 'existing'

  const env = dotenv.config({ path: testPath })

  // does not override env
  t.is(env.parsed.BASIC, 'local_basic')
  t.is(env.BASIC, 'existing')

  // restore
  delete bareEnv.BASIC
  if (originalBasic !== undefined) {
    bareEnv.BASIC = originalBasic
  }
})

test('takes URL for path option', function (t) {
  delete bareEnv.BASIC // reset

  const envPath = path.resolve(__dirname, '.env')
  const fileUrl = new URL(`file://${envPath}`)

  const env = dotenv.config({ path: fileUrl })

  t.is(env.parsed.BASIC, 'basic')
  t.is(env.BASIC, 'basic')
})

test('takes option for path along with home directory char ~', function (t) {
  delete bareEnv.BASIC // reset

  const readFileSyncStub = stub(fs, 'readFileSync').returns('test=foo')
  const mockedHomedir = '/Users/dummy'
  const homedirStub = stub(os, 'homedir').returns(mockedHomedir)
  const testPath = '~/.env'
  dotenv.config({ path: testPath })

  t.is(readFileSyncStub.calls[0].args[0], path.join(mockedHomedir, '.env'))
  t.ok(homedirStub.called)

  homedirStub.restore()
  readFileSyncStub.restore()
})

test('takes option for encoding', function (t) {
  delete bareEnv.BASIC // reset

  const readFileSyncStub = stub(fs, 'readFileSync').returns('test=foo')

  const testEncoding = 'latin1'
  dotenv.config({ encoding: testEncoding })
  t.is(readFileSyncStub.calls[0].args[1].encoding, testEncoding)

  readFileSyncStub.restore()
})

test('takes option for debug', function (t) {
  delete bareEnv.BASIC // reset

  const logStub = stub(console, 'log')

  dotenv.config({ debug: 'true' })
  t.ok(logStub.called)

  logStub.restore()
})

test('reads path with encoding, parsing output to env', function (t) {
  delete bareEnv.BASIC // reset

  const readFileSyncStub = stub(fs, 'readFileSync').returns('BASIC=basic')
  const parseStub = stub(dotenv, 'parse').returns({ BASIC: 'basic' })

  const res = dotenv.config()

  t.alike(res.parsed, { BASIC: 'basic' })
  t.is(readFileSyncStub.callCount, 1)

  readFileSyncStub.restore()
  parseStub.restore()
})

test('does not write over keys already in env', function (t) {
  const originalBasic = bareEnv.BASIC
  delete bareEnv.BASIC // reset

  const testPath = 'tests/.env'
  const existing = 'bar'
  bareEnv.BASIC = existing
  const env = dotenv.config({ path: testPath })

  t.is(env.parsed.BASIC, 'basic')
  t.is(env.BASIC, existing)

  // restore
  delete bareEnv.BASIC
  if (originalBasic !== undefined) {
    bareEnv.BASIC = originalBasic
  }
})

test('does write over keys already in env if override turned on', function (t) {
  const originalBasic = bareEnv.BASIC
  delete bareEnv.BASIC // reset

  const testPath = 'tests/.env'
  const existing = 'bar'
  bareEnv.BASIC = existing
  const env = dotenv.config({ path: testPath, override: true })

  t.is(env.parsed.BASIC, 'basic')
  t.is(env.BASIC, 'basic')

  // restore
  delete bareEnv.BASIC
  if (originalBasic !== undefined) {
    bareEnv.BASIC = originalBasic
  }
})

test('does not write over keys already in env if the key has a falsy value', function (t) {
  const originalBasic = bareEnv.BASIC
  delete bareEnv.BASIC // reset

  const testPath = 'tests/.env'
  const existing = ''
  bareEnv.BASIC = existing
  const env = dotenv.config({ path: testPath })

  t.is(env.parsed.BASIC, 'basic')
  t.is(env.BASIC, '')

  // restore
  delete bareEnv.BASIC
  if (originalBasic !== undefined) {
    bareEnv.BASIC = originalBasic
  }
})

test('does write over keys already in env if the key has a falsy value but override is set to true', function (t) {
  const originalBasic = bareEnv.BASIC
  delete bareEnv.BASIC // reset

  const testPath = 'tests/.env'
  const existing = ''
  bareEnv.BASIC = existing
  const env = dotenv.config({ path: testPath, override: true })

  t.is(env.parsed.BASIC, 'basic')
  t.is(env.BASIC, 'basic')

  // restore
  delete bareEnv.BASIC
  if (originalBasic !== undefined) {
    bareEnv.BASIC = originalBasic
  }
})

test('can write to a different object rather than env', function (t) {
  const originalBasic = bareEnv.BASIC
  delete bareEnv.BASIC // reset

  const testPath = 'tests/.env'
  bareEnv.BASIC = 'other' // reset env

  const myObject = {}
  const env = dotenv.config({ path: testPath, processEnv: myObject })

  t.is(env.parsed.BASIC, 'basic')
  console.log('logging', env.BASIC)
  t.is(env.BASIC, 'other')
  t.is(myObject.BASIC, 'basic')

  // restore
  delete bareEnv.BASIC
  if (originalBasic !== undefined) {
    bareEnv.BASIC = originalBasic
  }
})

test('returns parsed object', function (t) {
  const originalBasic = bareEnv.BASIC
  delete bareEnv.BASIC // reset

  const testPath = 'tests/.env'
  const env = dotenv.config({ path: testPath })

  t.absent(env.error)
  t.is(env.parsed.BASIC, 'basic')

  // restore
  delete bareEnv.BASIC
  if (originalBasic !== undefined) {
    bareEnv.BASIC = originalBasic
  }
})

test('returns any errors thrown from reading file or parsing', function (t) {
  delete bareEnv.BASIC // reset

  const readFileSyncStub = stub(fs, 'readFileSync').returns('test=foo')

  readFileSyncStub.throws()
  const env = dotenv.config()

  t.ok(env.error instanceof Error)

  readFileSyncStub.restore()
})

test('logs any errors thrown from reading file or parsing when in debug mode', function (t) {
  delete bareEnv.BASIC // reset

  const logStub = stub(console, 'log')
  const readFileSyncStub = stub(fs, 'readFileSync').returns('test=foo')

  readFileSyncStub.throws()
  const env = dotenv.config({ debug: true })

  t.ok(logStub.called)
  t.ok(env.error instanceof Error)

  readFileSyncStub.restore()
  logStub.restore()
})

test('logs any errors parsing when in debug and override mode', function (t) {
  delete bareEnv.BASIC // reset

  const logStub = stub(console, 'log')

  dotenv.config({ debug: true, override: true })

  t.ok(logStub.called)

  logStub.restore()
})

test('deals with file:// path', function (t) {
  delete bareEnv.BASIC // reset

  const logStub = stub(console, 'log')

  const testPath = 'file:///tests/.env'
  const env = dotenv.config({ path: testPath })

  t.is(env.parsed.BASIC, undefined)
  t.is(env.BASIC, undefined)
  t.is(env.error.message, "ENOENT: no such file or directory, open 'file:///tests/.env'")

  t.ok(logStub.called)

  logStub.restore()
})

test('deals with file:// path and debug true', function (t) {
  delete bareEnv.BASIC // reset

  const logStub = stub(console, 'log')

  const testPath = 'file:///tests/.env'
  const env = dotenv.config({ path: testPath, debug: true })

  t.is(env.parsed.BASIC, undefined)
  t.is(env.BASIC, undefined)
  t.is(env.error.message, "ENOENT: no such file or directory, open 'file:///tests/.env'")

  t.ok(logStub.called)

  logStub.restore()
})

test('path.relative fails somehow', function (t) {
  delete bareEnv.BASIC // reset

  const logStub = stub(console, 'log')
  const pathRelativeStub = stub(path, 'relative').throws(new Error('fail'))

  const testPath = 'file:///tests/.env'
  const env = dotenv.config({ path: testPath, debug: true })

  t.is(env.parsed.BASIC, undefined)
  t.is(env.BASIC, undefined)
  t.is(env.error.message, 'fail')

  t.ok(logStub.called)

  pathRelativeStub.restore()
  logStub.restore()
})

test('displays random tips from the tips array', function (t) {
  delete bareEnv.BASIC // reset

  if (originalTTY !== undefined) {
    global.__DOTENV_TEST_TTY = originalTTY
  } else {
    delete global.__DOTENV_TEST_TTY
  }

  const logStub = stub(console, 'log')
  const testPath = 'tests/.env'

  // Test that tips are displayed (run config multiple times to see variation)
  dotenv.config({ path: testPath })
  dotenv.config({ path: testPath })
  dotenv.config({ path: testPath })

  // Should have at least one call that contains a tip
  let foundTip = false
  for (const call of logStub.getCalls()) {
    if (call.args[0] && call.args[0].includes('tip:')) {
      foundTip = true
      break
    }
  }

  t.ok(foundTip, 'Should display a tip')

  // Test that the tip contains one of our expected tip messages
  let foundExpectedTip = false
  const expectedTips = [
    '🔐 encrypt with dotenvx: https://dotenvx.com',
    '🔐 prevent committing .env to code: https://dotenvx.com/precommit',
    '🔐 prevent building .env in docker: https://dotenvx.com/prebuild',
    '📡 observe env with Radar: https://dotenvx.com/radar',
    '📡 auto-backup env with Radar: https://dotenvx.com/radar',
    '📡 version env with Radar: https://dotenvx.com/radar',
    '🛠️  run anywhere with `dotenvx run -- yourcommand`',
    '⚙️  specify custom .env file path with { path: \'/custom/path/.env\' }',
    '⚙️  enable debug logging with { debug: true }',
    '⚙️  override existing env vars with { override: true }',
    '⚙️  suppress all logs with { quiet: true }',
    '⚙️  write to custom object with { processEnv: myObject }',
    '⚙️  load multiple .env files with { path: [\'.env.local\', \'.env\'] }'
  ]

  for (const call of logStub.getCalls()) {
    if (call.args[0] && call.args[0].includes('tip:')) {
      for (const expectedTip of expectedTips) {
        if (call.args[0].includes(expectedTip)) {
          foundExpectedTip = true
          break
        }
      }
    }
  }

  t.ok(foundExpectedTip, 'Should display one of the expected tips')

  logStub.restore()
})

test('displays random tips from the tips array with fallback for isTTY false', function (t) {
  delete bareEnv.BASIC // reset

  if (originalTTY !== undefined) {
    global.__DOTENV_TEST_TTY = originalTTY
  } else {
    delete global.__DOTENV_TEST_TTY
  }

  const logStub = stub(console, 'log')
  const testPath = 'tests/.env'

  // Test that tips are displayed (run config multiple times to see variation)
  dotenv.config({ path: testPath })
  dotenv.config({ path: testPath })
  dotenv.config({ path: testPath })

  // Should have at least one call that contains a tip
  let foundTip = false
  for (const call of logStub.getCalls()) {
    if (call.args[0] && call.args[0].includes('tip:')) {
      foundTip = true
      break
    }
  }

  t.ok(foundTip, 'Should display a tip')

  // Test that the tip contains one of our expected tip messages
  let foundExpectedTip = false
  const expectedTips = [
    '🔐 encrypt with dotenvx: https://dotenvx.com',
    '🔐 prevent committing .env to code: https://dotenvx.com/precommit',
    '🔐 prevent building .env in docker: https://dotenvx.com/prebuild',
    '🛠️  run anywhere with `dotenvx run -- yourcommand`',
    '⚙️  specify custom .env file path with { path: \'/custom/path/.env\' }',
    '⚙️  enable debug logging with { debug: true }',
    '⚙️  override existing env vars with { override: true }',
    '⚙️  suppress all logs with { quiet: true }',
    '⚙️  write to custom object with { processEnv: myObject }',
    '⚙️  load multiple .env files with { path: [\'.env.local\', \'.env\'] }'
  ]

  for (const call of logStub.getCalls()) {
    if (call.args[0] && call.args[0].includes('tip:')) {
      for (const expectedTip of expectedTips) {
        if (call.args[0].includes(expectedTip)) {
          foundExpectedTip = true
          break
        }
      }
    }
  }

  t.ok(foundExpectedTip, 'Should display one of the expected tips')

  logStub.restore()
})

test('logs when no path is set', function (t) {
  delete bareEnv.BASIC // reset

  const logStub = stub(console, 'log')

  dotenv.config()
  t.ok(logStub.called)

  logStub.restore()
})

test('does log by default', function (t) {
  delete bareEnv.BASIC // reset

  const testPath = 'tests/.env'
  const logStub = stub(console, 'log')

  dotenv.config({ path: testPath })
  t.ok(logStub.called)

  logStub.restore()
})

test('does not log if quiet flag passed true', function (t) {
  delete bareEnv.BASIC // reset

  const testPath = 'tests/.env'
  const logStub = stub(console, 'log')

  dotenv.config({ path: testPath, quiet: true })
  t.ok(logStub.callCount === 0)

  logStub.restore()
})

test('does not log if env.DOTENV_CONFIG_QUIET is true', function (t) {
  delete bareEnv.BASIC // reset

  bareEnv.DOTENV_CONFIG_QUIET = 'true'
  const testPath = 'tests/.env'
  const logStub = stub(console, 'log')

  dotenv.config({ path: testPath })
  t.ok(logStub.callCount === 0)
  delete bareEnv.DOTENV_CONFIG_QUIET

  logStub.restore()
})

test('does log if quiet flag false', function (t) {
  delete bareEnv.BASIC // reset

  const testPath = 'tests/.env'
  const logStub = stub(console, 'log')

  dotenv.config({ path: testPath, quiet: false })
  t.ok(logStub.called)

  logStub.restore()
})

test('does log if env.DOTENV_CONFIG_QUIET is false', function (t) {
  delete bareEnv.BASIC // reset

  bareEnv.DOTENV_CONFIG_QUIET = 'false'
  const testPath = 'tests/.env'
  const logStub = stub(console, 'log')

  dotenv.config({ path: testPath })
  t.ok(logStub.called)
  delete bareEnv.DOTENV_CONFIG_QUIET

  logStub.restore()
})

test('does log if quiet flag present and undefined/null', function (t) {
  delete bareEnv.BASIC // reset

  const testPath = 'tests/.env'
  const logStub = stub(console, 'log')

  dotenv.config({ path: testPath, quiet: undefined })
  t.ok(logStub.called)

  logStub.restore()
})

test('logs if debug set', function (t) {
  delete bareEnv.BASIC // reset

  const testPath = 'tests/.env'
  const logStub = stub(console, 'log')

  dotenv.config({ path: testPath, debug: true })
  t.ok(logStub.called)

  logStub.restore()
})
