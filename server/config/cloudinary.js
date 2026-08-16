const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

module.exports = cloudinary;