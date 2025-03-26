const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create directory paths with absolute paths
const rootDir = path.resolve(__dirname, '..');
const tempDir = path.join(rootDir, 'public', 'temp');
const uploadsDir = path.join(rootDir, 'public', 'uploads');

console.log('Temp directory absolute path:', tempDir);
console.log('Uploads directory absolute path:', uploadsDir);

// Create directories if they don't exist
[tempDir, uploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(`Storing ${file.fieldname} in ${tempDir}`);
      cb(null, tempDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExt = path.extname(file.originalname);
      const filename = file.fieldname + '-' + uniqueSuffix + fileExt;
      console.log(`Generated filename: ${filename}`);
      cb(null, filename);
    }
})
  
// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg and .png files are allowed!'));
  }
};

// Create the multer instance
const upload = multer({ 
    storage, 
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: fileFilter
})

// Export using CommonJS syntax
module.exports = { upload };