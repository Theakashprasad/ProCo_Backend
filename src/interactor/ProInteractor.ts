import { IProInteractor } from "../providers/interface/pro/IProInteractor";
import { IProRepository } from "../providers/interface/pro/IProRepository";
import dotenv from "dotenv";
import { Pro } from "../entities/pro";
import { Blog } from "../entities/blog";
import { Connection } from "../entities/connection";
import { GroupVideo } from "../entities/Groupvideo";
import { Community } from "../entities/community";
import { ProPayment } from "../entities/proPayment";
import { Wallet } from "../entities/wallet";
import { SaveBlog } from "../entities/SaveBlog";
import { Quizz } from "../entities/Quizz";

dotenv.config();

export class ProInteractor implements IProInteractor {
  private _repostitory: IProRepository;

  //_repostitory help to connect the iuser repository
  constructor(repository: IProRepository) {
    this._repostitory = repository;
  }

  verify = async (
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
  ): Promise<Pro> => {
    try {
      return await this._repostitory.verify(
        fullname,
        Profession,
        subProfession,
        working,
        achievements,
        country,
        about,
        imageUrl,
        email,
        Linkedin
      );
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  emailCheck = async (email: string): Promise<Pro | null> => {
    try {
      return await this._repostitory.emailCheck(email);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  verifyDoc = async (
    userId: string,
    isBlocked: boolean
  ): Promise<Pro | null> => {
    return await this._repostitory.verifyDoc(userId, isBlocked);
  };
  user = async (): Promise<Pro[] | null> => {
    return await this._repostitory.user();
  };

  blogPost = async (
    about: string,
    image: string[],
    email: string
  ): Promise<Blog | null> => {
    return await this._repostitory.blogPost(about, image, email);
  };

  Allblogs = async (): Promise<Blog[] | null> => {
    return await this._repostitory.Allblogs();
  };

  blogLike = async (
    blogId: string,
    userEmail: string,
    action: boolean
  ): Promise<Blog | null> => {
    return await this._repostitory.blogLike(blogId, userEmail, action);
  };

  blogSave = async (
    blogId: string,
    userId: string
  ): Promise<SaveBlog | null> => {
    return await this._repostitory.blogSave(blogId, userId);
  };

  getblogSave = async (id: string): Promise<SaveBlog | null> => {
    return await this._repostitory.getblogSave(id);
  };

  removeBlogSave = async (
    blogId: string,
    userId: string
  ): Promise<SaveBlog | null> => {
    return await this._repostitory.removeBlogSave(blogId, userId);
  };

  connection = async (
    senterId: string,
    folllow: string,
    receiverId: string
  ): Promise<Connection | null> => {
    return await this._repostitory.connection(senterId, folllow, receiverId);
  };

  connectionFind = async (receiverId: string): Promise<Connection[] | null> => {
    return await this._repostitory.connectionFind(receiverId);
  };

  connectionFindUser = async (
    senterId: string
  ): Promise<Connection[] | null> => {
    return await this._repostitory.connectionFindUser(senterId);
  };

  connectionFindPro = async (
    senterId: string
  ): Promise<Connection[] | null> => {
    return await this._repostitory.connectionFindPro(senterId);
  };

  groupVideo = async (
    name: string,
    creator: string
  ): Promise<GroupVideo | null> => {
    return await this._repostitory.groupVideo(name, creator);
  };

  groupVideoGet = async (): Promise<GroupVideo[] | null> => {
    return await this._repostitory.groupVideoGet();
  };

  createCommunity = async (
    userId: string,
    description: string,
    ProfilePic: string
  ): Promise<Community | null> => {
    return await this._repostitory.createCommunity(
      userId,
      description,
      ProfilePic
    );
  };

  totalCommunity = async (): Promise<Community[] | null> => {
    return await this._repostitory.totalCommunity();
  };

  communityReq = async (
    userId: string,
    communityId: string
  ): Promise<Community | null> => {
    return await this._repostitory.communityReq(userId, communityId);
  };

  CommunityUser = async (userId: string): Promise<Community | null> => {
    return await this._repostitory.CommunityUser(userId);
  };

  statusUpdate = async (
    userId: string,
    communityId: string,
    status: string
  ): Promise<Community | null> => {
    return await this._repostitory.statusUpdate(userId, communityId, status);
  };

  groupCode = async (
    groupCode: string,
    communityId: string
  ): Promise<Community | null> => {
    return await this._repostitory.groupCode(groupCode, communityId);
  };

  proPayment = async (
    proId: string,
    name: string,
    userId: string
  ): Promise<ProPayment | null> => {
    return await this._repostitory.proPayment(proId, name, userId);
  };

  getWallet = async (id: string): Promise<Wallet[] | null> => {
    return await this._repostitory.getWallet(id);
  };

  getProPaymentt = async (id: string): Promise<ProPayment[] | null> => {
    return await this._repostitory.getProPaymentt(id);
  };
  
  addQuizz = async (name: string, questions: string, communityId: string): Promise<Quizz | null> => {
    return await this._repostitory.addQuizz(name, questions, communityId);
  };
}
