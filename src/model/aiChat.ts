import mongoose ,{Schema,Document} from 'mongoose'

interface Message {
  role: string;
  text: string;
}

export interface ChatDocument extends Document{
  userId: string;
  chatHistory: string[];
}

const ChatSchema:Schema<ChatDocument>=new Schema({
  userId:{type:String},    
  chatHistory: [{
    role: { type: String, required: true },
    text: { type: String, required: true }
  }]

},{timestamps: true})
 
export const ChatAiModel=mongoose.model<ChatDocument>('chatAi',ChatSchema)

