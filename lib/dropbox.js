// import modules
const { Transform } = require("stream")
const Dropbox = require("dropbox")
const streamLength = require("stream-length")
const cleanString = require("./cleanString")

// Dropbox Upload Stream
class DropboxUploadStream extends Transform {
  constructor(options) {
    // super options
    super(options)

    // setup options (apiKey, debugMode)
    this.options = options

    // setup session, offset, and file size
    this.sessionId = null
    this.offset = 0
    this.totalSize = null

    // setup dropbox information
    this.dropbox = new Dropbox({ accessToken: this.options.apiKey })

    // execute total size calculation
    this.createTotalSize()
  }

  _transform(chunk, encoding, next) {
    // check if session is set
    if (this.sessionId) {
      // call sessionAppend if session already exists
      this.sessionAppend(chunk, next)
    } else {
      // return the session start if it does not exists
      return this.sessionStart(chunk, next)
    }
  }

  _flush(next) {
    // finish the session on flush
    this.sessionFinish(next)
  }

  sessionStart(chunk, next) {
    // start the session on dropbox, sending the first chunk
    this.dropbox
      .filesUploadSessionStart({
        close: false,
        contents: chunk,
      })
      .then(response => {
        // set the session id
        this.sessionId = response.session_id

        // update the offset
        this.offset += chunk.byteLength

        // return next
        return next()
      }, next /* call next if there is an error*/)
  }

  sessionAppend(chunk, next) {
    // append chunk to a session that has already been started
    this.dropbox
      .filesUploadSessionAppendV2({
        cursor: {
          session_id: this.sessionId, // id for this upload session
          offset: this.offset, // offset, current location of chunk
        },
        close: false,
        contents: chunk, // current chunk being uploaded
      })
      .then(() => {
        // set the new offset
        this.offset += chunk.byteLength
        this.caluclateProgress()

        // were done, next
        next()
      }, next /* call next if there is an error*/)
  }

  sessionFinish(next) {
    // let dropbox know we are finished uploading
    this.dropbox
      .filesUploadSessionFinish({
        cursor: {
          session_id: this.sessionId, // id for this upload session
          offset: this.offset, // offset, current location of chunk
        },
        commit: {
          path: cleanString(this.options.saveLocation), // path to save thew new file
          mode: "add", // add mode, this will NOT overwrite an existing file
          autorename: true, // if there is duplicates rename ex. file(2).txt
          mute: false, // show notifications to db users that files were changed
        },
      })
      .then(() => {
        // we are finished uploading the file
        if (this.options.debugMode) {
          console.log(
            `Filed Uploaded for save location ${cleanString(
              this.options.saveLocation
            )}`
          )
        }

        // reset variables
        this.sessionId = null
        this.offset = 0
        this.totalSize = null

        // trigger next because we are done
        next()
      }, next /* call next if there is an error*/)
  }

  caluclateProgress() {
    // check if total size has been set yet
    if (this.totalSize) {
      // size is set, calculate percentage and emit and event
      this.options.progressEvent.emit("change", {
        id: this.options.id,
        percentage: Math.floor(this.offset / this.totalSize * 100),
      })
    }
  }

  createTotalSize() {
    streamLength(this.options.file).then(size => {
      // set the total size
      this.totalSize = size

      // execute calculate size for initial calculation
      this.caluclateProgress()
    })
  }
}

module.exports = DropboxUploadStream
