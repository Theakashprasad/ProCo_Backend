import { Admin, User } from "../entities/user";
import { IUserRepository } from "../providers/interface/user/IUserRepository";
import { UserModel } from "../model/userModel";
import dotenv from "dotenv";
import { AdminModel } from "../model/adminModel";
import { Profile } from "../entities/profile";
import { UserProfileModel } from "../model/useProfile";
import { ChatAi } from "../entities/chatAi";
import { ChatAiModel } from "../model/aiChat";
import { QuestionModel } from "../model/questionModel";
import { Question } from "../entities/question";
import { Todo } from "../entities/toDo";
import { ToDoModel } from "../model/toModel";
import { Payment } from "../entities/payment";
import { PaymentModel } from "../model/payment";

dotenv.config();

export class UserRepository implements IUserRepository {
  create = async (
    fullname: string,
    email: string,
    password: string,
    otp: number,
    isVerified: boolean,
    role: string
  ): Promise<User> => {
    try {
      const user = {
        fullname: fullname,
        email: email,
        password: password,
        otp: otp,
        isVerified: isVerified,
        role: role,
      };
      const newuser = await UserModel.create(user);
      console.log(newuser, "created");
      return newuser;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  findByOne = async (email: string): Promise<User | null> => {
    const newuser = await UserModel.findOne({ email });
    return newuser;
  };

  verifiedOtp = async (
    email: string,
    isVerified: boolean
  ): Promise<User | null> => {
    const newuser = await UserModel.findOneAndUpdate(
      { email },
      {
        $set: { isVerified: true },
      },
      { new: true } // Return the updated document
    );
    return newuser;
  };

  user = async (): Promise<User[] | null> => {
    const newuser = await UserModel.find();
    return newuser;
  };

  block = async (userId: string, isBlocked: boolean): Promise<User | null> => {
    return await UserModel.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    );
  };

  adminLogin = async (
    email: string,
    password: string
  ): Promise<Admin | null> => {
    try {
      return await AdminModel.findOne({ email });
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  resentOtp = async (email: string, otp: number): Promise<User | null> => {
    try {
      const newuser = await UserModel.findOneAndUpdate(
        { email },
        {
          $set: { otp: otp },
        },
        { new: true } // Return the updated document
      );
      return newuser;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  restPassword = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const newuser = await UserModel.findOneAndUpdate(
        { email },
        {
          $set: { password: password },
        },
        { new: true } // Return the updated document
      );
      return newuser;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  payment = async (email: string): Promise<User | null> => {
    try {
      const newuser = await UserModel.findOneAndUpdate(
        { email },
        {
          $set: { payment: true, paymentDate: new Date() },
        },
        { new: true } // Return the updated document
      );
      return newuser;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
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
      const user = {
        email: email,
        profession: profession,
        gender: gender,
        education: education,
        hobbies: hobbies,
        Interest: Interest,
        country: country,
        Linkedin: linkedin,
        state: state,
        age: age,
        about: about,
        imageUrl: imageUrl,
      };
      await UserProfileModel.updateOne(
        { email: email }, // Filter
        { $set: user }, // Update data
        { upsert: true } // Create new document if no match is found
      );

      // Fetch and return the updated or newly created document
      const updatedUser = await UserProfileModel.findOne({ email: email })
        .lean()
        .exec();
      if (!updatedUser) {
        throw new Error("Failed to retrieve the updated user profile.");
      }

      return updatedUser as unknown as Profile;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  userData = async (email: string): Promise<Profile | null> => {
    try {
      let data = await UserProfileModel.findOne({ email });
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  ChatAi = async (
    userId: string,
    chatHistory: string[]
  ): Promise<ChatAi | null> => {
    try {
      const newMessage = await ChatAiModel.findOneAndUpdate(
        { userId }, // Filter to find by userId
        { chatHistory }, // Update the chatHistory by appending new messages
        { new: true, upsert: true } // Create if not found, and return the updated document
      );
      return newMessage;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  ShowChatAi = async (userId: string): Promise<ChatAi | null> => {
    try {
      const newMessage = await ChatAiModel.findOne({ userId });
      return newMessage;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  ChatAiDelete = async (userId: string): Promise<ChatAi | null> => {
    try {
      const deletedChat = await ChatAiModel.findOneAndDelete({ userId });
      return deletedChat;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  userById = async (userId: string): Promise<User | null> => {
    try {
      const data = await UserModel.findById(userId);
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  checkPassword = async (userId: string): Promise<User | null> => {
    try {
      const data = await UserModel.findById(userId);
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  addQuestions = async (
    question: string,
    name: string,
    communityId: string
  ): Promise<Question | null> => {
    try {
      const data = await QuestionModel.create({
        question: question,
        name: name,
        communityId: communityId
      });
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  GetQuestions = async (communityId: string): Promise<Question[] | null> => {
    try {
      const data = await QuestionModel.find({communityId})
        .populate({
          path: "answers.userId", // Path to populate
          model: UserModel, // Use the model name as a string
          select: "fullname", // Specify which fields to include from the User model
        })
        .exec(); // Execute the query

      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  addAnswers = async (
    answer: string,
    userId: string,
    questionId: string
  ): Promise<Question | null> => {
    try {
      const updatedQuestion = await QuestionModel.findByIdAndUpdate(
        questionId,
        {
          $push: {
            answers: { userId, content: answer },
          },
        },
        { new: true } // Return the updated document
      );
      return updatedQuestion;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  userProfileData = async (userId: string): Promise<Profile | null> => {
    try {
      console.log(userId);

      const data = await UserModel.findById(userId);
      let val = await UserProfileModel.findOne({ email: data?.email });
      return val;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  toDoPost = async (text: string, userId: string): Promise<Todo | null> => {
    try {
      console.log(userId);
      const newTodo = {
        text,
        userId,
        status: false,
      };
      const savedTodo = await ToDoModel.create(newTodo);
      // const savedTodo = await newTodo.save();
      return savedTodo;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  todos = async (userId: string): Promise<Todo[] | null> => {
    try {
      console.log(userId);
      const todos = await ToDoModel.find({ userId, status: false }).sort({ _id: -1 });
      return todos;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  completedtodos = async (userId: string): Promise<Todo[] | null> => {
    try {
      console.log(userId);
      const todos = await ToDoModel.find({ userId, status: true });
      return todos;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  completedtodosPost = async (userId: string): Promise<Todo | null> => {
    try {
      const data = await ToDoModel.findByIdAndUpdate(
        userId,
        { status: true, updatedAt: new Date() },
        { new: true }
      );
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  todoDel = async (userId: string): Promise<Todo | null> => {
    try {
      const data = await ToDoModel.findByIdAndDelete(userId);
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  completedtodoDel = async (userId: string): Promise<Todo | null> => {
    try {
      const data = await ToDoModel.findByIdAndDelete(userId);
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  addPayment = async (userId: string): Promise<Payment | null> => {
    try {
      const data = await PaymentModel.create({userId});
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

}
