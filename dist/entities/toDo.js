"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
class Todo {
    constructor(text, status, completedOn, userId) {
        this.text = text;
        this.status = status;
        this.completedOn = completedOn;
        this.userId = userId;
    }
}
exports.Todo = Todo;
