// A simple stubbing system for tests to replace sinon functionality
class Stub {
  constructor (originalObject, propertyName, originalMethod) {
    this.originalObject = originalObject
    this.propertyName = propertyName
    this.originalMethod = originalMethod
    this.returnValue = undefined
    this.throwsError = false
    this.throwsValue = null
    this.callCount = 0
    this.calls = []
    this.valueToSet = undefined
    this.isValue = false
  }

  returns (value) {
    this.returnValue = value
    return this
  }

  throws (error) {
    this.throwsError = true
    this.throwsValue = error || new Error('Stub error')
    return this
  }

  value (val) {
    this.isValue = true
    this.valueToSet = val
    // For property stubs, we need to set the value immediately
    if (this.originalObject && this.propertyName) {
      this.originalObject[this.propertyName] = val
    }
    return this
  }

  get called () {
    return this.callCount > 0
  }

  getCalls () {
    return this.calls
  }

  restore () {
    if (this.originalObject && this.propertyName) {
      if (this.isValue) {
        // For property stubs, restore the original value
        this.originalObject[this.propertyName] = this.originalMethod
      } else {
        // For method stubs, restore the original method
        this.originalObject[this.propertyName] = this.originalMethod
      }
    }
  }

  // The stub function that replaces the original
  _stubFunction (...args) {
    this.callCount++
    this.calls.push({ args })

    if (this.throwsError) {
      throw this.throwsValue
    }

    return this.returnValue
  }
}

class StubHelper {
  constructor () {
    this.stubs = []
  }

  stub (object, property, replacement) {
    const originalMethod = object[property]
    const stub = new Stub(object, property, originalMethod)

    if (replacement) {
      object[property] = replacement
    } else {
      // Create the stub function
      const stubFunction = (...args) => stub._stubFunction(...args)
      Object.setPrototypeOf(stubFunction, stub)
      Object.assign(stubFunction, stub)
      object[property] = stubFunction
    }

    this.stubs.push(stub)
    return stub
  }

  restoreAll () {
    this.stubs.forEach(stub => stub.restore())
    this.stubs = []
  }
}

// Global stub helper instance
const stubHelper = new StubHelper()

// Export both the class and a convenience function similar to sinon.stub
module.exports = {
  stub: (object, property, replacement) => stubHelper.stub(object, property, replacement),
  restoreAll: () => stubHelper.restoreAll(),
  Stub,
  StubHelper
}
