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
### Upload Files Basic
_This Example can be found in `/examples/simple.js`_
```javascript
// import modules
const fs = require("fs")
const {upload} = require("dropbox_session_upload")

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
upload(files, process.env.DROPBOXTOKEN, true /* debug mode, defaults to false */)
  .catch(error => console.log(error))
  .then(() => console.log("Done Uploading!"))
```

### Upload with Progress Tracking
_This Example can be found in `/examples/progressTracking.js`_

Adding progress tracking is simple, but due to the dropbox api progress will 
only be updated every 8mb. This is the size of chunks this packages uploads 
at once. So you will find that progress jumps in 8mb chunks. While annoying 
it can still be helpful to know where your file is at in the upload process.

```javascript
// import modules
const fs = require("fs")
const { upload, progress } = require("dropbox_session_upload")

// setup files to upload
const files = [
  {
    file: fs.createReadStream("./datafile.txt"),
    saveLocation: "/datafile1.txt",
    id: "1" // required for progress
  },
  {
    file: fs.createReadStream("./datafile.txt"),
    saveLocation: "/datafile1.txt",
    id: "2" // required for progress
  },
  {
    file: fs.createReadStream("./datafile.txt"),
    saveLocation: "/datafile1.txt",
    id: "3" // required for progress
  }
]

// upload the files
upload(files, process.env.DROPBOXTOKEN)
  .catch(error => console.log(error))
  .then(() => console.log("Files Done!"))

// listen for updates to the progress
// this will return `id` and `percentage`
progress(data => console.log(data))
```

### Things to note when uploading
- This library will automatically strip out the following characters from `saveLocation` `* | & ! @ # $ % ^ * ( ) [ ] { } | - _ = + < > ' " < >` to comply with dropbox file name requirements.