// import upload function
const upload = require("./upload")

// returns a Promise.all(uploads) where
// the uploads is an array of promises
const dropboxSessionUpload = (files, apiKey, debugMode=false) => 
  // wait for all files to be uploaded
  Promise.all(files.map(f => upload({ ...f, apiKey, debugMode})))

// export the function
module.exports = dropboxSessionUpload
