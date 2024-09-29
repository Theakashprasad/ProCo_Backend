"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
class Connection {
    constructor(senterId, follow, receiverId) {
        this.senterId = senterId;
        this.follow = follow;
        this.receiverId = receiverId;
    }
}
exports.Connection = Connection;
