import { Blog } from "../../../entities/blog";
import { Community } from "../../../entities/community";
import { Connection } from "../../../entities/connection";
import { GroupVideo } from "../../../entities/Groupvideo";
import { Pro } from "../../../entities/pro";
import { ProPayment } from "../../../entities/proPayment";
import { Quizz } from "../../../entities/Quizz";
import { SaveBlog } from "../../../entities/SaveBlog";
import { Wallet } from "../../../entities/wallet";

export interface IProInteractor {
  verify(
    fullname: string,
    Profession: string,
    subProfession: string,
    working: string,
    achievements: string,
    country: string,
    about: string,
    imageUrl: string,
    email: string,
    Linkedin: string
  ): Promise<Pro>;

  emailCheck(email: string): Promise<Pro | null>;

  verifyDoc(userId: string, isBlocked: boolean): Promise<Pro | null>;

  user(): Promise<Pro[] | null>;

  blogPost(about: string, image: string[], email: string): Promise<Blog | null>;

  Allblogs(): Promise<Blog[] | null>;

  blogLike(
    blogId: string,
    userEmail: string,
    action: boolean
  ): Promise<Blog | null>;

  blogSave(blogId: string, userId: string): Promise<SaveBlog | null>;

  getblogSave(id: string): Promise<SaveBlog | null>;

  removeBlogSave(blogId: string, userId: string): Promise<SaveBlog | null>;

  connection(
    senterId: string,
    follow: string,
    receiverId: string
  ): Promise<Connection | null>;

  connectionFind(receiverId: string): Promise<Connection[] | null>;

  connectionFindUser(senterId: string): Promise<Connection[] | null>;

  connectionFindPro(senterId: string): Promise<Connection[] | null>;

  groupVideo(name: string, creator: string): Promise<GroupVideo | null>;

  groupVideoGet(): Promise<GroupVideo[] | null>;

  createCommunity(
    userId: string,
    description: string,
    ProfilePic: string
  ): Promise<Community | null>;

  totalCommunity(): Promise<Community[] | null>;

  communityReq(userId: string, communityId: string): Promise<Community | null>;

  CommunityUser(userId: string): Promise<Community | null>;

  statusUpdate(
    userId: string,
    communityId: string,
    status: string
  ): Promise<Community | null>;

  groupCode(groupCode: string, communityId: string): Promise<Community | null>;

  proPayment(
    proId: string,
    name: string,
    userId: string
  ): Promise<ProPayment | null>;

  getWallet(id: string): Promise<Wallet[] | null>;

  getProPaymentt(id: string): Promise<ProPayment[] | null>;

  addQuizz(name: string, questions: string, communityId: string): Promise<Quizz | null>;
}
