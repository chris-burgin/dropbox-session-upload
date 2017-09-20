// import modules
const { Transform } = require("stream")
const Dropbox = require("dropbox")

// Dropbox Upload Stream
class DropboxUploadStream extends Transform {
  constructor(options) {
    // super options
    super(options)

    // setup options
    this.options = options

    // setup session and offset information
    this.sessionId = null
    this.offset = 0

    // setup dropbox information
    this.dropbox = new Dropbox({ accessToken: this.options.apiKey })
  }

  _transform(chunk, encoding, next) {

    if (!this.sessionId) {
      return this.sessionStart(chunk, next)
    }

    this.sessionAppend(chunk, next)
  }

  _flush(next) {
    this.sessionFinish(next)
  }

	/**
	 * Starts a dropbox session
	 *
	 * @param chunk
	 * @param next
	 */
  sessionStart(chunk, next) {
    this.dropbox.filesUploadSessionStart({
      close: false,
      contents: chunk
    })
      .then((response) => {
        this.sessionId = response.session_id
        this.offset += chunk.byteLength
        return next()
      }, next)
  }

	/**
	 * Appends data to an open dropbox session
	 *
	 * @param chunk
	 * @param next
	 */
  sessionAppend(chunk, next) {
    this.dropbox.filesUploadSessionAppendV2({
      cursor: {
        session_id: this.sessionId,
        offset: this.offset
      },
      close: false,
      contents: chunk
    })
      .then(() => {
        console.log("End of Session")
        this.offset += chunk.byteLength
        next()
      }, next)
  }

	/**
	 * Closes the session and commits the file(s)
	 *
	 * @param next
	 */
  sessionFinish(next) {
    this.dropbox.filesUploadSessionFinish({
      "cursor": {
        "session_id": this.sessionId,
        "offset": this.offset
      },
      "commit": {
        "path": this.options.saveLocation,
        "mode": "add",
        "autorename": true,
        "mute": false
      }
    })
      .then(() => {
        console.log("SessionFinish: End")
        this.sessionId = null
        this.offset = 0
        next()
      }, next)
  }
}

module.exports = DropboxUploadStream
