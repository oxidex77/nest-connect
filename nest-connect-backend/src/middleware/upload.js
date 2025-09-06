const multer = require('multer');
const AWS = require('aws-sdk');

// Configure AWS S3 (only if you have AWS credentials)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Multer memory storage for handling file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Generate signed URL for direct upload (if using S3)
const generateSignedUrl = async (fileName, fileType) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${Date.now()}-${fileName}`,
    ContentType: fileType,
    Expires: 300 // 5 minutes
  };
  
  return s3.getSignedUrl('putObject', params);
};

module.exports = {
  upload,
  generateSignedUrl
};