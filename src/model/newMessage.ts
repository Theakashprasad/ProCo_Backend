import { Schema, model, Document, Types } from 'mongoose';

interface IMessage extends Document {
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  messageText: string;
  createdAt: Date;
  readAt:Date;
  image:string
}

const MessageSchema = new Schema<IMessage>({
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messageText: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  readAt:{type:Date, default:null},
  image:{type:String, required:false}
});

const Message = model<IMessage>('Message', MessageSchema);

export { Message, IMessage };