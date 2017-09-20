const debug = require("debug")("stream-to-dropbox:transform-stream")
const { Transform } = require("stream")

class TransformStream extends Transform {
  constructor(options) {
    super(options)

    // setup options
    this.options = options

    // setup chunk size of 1mb
    this.chunkSize = options.chunkSize || 1 * 1024 * 1024 // 1 MB
  }

	// Buffer the input to reach minimal size of options.chunkSize
  checkBuffer(chunk) {
    if (!this.buffer) {
      this.buffer = Buffer.from(chunk)
    } else {
      this.buffer = Buffer.concat([this.buffer, chunk])
    }

    return this.buffer.byteLength >= this.chunkSize
  }

  _transform(chunk, encoding, next) {
    // If buffer is too small, wait for more chunks
    if (!this.checkBuffer(chunk)) {
      return next()
    }

    // Chunk is big enough
    console.log(`Passing buffer (size: ${Math.round(this.buffer.byteLength / 1024)} KB) for save location ${this.options.saveLocation}`)
    next(null, this.buffer)
    // Clear the buffer
    this.buffer = undefined
  }

  _flush(next) {
    console.log(`Passing buffer (size: ${Math.round(this.buffer.byteLength / 1024)} KB) for save location ${this.options.saveLocation}`)
    next(null, this.buffer)
    this.buffer = undefined
  }
}

module.exports = TransformStream
