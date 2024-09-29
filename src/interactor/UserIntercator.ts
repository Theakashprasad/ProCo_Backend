import { Admin, User } from "../entities/user";
import { IUserInteractor } from "../providers/interface/user/IUserInteractor";
import { IUserRepository } from "../providers/interface/user/IUserRepository";
import dotenv from "dotenv";
import { Profile } from "../entities/profile";
import { ChatAi } from "../entities/chatAi";
import { Question } from "../entities/question";
import { Todo } from "../entities/toDo";
import { Payment } from "../entities/payment";

dotenv.config();

export class UserInteractor implements IUserInteractor {
  private _repostitory: IUserRepository;

  //_repostitory help to connect the iuser repository
  constructor(repository: IUserRepository) {
    this._repostitory = repository;
  }

  signup = async (
    fullname: string,
    email: string,
    password: string,
    otp: number,
    isVerified: boolean,
    role: string
  ): Promise<User> => {
    try {
      return await this._repostitory.create(
        fullname,
        email,
        password,
        otp,
        isVerified,
        role
      );
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  login = async (email: string): Promise<User | null> => {
    try {
      let data = await this._repostitory.findByOne(email);
      return data;
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  };

  verifiedOtp = async (
    email: string,
    isVerified: boolean
  ): Promise<User | null> => {
    try {
      return await this._repostitory.verifiedOtp(email, isVerified);
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  };

  user = async (): Promise<User[] | null> => {
    return await this._repostitory.user();
  };

  block = async (userId: string, isBlocked: boolean): Promise<User | null> => {
    return await this._repostitory.block(userId, isBlocked);
  };

  adminLogin = async (
    email: string,
    password: string
  ): Promise<Admin | null> => {
    return await this._repostitory.adminLogin(email, password);
  };
  
  resentOtp = async (email: string, otp: number): Promise<User | null> => {
    return await this._repostitory.resentOtp(email, otp);
  };
  restPassword = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    return await this._repostitory.restPassword(email, password);
  };
  payment = async (email: string): Promise<User | null> => {
    return await this._repostitory.payment(email);
  };

  userProfile = async (
    email: string,
    profession: string,
    gender: string,
    education: string,
    age: string,
    hobbies: string,
    Interest: string,
    country: string,
    linkedin: string,
    state: string,
    about: string,
    imageUrl: string
  ): Promise<Profile> => {
    try {
      return await this._repostitory.userProfile(
        email,
        profession,
        gender,
        education,
        age,
        hobbies,
        Interest,
        country,
        linkedin,
        state,
        about,
        imageUrl
      );
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  userData = async (email: string): Promise<Profile | null> => {
    try {
      return await this._repostitory.userData(email);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };
  
  ChatAi = async ( userId : string, chatHistory: string[] ): Promise<ChatAi | null> => {
    try {
      return await this._repostitory.ChatAi(userId, chatHistory);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };
  
  ShowChatAi = async (userId : string): Promise<ChatAi | null> => {
    try {
      return await this._repostitory.ShowChatAi(userId);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };
  
  ChatAiDelete = async (userId : string): Promise<ChatAi | null> => {
    try {
      return await this._repostitory.ChatAiDelete(userId);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  userById = async (userId : string): Promise<User | null> => {
    try {
      return await this._repostitory.userById(userId);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  checkPassword = async (userId : string): Promise<User | null> => {
    try {
      return await this._repostitory.checkPassword(userId );
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  addQuestions = async (question : string, name:string, communityId:string): Promise<Question | null> => {
    try {
      return await this._repostitory.addQuestions( question, name, communityId );
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  GetQuestions = async (communityId: string): Promise<Question[] | null> => {
    try {
      return await this._repostitory.GetQuestions(communityId);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  
  addAnswers = async (answer: string, userId: string, questionId:string): Promise<Question | null> => {
    try {
      return await this._repostitory.addAnswers( answer, userId, questionId );
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  
  userProfileData = async (userId: string): Promise<Profile | null> => {
    try {
      return await this._repostitory.userProfileData(userId);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  toDoPost = async (text: string, userId: string): Promise<Todo | null> => {
    try {
      return await this._repostitory.toDoPost(text, userId);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  todos = async ( userId: string): Promise<Todo[] | null> => {
    try {
      return await this._repostitory.todos( userId);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  completedtodos = async ( userId: string): Promise<Todo[] | null> => {
    try {
      return await this._repostitory.completedtodos( userId);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };
  
  completedtodosPost = async ( userId: string): Promise<Todo | null> => {
    try {
      return await this._repostitory.completedtodosPost( userId);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };
  
  todoDel = async ( userId: string): Promise<Todo | null> => {
    try {
      return await this._repostitory.todoDel( userId );
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  completedtodoDel = async ( userId: string): Promise<Todo | null> => {
    try {
      return await this._repostitory.completedtodoDel( userId );
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  addPayment = async ( userId: string): Promise<Payment | null> => {
    try {
      return await this._repostitory.addPayment( userId );
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

}
