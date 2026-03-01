const multer = require('multer');

// Use memory storage to hold the file buffer before uploading to Cloudinary
const storage = multer.memoryStorage();

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB
});

module.exports = upload;
