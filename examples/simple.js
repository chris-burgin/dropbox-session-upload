// import modules
const fs = require("fs")
const { upload } = require("..")

// setup files to upload
const files = [
  {
    file: fs.createReadStream("./datafile.txt"),
    saveLocation: "/datafile1.txt",
  },
  {
    file: fs.createReadStream("./datafile.txt"),
    saveLocation: "/datafile2.txt",
  },
  {
    file: fs.createReadStream("./datafile.txt"),
    saveLocation: "/datafile3.txt",
  },
]

// upload the files
upload(
  files,
  process.env.DROPBOXTOKEN,
  true /* debug mode, defaults to false */
)
  .catch(error => console.log(error))
  .then(() => console.log("Done Uploading!"))
