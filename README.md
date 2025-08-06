# bare-dotenv [![NPM version](https://img.shields.io/npm/v/bare-dotenv.svg?style=flat-square)](https://www.npmjs.com/package/bare-dotenv)

<img src="https://raw.githubusercontent.com/claudiovb/bare-dotenv/master/dotenv.svg" alt="bare-dotenv" align="right" width="200" />

**bare-dotenv** is a lightweight adaptation of [dotenv](https://github.com/motdotla/dotenv) specifically designed for the [Bare runtime](https://github.com/bare-js/bare). It loads environment variables from a `.env` file into the Bare environment using `bare-env`.

## 🎯 Key Differences from Original dotenv

- **Bare Runtime Support**: Designed specifically for Bare, a lightweight JavaScript runtime
- **No `process.env`**: Uses `bare-env` instead of Node.js's `process.env` (which doesn't exist in Bare)
- **Simplified API**: Removed encryption/decryption features to keep it lightweight
- **No Runtime Preloading**: Bare doesn't support the `-r` preload flag like Node.js
- **Lightweight**: Focused on core functionality without heavy dependencies

## 🌱 Install

```bash
npm install bare-dotenv --save
```

## 🏗️ Usage

### Basic Usage

Create a `.env` file in the root of your project:

```dosini
S3_BUCKET="YOURS3BUCKET"
SECRET_KEY="YOURSECRETKEYGOESHERE"
```

As early as possible in your application, import and configure bare-dotenv:

```javascript
require("bare-dotenv").config();
```

Or using ES6:

```javascript
import "bare-dotenv/config";
```

That's it! Your environment variables are now available through `bare-env`:

```javascript
const env = require("bare-env");

console.log(env.S3_BUCKET); // "YOURS3BUCKET"
console.log(env.SECRET_KEY); // "YOURSECRETKEYGOESHERE"
```

### Advanced Usage

```javascript
const dotenv = require("bare-dotenv");

// Load with custom options
const result = dotenv.config({
  path: "/custom/path/to/.env",
  debug: true,
  override: true,
});

if (result.error) {
  throw result.error;
}

console.log(result.parsed);
```

### Multiple .env Files

```javascript
const dotenv = require("bare-dotenv");

// Load multiple files in order
dotenv.config({
  path: [".env.local", ".env"],
});
```

## 📖 API Reference

### `config(options)`

Loads environment variables from `.env` file(s) into the Bare environment.

#### Options

- **`path`** (string|array): Path to `.env` file(s). Default: `'.env'`
- **`encoding`** (string): File encoding. Default: `'utf8'`
- **`debug`** (boolean): Enable debug logging. Default: `false`
- **`override`** (boolean): Override existing environment variables. Default: `false`
- **`quiet`** (boolean): Suppress logging. Default: `true`

#### Example

```javascript
const dotenv = require("bare-dotenv");

const result = dotenv.config({
  path: ".env.production",
  debug: true,
  override: true,
});

if (result.error) {
  console.error("Error loading .env file:", result.error);
}
```

### `parse(src)`

Parse environment variables from a string or buffer.

```javascript
const dotenv = require("bare-dotenv");

const parsed = dotenv.parse("HELLO=world\nFOO=bar");
console.log(parsed); // { HELLO: 'world', FOO: 'bar' }
```

### `populate(target, parsed, options)`

Populate a target object with parsed environment variables.

```javascript
const dotenv = require("bare-dotenv");
const env = require("bare-env");

const parsed = { HELLO: "world" };
dotenv.populate(env, parsed, { override: true });
```

## 🔧 Configuration via Environment Variables

You can configure bare-dotenv using environment variables:

```bash
# Set custom path
DOTENV_CONFIG_PATH=/custom/path/.env

# Enable debug mode
DOTENV_CONFIG_DEBUG=true

# Override existing variables
DOTENV_CONFIG_OVERRIDE=true

# Set encoding
DOTENV_CONFIG_ENCODING=latin1

# Suppress logging
DOTENV_CONFIG_QUIET=true
```

## 📝 .env File Format

### Basic Variables

```dosini
# Basic key-value pairs
S3_BUCKET="YOURS3BUCKET"
SECRET_KEY="YOURSECRETKEYGOESHERE"
DATABASE_URL="postgres://user:pass@localhost/db"
```

### Multiline Values

```dosini
# Multiline values (>= v15.0.0)
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----"
```

### Comments

```dosini
# This is a comment
SECRET_KEY=YOURSECRETKEYGOESHERE # inline comment
SECRET_HASH="something-with-a-#-hash"
```

### Quoted Values

```dosini
# Single quotes
SINGLE_QUOTE='quoted value'

# Double quotes (supports \n for newlines)
MULTILINE="new\nline"

# Backticks
BACKTICK_KEY=`This has 'single' and "double" quotes inside`
```

## 🚀 Examples

### Basic Application

```javascript
// index.js
require("bare-dotenv").config();

const env = require("bare-env");

console.log(`Hello ${env.USER_NAME}!`);
console.log(`Database: ${env.DATABASE_URL}`);
```

### With Custom Options

```javascript
// config.js
const dotenv = require("bare-dotenv");

// Load environment-specific config
const env = process.env.NODE_ENV || "development";
dotenv.config({
  path: `.env.${env}`,
  debug: true,
  override: true,
});
```

### Testing

```javascript
// test.js
const test = require("brittle");
const dotenv = require("bare-dotenv");

test("loads environment variables", function (t) {
  dotenv.config({ path: "tests/.env.test" });

  const env = require("bare-env");
  t.is(env.TEST_VAR, "test_value");
});
```

## ❓ FAQ

### Why doesn't bare-dotenv support encryption?

Bare-dotenv is designed to be lightweight and focused on core functionality. Encryption features were removed to keep the module simple and avoid dependencies on `bare-crypto` which may not support all required crypto methods.

### Why no runtime preloading?

Bare runtime doesn't support the `-r` preload flag like Node.js. You need to explicitly require and configure bare-dotenv in your application code.

### How is this different from the original dotenv?

- **Runtime**: Designed for Bare instead of Node.js
- **Environment**: Uses `bare-env` instead of `process.env`
- **Features**: Removed encryption, preloading, and other Node.js-specific features
- **Size**: Lighter weight with fewer dependencies

### Can I use this with Node.js?

No, this module is specifically designed for the Bare runtime. For Node.js, use the original [dotenv](https://github.com/motdotla/dotenv) package.

### What about variable expansion?

Variable expansion is not supported in bare-dotenv. Consider using [dotenvx](https://github.com/dotenvx/dotenvx) for advanced features like variable expansion and encryption.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License

See [LICENSE](LICENSE)

## 🙏 Acknowledgments

This project is based on the original [dotenv](https://github.com/motdotla/dotenv) by [motdotla](https://github.com/motdotla), adapted for the Bare runtime.

## 📊 Who's using bare-dotenv?

Projects that use bare-dotenv often use the [keyword "bare-dotenv" on npm](https://www.npmjs.com/search?q=keywords:bare-dotenv).
