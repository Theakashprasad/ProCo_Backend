import MessageRepository from '../repositories/messageRepository';
import { IMessage } from '../model/newMessage';
import { Types } from 'mongoose';

class MessageService {
  private messageRepository: MessageRepository;

  constructor(messageRepository: MessageRepository) {
    this.messageRepository = messageRepository;
  }

  async createMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, messageText: string): Promise<IMessage> {
    return this.messageRepository.createMessage(chatId, senderId, messageText);
  }

  async createImageMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, image: string): Promise<IMessage> {
    return this.messageRepository.createImageMessage(chatId, senderId, image);
  }

  async getMessagesByChatId(chatId: Types.ObjectId): Promise<IMessage[]> {
    console.log('getMessagesByChatId, service')
    return this.messageRepository.getMessagesByChatId(chatId);
  }

  async markAsRead(chatId:Types.ObjectId, userId:Types.ObjectId):Promise<IMessage[]>{
    return this.messageRepository.markAsRead(chatId, userId)
  }

}

export default MessageService;