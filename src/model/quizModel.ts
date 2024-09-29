import { Schema, model, Document, Types, ObjectId } from "mongoose";

interface IQuizOtpion {
  option: string
}

interface IQuizQuestion {
  question: string
  options: IQuizOtpion[]
  correctAnswer: string
}

interface IQuiz extends Document {
  name: string;
  communityId:string,
  questions: IQuizQuestion[]
}

const QuizSchema = new Schema<IQuiz>({
  name: { type: String, required: true },
  communityId: { type: String },
  questions: [{ question: { type: String, required: true }, options: [{ option: { type: String, required: true }, }], correctAnswer:{type:String, required:true} }]
});

const Quiz = model<IQuiz>("Quiz", QuizSchema);

export { IQuiz, Quiz }; 