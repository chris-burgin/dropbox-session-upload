// import modules
const fs = require("fs")
const { upload, progress } = require("..")

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
progress(data => console.log(data))