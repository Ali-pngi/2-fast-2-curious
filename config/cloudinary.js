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
    upload_preset: 'cars-upload'  // Add this line to use the upload preset
  }
});

const upload = multer({ storage: storage });

module.exports = upload;