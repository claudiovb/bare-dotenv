# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.0](https://github.com/claudiovb/bare-dotenv/compare/v17.2.1...v1.0.0) (2025-08-06)

### 🎉 Initial Release - Bare Runtime Adaptation

This is the initial release of **bare-dotenv**, a lightweight adaptation of [dotenv](https://github.com/motdotla/dotenv) specifically designed for the [Bare runtime](https://github.com/bare-js/bare).

### ✨ Major Features

- **Bare Runtime Support**: Designed specifically for Bare, a lightweight JavaScript runtime
- **Lightweight Environment Management**: Uses `bare-env` instead of Node.js's `process.env`
- **Simplified API**: Focused on core functionality without heavy dependencies
- **TypeScript Support**: Full TypeScript definitions included
- **Brittle Testing**: Integrated with the Brittle testing framework for Bare

### 🔄 Key Changes from Original dotenv

#### Removed Features

- **Encryption/Decryption**: Removed `.env.vault` support and encryption features to keep the module lightweight
- **Runtime Preloading**: Removed `-r` preload flag support (not supported in Bare)
- **Node.js Dependencies**: Replaced Node.js-specific modules with Bare equivalents
- **Process.env**: Replaced with `bare-env` for environment variable management

#### Adapted Features

- **Environment Variables**: Now uses `bare-env` instead of `process.env`
- **File System**: Uses `bare-fs` for file operations
- **Path Operations**: Uses `bare-path` for path manipulation
- **OS Operations**: Uses `bare-os` for operating system interactions
- **Testing**: Switched to Brittle testing framework

### 🛠️ Technical Changes

#### Core Architecture

- **Module Structure**: Adapted all core modules to work with Bare runtime
- **Dependencies**: Replaced Node.js dependencies with Bare equivalents:
  - `bare-env` for environment variables
  - `bare-fs` for file system operations
  - `bare-path` for path operations
  - `bare-os` for OS operations
  - `bare-tty` for terminal operations
  - `bare-utils` for utility functions

#### Testing Framework

- **Brittle Integration**: Replaced Node.js testing frameworks with Brittle
- **Test Stubs**: Added test stubs for Bare-specific functionality
- **Environment Testing**: Updated environment variable tests to work with `bare-env`

#### Configuration

- **Environment Options**: Made `env-options.js` dynamic to read environment variables at runtime
- **CLI Options**: Adapted CLI options parsing for Bare runtime
- **TypeScript**: Added comprehensive TypeScript support

### 📝 Documentation

- **README.md**: Completely rewritten to reflect Bare-specific usage and limitations
- **README-es.md**: Spanish version updated with Bare-specific content
- **API Documentation**: Updated all examples to use `bare-env` instead of `process.env`

### 🔧 Development

- **Package.json**: Updated to reflect bare-dotenv branding and dependencies
- **Scripts**: Adapted build and test scripts for Bare runtime
- **Linting**: Updated linting configuration for Bare compatibility

### 🚀 Migration Guide

If you're migrating from the original dotenv:

1. **Install**: `npm install bare-dotenv --save`
2. **Import**: Change `require('dotenv')` to `require('bare-dotenv')`
3. **Environment**: Use `require('bare-env')` instead of `process.env`
4. **Configuration**: Update any encryption or preloading configurations

### 📊 Compatibility

- **Runtime**: Bare runtime only (not compatible with Node.js)
- **Version**: Requires Bare runtime >=1.0.0
- **Features**: Core dotenv functionality without encryption or preloading

### 🙏 Acknowledgments

This project is based on the original [dotenv](https://github.com/motdotla/dotenv) by [motdotla](https://github.com/motdotla), adapted for the Bare runtime by [claudiovb](https://github.com/claudiovb).

---

## Previous Versions

This changelog starts from version 1.0.0. For the original dotenv changelog, see the [original dotenv repository](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md).
