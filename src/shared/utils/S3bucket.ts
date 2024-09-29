import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import util from 'util';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { Request } from 'express';

// Define the environment variables for TypeScript
interface ProcessEnv {
  S3_SECRET_KEY: string;
  S3_ACCESS_KEY: string;
  S3_REGION: string;
  S3_BUCKET_NAME: string;
}

declare const process: {
  env: ProcessEnv;
};

class UploadMiddleware {
  private s3: S3Client;
  private storage: multer.StorageEngine;
  public upload: multer.Multer;

  constructor() {
    this.s3 = new S3Client({
      credentials: {
        secretAccessKey: process.env.S3_SECRET_KEY,
        accessKeyId: process.env.S3_ACCESS_KEY,
      },
      region: process.env.S3_REGION,
    });

    this.storage = multerS3({
      s3: this.s3,
      bucket: process.env.S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
        cb(null, Date.now().toString());
      },
    });

    this.upload = multer({
      storage: this.storage,
      fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        this.checkFileType(file, cb);
      },
    });
  }

  private checkFileType(file: Express.Multer.File, cb: FileFilterCallback) {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
 
    if (extname && mimetype) {
      return cb(null, true); 
    } else { 
      cb(new Error('Error: Images only (jpeg, jpg, png, gif, mp4, mov)!'));
    }
  }

  public getUploadMiddleware() {
    return this.upload;
  }
}

const uploadMiddlewareInstance = new UploadMiddleware(); 
export default uploadMiddlewareInstance.getUploadMiddleware();
 

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