import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { S3Client, PutObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { Request, RequestHandler } from 'express';
import sharp from 'sharp';

class UploadMiddleware {
  private s3: S3Client;

  constructor() {
    const s3Config: S3ClientConfig = {
      credentials: {
        secretAccessKey: process.env.S3_SECRET_KEY ?? '',
        accessKeyId: process.env.S3_ACCESS_KEY ?? '',
      },
      region: process.env.S3_REGION ?? '',
    };

    this.s3 = new S3Client(s3Config);
  }

  getUploadMiddleware(): RequestHandler {
    const storage = multerS3({
      s3: this.s3,
      bucket: process.env.S3_BUCKET_NAME ?? '',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });

    return multer({
      storage: storage,
      fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        this.checkFileType(file, cb);
      },
    }).fields([
      { name: 'file', maxCount: 10 },
      { name: 'cropped_image', maxCount: 10 },
    ]);
  }

  private async resizeAndUploadCroppedImage(
    file: Express.Multer.File
  ): Promise<{ key: string; location: string }> {
    const bucketName = process.env.S3_BUCKET_NAME ?? '';
    const key = `${Date.now()}-${file.originalname}`;

    const buffer = await sharp(file.buffer)
      .resize(400, 400, { fit: 'contain' })
      .jpeg({ quality: 90 })
      .toBuffer();

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await this.s3.send(command);

    return {
      key,
      location: `https://${bucketName}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`,
    };
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
}

const uploadMiddlewareInstance = new UploadMiddleware();
export default uploadMiddlewareInstance.getUploadMiddleware();
