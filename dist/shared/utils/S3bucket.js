"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
class UploadMiddleware {
    constructor() {
        this.s3 = new client_s3_1.S3Client({
            credentials: {
                secretAccessKey: process.env.S3_SECRET_KEY,
                accessKeyId: process.env.S3_ACCESS_KEY,
            },
            region: process.env.S3_REGION,
        });
        this.storage = (0, multer_s3_1.default)({
            s3: this.s3,
            bucket: process.env.S3_BUCKET_NAME,
            contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.fieldname });
            },
            key: (req, file, cb) => {
                cb(null, Date.now().toString());
            },
        });
        this.upload = (0, multer_1.default)({
            storage: this.storage,
            fileFilter: (req, file, cb) => {
                this.checkFileType(file, cb);
            },
        });
    }
    checkFileType(file, cb) {
        const filetypes = /jpeg|jpg|png|gif|mp4|mov/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        else {
            cb(new Error('Error: Images only (jpeg, jpg, png, gif, mp4, mov)!'));
        }
    }
    getUploadMiddleware() {
        return this.upload;
    }
}
const uploadMiddlewareInstance = new UploadMiddleware();
exports.default = uploadMiddlewareInstance.getUploadMiddleware();
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { Request, Response, NextFunction } from 'express';
// import sharp from 'sharp';
// class UploadMiddleware {
//   private s3: S3Client;
//   constructor() {
//     const accessKeyId = process.env.S3_ACCESS_KEY;
//     const secretAccessKey = process.env.S3_SECRET_KEY;
//     const region = process.env.S3_REGION;
//     if (!accessKeyId || !secretAccessKey || !region) {
//       throw new Error('S3 configuration is missing. Please check your environment variables.');
//     }
//     this.s3 = new S3Client({
//       credentials: {
//         accessKeyId,
//         secretAccessKey,
//       },
//       region,
//     });
//   }
//   public uploadToS3 = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       console.log(req.files);
//       if (!req.files || !Array.isArray(req.files)) {
//         return res.status(400).send('No files were uploaded.'); 
//       }
//       const uploadPromises = req.files.map(async (file: Express.Multer.File) => {
//         const buffer = await sharp(file.buffer)
//           .jpeg({ quality: 90 })
//           .toBuffer();
//         const bucketName = process.env.S3_BUCKET_NAME;
//         if (!bucketName) {
//           throw new Error('S3_BUCKET_NAME is not defined');
//         }
//         const key = `${Date.now()}-${file.originalname}`;
//         const params = {
//           Bucket: bucketName,
//           Key: key,
//           Body: buffer,
//           ContentType: file.mimetype,
//         };
//         const command = new PutObjectCommand(params);
//         const result = await this.s3.send(command);
//         return {
//           key,
//           location: `https://${bucketName}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`,
//           result
//         };
//       });
//       const uploadedFiles = await Promise.all(uploadPromises);
//       req.body.uploadedFiles = uploadedFiles;
//       next();
//     } catch (error) {
//       console.error('Error uploading to S3:', error);
//       res.status(500).send('Error uploading images');
//     }
//   }
// }
// const uploadMiddlewareInstance = new UploadMiddleware();
// export default uploadMiddlewareInstance.uploadToS3;
