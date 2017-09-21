// import modules
const fs = require("fs")
const EventEmitter = require("events")
const dropboxSessionUpload = require("..")

// create event emitter to listen for progress changes
// this package requires that you create your own event emitter
// so we will create one that get passed in with all our files
const progress = new EventEmitter()

// setup files to upload
const files = [
  {
    file: fs.createReadStream("./datafile.txt"),
    saveLocation: "/datafile1.txt",
    progressEvent: progress, // optional
    id: "123" // required if `progressEvent` is present 
  },
  {
    file: fs.createReadStream("./datafile.txt"),
    saveLocation: "/datafile2.txt",
    progressEvent: progress, // optional
    id: "1234" // required if `progressEvent` is present 
  },
  {
    file: fs.createReadStream("./datafile.txt"),
    saveLocation: "/datafile3.txt",
    progressEvent: progress, // optional
    id: "12345" // required if `progressEvent` is present 
  }
]

// upload the files
dropboxSessionUpload(files, process.env.DROPBOXTOKEN, true /* debug mode, defaults to false */)
  .catch(error => console.log(error))
  .then(() => console.log("Done Uploading!"))


// listen for progress changes
progress.on("change", ({id, percentage}) => {
  console.log(`${id} is at ${percentage}`)
})