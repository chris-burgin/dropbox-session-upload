// import modules
const fs = require("fs")

// import package
const dropboxSessionUpload = require("..")

// setup files to upload
const files = [
  {
    file: fs.createReadStream("./tests/data/testfile.txt"),
    saveLocation: "/testfile1.txt"
  },
  {
    file: fs.createReadStream("./tests/data/testfile.txt"),
    saveLocation: "/testfile2.txt"
  },
  {
    file: fs.createReadStream("./tests/data/testfile.txt"),
    saveLocation: "/testfile3.txt"
  }
]

// upload
dropboxSessionUpload(files, process.env.DROPBOXTOKEN)
  .then(() => false)
  .catch(error => console.log(error))