// import jwt from 'jsonwebtoken';
// import { errorHandler } from './error.js';

// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.access_token;

//     if (!token) return next(errorHandler(401, 'You are not authenticated!'));

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {  
//         if (err) return next(errorHandler(403, 'Token is not valid!'));
//         req.user = user;
//         next();
//     });
// }




// import jwt from 'jsonwebtoken'
// import { Config } from '../../config/Config';

// export class JwtUtils {

//    static verifyToken(val: any): string { 
//     const secret = process.env.MY_SECRET as string;
//     return jwt.sign({ email: val.email, role: val.role }, secret);
//   }
 
// }
