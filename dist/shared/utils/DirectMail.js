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
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: "quuv atrp tguy xchw",
            },
        });
    }
    sendMail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, subject, text }) {
            try {
                yield this.transporter.sendMail({
                    from: 'ProCo@gmail.com',
                    to: email,
                    subject: subject,
                    text: text,
                });
                console.log("Email sent successfully");
            }
            catch (error) {
                console.log("Email not sent!");
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = MailService;
