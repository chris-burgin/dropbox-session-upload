// import modules
const { Transform } = require("stream")
const cleanString = require("./cleanString")

class TransformStream extends Transform {
  constructor(options) {
    // super options
    super(options)

    // setup options (apiKey, debugMode)
    this.options = options

    // setup chunk size of 1mb
    this.chunkSize = options.chunkSize || 1 * 1024 * 1024 // 1 MB
  }

  // buffer the input to reach minimal size of options.chunkSize
  checkBuffer(chunk) {
    // check if buffer is already set
    if (this.buffer) {
      // conact a chunk to the existing buffer
      this.buffer = Buffer.concat([this.buffer, chunk])
    } else {
      // no buffer exists, set a new one
      this.buffer = Buffer.from(chunk)
    }

    // return true if buffer length is greater or equal to the chunk size
    return this.buffer.byteLength >= this.chunkSize
  }

  _transform(chunk, encoding, next) {
    // if buffer is too small, wait for more chunks
    if (this.checkBuffer(chunk)) {
      // chunk is big enough to save
      // saving message
      if (this.options.debugMode) {
        console.log(
          `Passing buffer (size: ${Math.round(
            this.buffer.byteLength / 1024
          )} KB) for save location ${cleanString(this.options.saveLocation)}`
        )
      }

      // pass the buffer to be saved
      next(null, this.buffer)

      // Clear the buffer
      this.buffer = undefined
    } else {
      // buffer is to small
      return next()
    }
  }

  _flush(next) {
    // save message
    if (this.options.debugMode) {
      console.log(
        `Passing buffer (size: ${Math.round(
          this.buffer.byteLength / 1024
        )} KB) for save location ${cleanString(this.options.saveLocation)}`
      )
    }

    // pass the buffer to be saved
    next(null, this.buffer)

    // clear the buffer
    this.buffer = undefined
  }
}

// export module
module.exports = TransformStream
