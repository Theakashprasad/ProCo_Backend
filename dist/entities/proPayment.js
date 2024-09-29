"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProPayment = void 0;
class ProPayment {
    constructor(proId, name, users, status, amount) {
        this.proId = proId;
        this.name = name;
        this.users = users;
        this.status = status;
        this.amount = amount;
    }
}
exports.ProPayment = ProPayment;
