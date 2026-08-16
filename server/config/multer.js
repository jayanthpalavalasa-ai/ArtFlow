const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'artflow-bookings',
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
});

const upload = multer({ storage });

module.exports = upload;