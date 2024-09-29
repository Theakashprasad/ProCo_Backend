"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const mongoose_1 = require("mongoose");
const QuizSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    communityId: { type: String },
    questions: [{ question: { type: String, required: true }, options: [{ option: { type: String, required: true }, }], correctAnswer: { type: String, required: true } }]
});
const Quiz = (0, mongoose_1.model)("Quiz", QuizSchema);
exports.Quiz = Quiz;
