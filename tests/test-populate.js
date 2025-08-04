const fs = require('bare-fs')
const env = require('bare-env')
const test = require('brittle')
const { stub } = require('./test-stub')

const dotenv = require('../lib/main')

const mockParseResponse = { test: 'foo' }

test('takes processEnv and check if all keys applied to processEnv', function (t) {
  const readFileSyncStub = stub(fs, 'readFileSync').returns('test=foo')
  const parseStub = stub(dotenv, 'parse').returns(mockParseResponse)

  const parsed = { test: 1, home: 2 }
  const processEnv = {}

  dotenv.populate(processEnv, parsed)

  t.alike(parsed, processEnv)

  readFileSyncStub.restore()
  parseStub.restore()
})

test('does not write over keys already in processEnv', function (t) {
  const readFileSyncStub = stub(fs, 'readFileSync').returns('test=foo')
  const parseStub = stub(dotenv, 'parse').returns(mockParseResponse)

  const existing = 'bar'
  const parsed = { test: 'test' }
  const originalValue = env.test
  env.test = existing

  // 'test' returned as value in stub. should keep this 'bar'
  dotenv.populate(env, parsed)

  t.is(env.test, existing)

  // restore
  env.test = originalValue
  readFileSyncStub.restore()
  parseStub.restore()
})

test('does write over keys already in processEnv if override turned on', function (t) {
  const readFileSyncStub = stub(fs, 'readFileSync').returns('test=foo')
  const parseStub = stub(dotenv, 'parse').returns(mockParseResponse)

  const existing = 'bar'
  const parsed = { test: 'test' }
  const originalValue = env.test
  env.test = existing

  // 'test' returned as value in stub. should change this 'bar' to 'test'
  dotenv.populate(env, parsed, { override: true })

  t.is(env.test, parsed.test)

  // restore
  env.test = originalValue
  readFileSyncStub.restore()
  parseStub.restore()
})

test('logs any errors populating when in debug mode but override turned off', function (t) {
  const readFileSyncStub = stub(fs, 'readFileSync').returns('test=foo')
  const parseStub = stub(dotenv, 'parse').returns(mockParseResponse)
  const logStub = stub(console, 'log')

  const parsed = { test: false }
  const originalValue = env.test
  env.test = true

  dotenv.populate(env, parsed, { debug: true })

  t.not(env.test, parsed.test)
  t.ok(logStub.called)

  // restore
  env.test = originalValue
  logStub.restore()
  readFileSyncStub.restore()
  parseStub.restore()
})

test('logs populating when debug mode and override turned on', function (t) {
  const readFileSyncStub = stub(fs, 'readFileSync').returns('test=foo')
  const parseStub = stub(dotenv, 'parse').returns(mockParseResponse)
  const logStub = stub(console, 'log')

  const parsed = { test: false }
  const originalValue = env.test
  env.test = true

  dotenv.populate(env, parsed, { debug: true, override: true })

  console.log('process', env.test, parsed.test)

  t.ok(logStub.called)

  // restore
  env.test = originalValue
  logStub.restore()
  readFileSyncStub.restore()
  parseStub.restore()
})

test('returns any errors thrown on passing not json type', function (t) {
  const readFileSyncStub = stub(fs, 'readFileSync').returns('test=foo')
  const parseStub = stub(dotenv, 'parse').returns(mockParseResponse)

  try {
    dotenv.populate(env, '')
  } catch (e) {
    t.is(e.message, 'OBJECT_REQUIRED: Please check the processEnv argument being passed to populate')
  }

  readFileSyncStub.restore()
  parseStub.restore()
})
