"use strict"

// Import Required Classes
const TransformStream = require("./transform")
const DropboxUploadStream = require("./dropbox")

// Uploader Function
const upload = (data) => 
  new Promise((resolve, reject) => {
    // Prepare the Streams
    const transformStream = new TransformStream({ ...data, chunkSize: 8000 * 1024 })
    const dropboxUpload = new DropboxUploadStream(data)

    // pipe to the file
    data.file.pipe(transformStream).pipe(dropboxUpload)
      .on("error", (err) => {
        reject(err)
      })
      .on("finish", () => {
        resolve()
      })})

module.exports = upload
