 const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const config = require('./constants');

aws.config.update({
  secretAccessKey: 'N7Vhcl+KhstjBP+YXu9zYLefp5D7fsXjgTdHV7RM',
  accessKeyId: 'AKIAUGCO2RDMF7K6KPV7',
  region: 'ap-southeast-1'
})

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype != "image/png" 
    && file.mimetype != "image/jpg" 
    && file.mimetype != "image/jpeg"
    && file.mimetype != "application/pdf" 
    && file.mimetype != "application/msword" 
    && file.mimetype != "application/vnd.ms-excel"
    && file.mimetype != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    && file.mimetype != "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    req.fileValidationError = 'Invalid file type';
    return cb(null, false, new Error());
  }
  cb(null, true);
}

const upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'cirquolus/' + config.company,
    acl: 'public-read',
    // contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'WWW.CIRQUOLUS.COM' });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '_' + file.originalname)
    }
  })
})


module.exports = upload; 


/* const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");

const config = require("./constants");

const s3 = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    secretAccessKey: 'N7Vhcl+KhstjBP+YXu9zYLefp5D7fsXjgTdHV7RM',
    accessKeyId: 'AKIAUGCO2RDMF7K6KPV7',
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype != "image/png" &&
    file.mimetype != "image/jpg" &&
    file.mimetype != "image/jpeg" &&
    file.mimetype != "application/pdf" &&
    file.mimetype != "application/msword" &&
    file.mimetype != "application/vnd.ms-excel" &&
    file.mimetype != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
    file.mimetype != "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    req.fileValidationError = "Invalid file type";
    return cb(null, false, new Error());
  }
  cb(null, true);
};

const customMulterS3 = (options) => {
  const storage = {
    async _handleFile(req, file, cb) {
      options.key(req, file, async (error, key) => {
        if (error) {
          cb(error);
          return;
        }

        options.metadata(req, file, async (metadataError, metadata) => {
          if (metadataError) {
            cb(metadataError);
            return;
          }

          const params = {
            Bucket: options.bucket,
            Key: key,
            Body: file.stream,
            ContentType: file.mimetype,
            ACL: options.acl,
            Metadata: metadata,
          };

          try {
            const result = await s3.send(new PutObjectCommand(params));
            cb(null, {
              location: result.Location,
              key: params.Key,
            });
          } catch (err) {
            cb(err);
          }
        });
      });
    },

    _removeFile(req, file, cb) {
      // Not implemented
      cb(null);
    },
  };

  return storage;
};


const upload = multer({
  fileFilter: fileFilter,
  storage: customMulterS3({
    bucket: "cirquolus/" + config.company,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "WWW.CIRQUOLUS.COM" });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "_" + file.originalname);
    },
  }),
});

module.exports = upload;
 */