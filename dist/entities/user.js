"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.User = void 0;
class User {
    constructor(fullname, email, password, otp, isVerified, payment, paymentDate, role) {
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.otp = otp;
        this.isVerified = isVerified;
        this.payment = payment;
        this.paymentDate = paymentDate;
        this.role = role;
    }
}
exports.User = User;
class Admin {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
exports.Admin = Admin;
// used  to retive data  in repro
