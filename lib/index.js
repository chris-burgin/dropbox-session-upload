// imports
const EventEmitter = require("events")
const uploader = require("./uploader") // uploader functions

// create event emitter
const progressEvent = new EventEmitter()

// returns a Promise.all(uploads) where
// the uploads is an array of promises
const upload = (files, apiKey, debugMode = false) =>
  // wait for all files to be uploaded
  Promise.all(
    files.map(f => uploader({ ...f, apiKey, debugMode, progressEvent }))
  )

// progress, uses a callback to send a status of progress
const progress = callback => progressEvent.on("change", data => callback(data))

// export the functions
module.exports = { upload, progress }
