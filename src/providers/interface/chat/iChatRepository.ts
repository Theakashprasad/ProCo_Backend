import { IMessage } from '../../../model/newMessage';
import { Types } from 'mongoose';

interface MessageRepository {
  createMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, messageText: string): Promise<IMessage>;
  createImageMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, image: string): Promise<IMessage>;
  getMessagesByChatId(chatId: Types.ObjectId): Promise<IMessage[]>;
  markAsRead(chatId:Types.ObjectId, userId:Types.ObjectId):Promise<IMessage[]>
}

export default MessageRepository;