const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const config = require('../config');

const s3 = new aws.S3({
  accessKeyId: config.awsAccessKey,
  secretAccessKey: config.awsSecretKey,
  region: 'ap-northeast-2',
});

const uploadReview = multer({
  storage: multerS3({
    s3,
    bucket: 'platform-image-bucket',
    acl: 'public-read',
    key(req, file, cb) {
      cb(null, `review/${Date.now()}.${file.originalname.split('.').pop()}`);
    },
  }),
  limits: { fileSize: 5000 * 5000 * 5 },
});

const uploadItem = multer({
  storage: multerS3({
    s3,
    bucket: 'platform-image-bucket',
    acl: 'public-read',
    key(req, file, cb) {
      cb(null, `item/${Date.now()}.${file.originalname.split('.').pop()}`);
    },
  }),
  limits: { fileSize: 5000 * 5000 * 5 },
});

module.exports = {
  uploadReview,
  uploadItem,
};
