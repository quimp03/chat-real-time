const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const uploadToCloudinary = require("../../helpers/uploadToCloudinary.helper");

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports.uploadSingle = async (req, res, next) => {
  if(req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      req.body[req.file.fieldname] = result.url;
      next();
    }

    upload(req);
    const link = await uploadToCloudinary(req.file.buffer);
    req.body[req.file.fieldname] = link;
    next();
  } else {
    next();
  }
}