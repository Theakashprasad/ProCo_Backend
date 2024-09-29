"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const sharp_1 = __importDefault(require("sharp"));
class UploadMiddleware {
    constructor() {
        var _a, _b, _c;
        const s3Config = {
            credentials: {
                secretAccessKey: (_a = process.env.S3_SECRET_KEY) !== null && _a !== void 0 ? _a : '',
                accessKeyId: (_b = process.env.S3_ACCESS_KEY) !== null && _b !== void 0 ? _b : '',
            },
            region: (_c = process.env.S3_REGION) !== null && _c !== void 0 ? _c : '',
        };
        this.s3 = new client_s3_1.S3Client(s3Config);
    }
    getUploadMiddleware() {
        var _a;
        const storage = (0, multer_s3_1.default)({
            s3: this.s3,
            bucket: (_a = process.env.S3_BUCKET_NAME) !== null && _a !== void 0 ? _a : '',
            contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.fieldname });
            },
            key: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            },
        });
        return (0, multer_1.default)({
            storage: storage,
            fileFilter: (req, file, cb) => {
                this.checkFileType(file, cb);
            },
        }).fields([
            { name: 'file', maxCount: 10 },
            { name: 'cropped_image', maxCount: 10 },
        ]);
    }
    resizeAndUploadCroppedImage(file) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const bucketName = (_a = process.env.S3_BUCKET_NAME) !== null && _a !== void 0 ? _a : '';
            const key = `${Date.now()}-${file.originalname}`;
            const buffer = yield (0, sharp_1.default)(file.buffer)
                .resize(400, 400, { fit: 'contain' })
                .jpeg({ quality: 90 })
                .toBuffer();
            const params = {
                Bucket: bucketName,
                Key: key,
                Body: buffer,
                ContentType: file.mimetype,
            };
            const command = new client_s3_1.PutObjectCommand(params);
            yield this.s3.send(command);
            return {
                key,
                location: `https://${bucketName}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`,
            };
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
}
const uploadMiddlewareInstance = new UploadMiddleware();
exports.default = uploadMiddlewareInstance.getUploadMiddleware();
