import { Message, IMessage } from '../model/newMessage';
import MessageRepository from '../providers/interface/chat/iChatRepository';
import { Types } from 'mongoose';

class MessageRepositoryImplementation implements MessageRepository {
  async createMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, messageText: string): Promise<IMessage> {
    console.log('createMessage impl')
    const newMessage = await Message.create({ chatId, senderId, messageText });
    return newMessage;
  }

  async createImageMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, image: string): Promise<IMessage> {
    console.log('createMessage impl')
    const newMessage = await Message.create({ chatId, senderId, image });
    return newMessage;
  }

  async getMessagesByChatId(chatId: Types.ObjectId): Promise<IMessage[]> {
    console.log('getMessagesByChatId imple')
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    console.log(messages,'messages')
    return messages;
  }

  async markAsRead(chatId: Types.ObjectId, userId: Types.ObjectId): Promise<IMessage[]> {
    const messages = await Message.find({ chatId, receiverId: userId, isRead: false });
    await Message.updateMany(
      { chatId, receiverId: userId, readAt: null },
      { $set: { readAt: new Date() } }
    );
    return messages;
  }

}

export default MessageRepositoryImplementation;