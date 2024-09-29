"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtUtils {
    // to generate token for sending to frontend 
    static generateToken(val) {
        const secret = process.env.MY_SECRET;
        return jsonwebtoken_1.default.sign({ id: val._id, email: val.email, role: val.role }, secret);
    }
    // middleware for checking if the jwt token is valid or not
    static verifyToken(req, res, next) {
        const token = req.cookies.access_token;
        if (!token)
            return next(createError(401, 'You are not authenticated!'));
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.MY_SECRET);
            req.userId = decoded.id;
            next();
        }
        catch (error) {
            next(createError(401, 'Invalid token'));
        }
    }
}
exports.JwtUtils = JwtUtils;
function createError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}
