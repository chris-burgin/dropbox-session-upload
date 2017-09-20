# Dropbox Session Upload
## About
Dropbox Session Upload provides a wrapper around the [Dropbox Node Package](https://github.com/dropbox/dropbox-sdk-js). Session Uploading via the Dropbox
API is used for files that are large than 150mb. This section of the API can
be complicated and this package hopes to provide a clean wrapper around this
complicated API. This wrapper also supports concurrent file uploading out
of the box.
## Requirements
- Node `8.3.0` or greater

## Installation
`npm install dropbox_session_upload`

## Usage

### Upload Files
_This Example can be found in `/example/index.js`_
```javascript
// import modules
const fs = require("fs")
const dropboxSessionUpload = require("dropbox_session_upload")

// setup files to upload
const files = [
  {
    file: fs.createReadStream("./datafile.txt"),
    saveLocation: "/datafile1.txt"
  },
  {
    file: fs.createReadStream("./datafile.txt"),
    saveLocation: "/datafile2.txt"
  },
  {
    file: fs.createReadStream("./datafile.txt"),
    saveLocation: "/datafile3.txt"
  }
]

// upload the files
dropboxSessionUpload(files, process.env.DROPBOXTOKEN, true /* debug mode, defaults to false */)
  .catch(error => console.log(error)) // error
  .then(() => console.log("Done Uploading!")) // done uploading
```