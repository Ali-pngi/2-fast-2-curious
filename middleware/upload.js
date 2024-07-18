const multer = require('multer')
const path = require('path')

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    return cb(new Error('Only .jpeg, .jpg, .png, .gif formats allowed!'), false)
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000000 }, 
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  }
}).single('carImage')

module.exports = upload
