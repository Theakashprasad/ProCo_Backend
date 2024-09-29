// import { Subscription, WebsiteSubscriptionUser, channelSubscription } from "../../entities/Subscription";
// import { User, googleUser } from "../../entities/User";
import { ChatAi } from "../../../entities/chatAi";
import { Payment } from "../../../entities/payment";
import { Profile } from "../../../entities/profile";
import { Question } from "../../../entities/question";
import { Todo } from "../../../entities/toDo";
import { Admin, User } from "../../../entities/user";

export interface IUserRepository {
  findByOne(email: string): Promise<User | null>;
  user(): Promise<User[] | null>;
  // sendMail(email: string): Promise<string>;
  create(
    fullname: string,
    email: string, 
    password: string,
    otp: number,
    isVerified: boolean,
    role: string
  ): Promise<User>;

  verifiedOtp(email: string, isVerified: boolean): Promise<User | null>;

  block(userId: string, action: boolean): Promise<User | null>;

  adminLogin(email: string, password: string): Promise<Admin | null>;

  resentOtp(email: string, otp: number): Promise<User | null>;

  restPassword(email: string, password: string): Promise<User | null>;

  payment( email: string): Promise<User|null>

  userProfile(
    email: string,
    profession: string,
    gender: string,
    education: string,
    age: string,
    hobbies:string,
    Interest:string,
    country:string,
    linkedin:string,
    state:string,
    about: string,
    imageUrl: string,
  ): Promise<Profile>;

   
  userData(
  email: string
 ): Promise<Profile|null> ;

 ChatAi(userId:string, chatHistory: string[]): Promise<ChatAi | null>;

 ShowChatAi(userId:string,): Promise<ChatAi | null>;

 ChatAiDelete(userId:string,): Promise<ChatAi | null>;

 userById(userId:string,): Promise<User | null>;

 checkPassword(userId: string ): Promise<User | null>;

 addQuestions(question: string, name:string, communityId:string): Promise<Question | null>;

 GetQuestions(communityId: string): Promise<Question[] | null>;

 addAnswers(answer: string, userId: string, questionId:string ): Promise<Question | null>;

 userProfileData(userId: string): Promise<Profile | null>;

 toDoPost(text: string, userId: string): Promise<Todo | null>;

 todos( userId: string): Promise<Todo[] | null>;

 completedtodos( userId: string): Promise<Todo[] | null>;

 completedtodosPost( userId: string): Promise<Todo | null>;

 todoDel( userId: string): Promise<Todo | null>;

 completedtodoDel( userId: string): Promise<Todo | null>;

 addPayment( userId: string): Promise<Payment | null>;


}
