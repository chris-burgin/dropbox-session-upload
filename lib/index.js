"use strict"

// Import Required Functions
const upload = require("./upload")

// Uploader Function
const dropboxSessionUpload = (files, apiKey) => 
  // wait for all files to be uploaded
  Promise.all(files.map(f => upload({...f, apiKey})))

module.exports = dropboxSessionUpload
