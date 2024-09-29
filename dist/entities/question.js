"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
class Question {
    constructor(question, name, answers, communityId) {
        this.question = question;
        this.name = name;
        this.answers = answers;
        this.communityId = communityId;
    }
}
exports.Question = Question;
