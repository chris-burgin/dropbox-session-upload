// import required classes
const TransformStream = require("./transform")
const DropboxUploadStream = require("./dropbox")

// return a promise that is resolved when the file
// is successfully uploaded or rejected when
// there is an error
const upload = data => 
  new Promise((resolve, reject) => {
    // setup transform stream with the upload data and a 8mb chunk size
    const transformStream = 
      new TransformStream({ ...data, chunkSize: 8000 * 1024 })

    // setup dropbox stream with the upload data
    const dropboxUpload = new DropboxUploadStream(data)

    // pipe our file
    data.file
      // pipe in transform and dropbox upload
      .pipe(transformStream)
      .pipe(dropboxUpload)

      // event listeners
      .on("error", err => 
        // error, reject and return the error
        reject(err))
      .on("finish", () => 
        // no error, resolve
        resolve())})

// export upload module
module.exports = upload
