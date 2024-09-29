import mongoose, { Schema, model, Document, Types } from 'mongoose';

interface IToDo extends Document {
    text: string;
    status: boolean;
    completedOn: string;
    userId: string;
}

const ToDoSchema = new Schema<IToDo>({
  text: { type: String},
  status: { type: Boolean},
  completedOn:{type:String},
  userId:{type:String}
},{   timestamps: true}
);

export const ToDoModel = mongoose.model<IToDo>('Todo', ToDoSchema);

