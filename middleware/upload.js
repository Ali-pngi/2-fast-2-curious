const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: '2-fast-2-curious',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' }
    ],
     
  }
});

const uploadMiddleware = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
}).single('carImage');

module.exports = uploadMiddleware;