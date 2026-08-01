import multer from "multer";
import path from 'path'

// console.log("Current working directory at multer is:",process.cwd());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public", "temp"))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

export {upload}