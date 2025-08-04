const fs = require('bare-fs')
const test = require('brittle')

const dotenv = require('../lib/main')

test('parse multiline', function (t) {
  const parsed = dotenv.parse(fs.readFileSync('tests/.env.multiline', { encoding: 'utf8' }))

  t.ok(typeof parsed === 'object', 'should return an object')

  t.is(parsed.BASIC, 'basic', 'sets basic environment variable')

  t.is(parsed.AFTER_LINE, 'after_line', 'reads after a skipped line')

  t.is(parsed.EMPTY, '', 'defaults empty values to empty string')

  t.is(parsed.SINGLE_QUOTES, 'single_quotes', 'escapes single quoted values')

  t.is(parsed.SINGLE_QUOTES_SPACED, '    single quotes    ', 'respects surrounding spaces in single quotes')

  t.is(parsed.DOUBLE_QUOTES, 'double_quotes', 'escapes double quoted values')

  t.is(parsed.DOUBLE_QUOTES_SPACED, '    double quotes    ', 'respects surrounding spaces in double quotes')

  t.is(parsed.EXPAND_NEWLINES, 'expand\nnew\nlines', 'expands newlines but only if double quoted')

  t.is(parsed.DONT_EXPAND_UNQUOTED, 'dontexpand\\nnewlines', 'expands newlines but only if double quoted')

  t.is(parsed.DONT_EXPAND_SQUOTED, 'dontexpand\\nnewlines', 'expands newlines but only if double quoted')

  t.absent(parsed.COMMENTS, 'ignores commented lines')

  t.is(parsed.EQUAL_SIGNS, 'equals==', 'respects equals signs in values')

  t.is(parsed.RETAIN_INNER_QUOTES, '{"foo": "bar"}', 'retains inner quotes')

  t.is(parsed.RETAIN_INNER_QUOTES_AS_STRING, '{"foo": "bar"}', 'retains inner quotes')

  t.is(parsed.TRIM_SPACE_FROM_UNQUOTED, 'some spaced out string', 'retains spaces in string')

  t.is(parsed.USERNAME, 'therealnerdybeast@example.tld', 'parses email addresses completely')

  t.is(parsed.SPACED_KEY, 'parsed', 'parses keys and values surrounded by spaces')

  t.is(parsed.MULTI_DOUBLE_QUOTED, 'THIS\nIS\nA\nMULTILINE\nSTRING', 'parses multi-line strings when using double quotes')

  t.is(parsed.MULTI_SINGLE_QUOTED, 'THIS\nIS\nA\nMULTILINE\nSTRING', 'parses multi-line strings when using single quotes')

  t.is(parsed.MULTI_BACKTICKED, 'THIS\nIS\nA\n"MULTILINE\'S"\nSTRING', 'parses multi-line strings when using backticks')

  const multiPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnNl1tL3QjKp3DZWM0T3u
LgGJQwu9WqyzHKZ6WIA5T+7zPjO1L8l3S8k8YzBrfH4mqWOD1GBI8Yjq2L1ac3Y/
bTdfHN8CmQr2iDJC0C6zY8YV93oZB3x0zC/LPbRYpF8f6OqX1lZj5vo2zJZy4fI/
kKcI5jHYc8VJq+KCuRZrvn+3V+KuL9tF9v8ZgjF2PZbU+LsCy5Yqg1M8f5Jp5f6V
u4QuUoobAgMBAAE=
-----END PUBLIC KEY-----`
  t.is(parsed.MULTI_PEM_DOUBLE_QUOTED, multiPem)

  const payload = dotenv.parse(Buffer.from('BUFFER=true'))
  t.is(payload.BUFFER, 'true', 'should parse a buffer into an object')

  const expectedPayload = { SERVER: 'localhost', PASSWORD: 'password', DB: 'tests' }

  const RPayload = dotenv.parse(Buffer.from('SERVER=localhost\rPASSWORD=password\rDB=tests\r'))
  t.alike(RPayload, expectedPayload, 'can parse (\\r) line endings')

  const NPayload = dotenv.parse(Buffer.from('SERVER=localhost\nPASSWORD=password\nDB=tests\n'))
  t.alike(NPayload, expectedPayload, 'can parse (\\n) line endings')

  const RNPayload = dotenv.parse(Buffer.from('SERVER=localhost\r\nPASSWORD=password\r\nDB=tests\r\n'))
  t.alike(RNPayload, expectedPayload, 'can parse (\\r\\n) line endings')
})
