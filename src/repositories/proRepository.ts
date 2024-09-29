import { Admin, User } from "../entities/user";
import { IProRepository } from "../providers/interface/pro/IProRepository";
import { UserModel } from "../model/userModel";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { date, string } from "yup";
import { AdminModel } from "../model/adminModel";
import { Pro } from "../entities/pro";
import { ProModel } from "../model/proModel";
import { BlogModel } from "../model/blogModel";
import { ConnectionModel } from "../model/connectionModel";
import { Blog } from "../entities/blog";
import { Connection } from "../entities/connection";
import { GroupVideo } from "../entities/Groupvideo";
import { GroupVideoModel } from "../model/groupVideoModel";
import { UserProfileModel } from "../model/useProfile";
import { CommunityModel } from "../model/communityModel";
import { Community } from "../entities/community";
import { ProPayment } from "../entities/proPayment";
import { PaymentProModel } from "../model/proPayment";
import { Wallet } from "../entities/wallet";
import { WalletModel } from "../model/wallet";
import { SaveBlogModel } from "../model/saveBlogs";
import { SaveBlog } from "../entities/SaveBlog";
import { Quizz } from "../entities/Quizz";
import { Quiz } from "../model/quizModel";

dotenv.config();

export class ProRepository implements IProRepository {
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
      const user = {
        fullname: fullname,
        Profession: Profession,
        subProfession: subProfession,
        working: working,
        achievements: achievements,
        country: country,
        about: about,
        imageUrl: imageUrl,
        email: email,
        Linkedin: Linkedin,
      };
      let data = await ProModel.create(user);
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  emailCheck = async (email: string): Promise<Pro | null> => {
    try {
      let data = await ProModel.findOne({ email });
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  verifyDoc = async (
    userId: string,
    isBlocked: boolean
  ): Promise<Pro | null> => {
    try {
      return await ProModel.findOneAndUpdate(
        { email: userId },
        { $set: { request: isBlocked } },
        { new: true }
      );
    } catch (error) {
      console.log("error", error);

      throw error;
    }
  };

  user = async (): Promise<Pro[] | null> => {
    const newuser = await ProModel.find();
    return newuser;
  };

  blogPost = async (
    about: string,
    image: string[],
    email: string
  ): Promise<Blog | null> => {
    try {
      const user = {
        about: about,
        image: image,
        email: email,
      };
      let data = await BlogModel.create(user);
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  Allblogs = async (): Promise<Blog[] | null> => {
    const newuser = await BlogModel.aggregate([
      {
        $lookup: {
          from: "pros",
          localField: "email",
          foreignField: "email",
          as: "authorDetails",
        },
      },
      {
        $unwind: {
          path: "$authorDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users", // Assuming your user collection is named "users"
          localField: "like",
          foreignField: "email",
          as: "likedByUsers",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$like" },
        },
      },
      {
        $sort: { _id: -1 }, // Sort by _id in descending order to reverse the order
      },
      {
        $project: {
          _id: 1,
          about: 1,
          image: 1,
          email: 1,
          block: 1,
          like: 1,
          createdAt: 1,
          updatedAt: 1,
          authorDetails: 1,
          likedByUsers: {
            _id: 1,
            email: 1,
            fullname: 1,
            // Add other user fields you want to include
          },
          likeCount: 1,
        },
      },
    ]);
    console.log(newuser);

    return newuser;
  };

  blogLike = async (
    blogId: string,
    userEmail: string,
    action: boolean
  ): Promise<Blog | null> => {
    try {
      const updateOperation = action
        ? { $pull: { like: userEmail } } // Remove email if already liked
        : { $addToSet: { like: userEmail } }; // Add email if not already liked

      const result = await BlogModel.findByIdAndUpdate(
        blogId,
        updateOperation,
        { new: true }
      );

      console.log("Updated blog:", result);
      return result;
    } catch (error) {
      console.error("Error adding email to like array:", error);
      throw error;
    }
  };

  blogSave = async (
    blogId: string,
    userId: string
  ): Promise<SaveBlog | null> => {
    try {
      const existingEntry = await SaveBlogModel.findOne({ userID: userId });
      console.log(existingEntry, "existingEntry");
      if (existingEntry) {
        const blogExists = existingEntry.blogId.includes(blogId);
        if (!blogExists) {
          existingEntry.blogId.push(blogId);
          await existingEntry.save();
          console.log("BlogId added.");
        } else {
          console.log("BlogId exist");
          return null;
        }
      } else {
        const newEntry = new SaveBlogModel({
          userID: userId,
          blogId: [blogId],
        });
        await newEntry.save();
        console.log("New document created with BlogId.");
        return newEntry;
      }
      return existingEntry;
    } catch (error) {
      console.error("Error adding email to like array:", error);
      throw error;
    }
  };

  getblogSave = async (id: string): Promise<SaveBlog | null> => {
    try {
      const existingEntry = await SaveBlogModel.findOne({
        userID: id,
      }).populate({
        path: "blogId", // The field in ConnectionModel that stores sender's userId
        model: BlogModel, // The model to populate from
        select: "about image _id like updatedAt block email", // Select only the fields you need from the UserModel
      });
      return existingEntry;
    } catch (error) {
      console.error("Error adding email to like array:", error);
      throw error;
    }
  };

  removeBlogSave = async (
    blogId: string,
    userId: string
  ): Promise<SaveBlog | null> => {
    try {
      const updatedDocument = await SaveBlogModel.findOneAndUpdate(
        { userID: userId }, // Find document by userID
        { $pull: { blogId: blogId } }, // Remove the specific blogId from the array
        { new: true } // Return the updated document
      );
      return updatedDocument;
    } catch (error) {
      console.error("Error adding email to like array:", error);
      throw error;
    }
  };

  connection = async (
    senterId: string,
    follow: string,
    receiverId: string
  ): Promise<Connection | null> => {
    try {
      const result = await ConnectionModel.findOneAndUpdate(
        { senterId, receiverId }, // Find the document where senterId and receiverId match
        { follow }, // Update the follow field
        { upsert: true, new: true, setDefaultsOnInsert: true } // Options to create if not found, return new document
      );
      return result;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  connectionFind = async (receiverId: string): Promise<Connection[] | null> => {
    try {
      let data = await ConnectionModel.find({
        receiverId: receiverId,
      }).populate({
        path: "senterId", // The field in ConnectionModel that stores sender's userId
        model: UserModel, // The model to populate from
        select: "fullname email role", // Select only the fields you need from the UserModel
      });
      // let data = await ConnectionModel.find({ receiverId });
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  connectionFindUser = async (
    senterId: string
  ): Promise<Connection[] | null> => {
    try {
      console.log(senterId);

      let data = await ConnectionModel.find({ senterId: senterId }).populate({
        path: "senterId", // The field in ConnectionModel that stores sender's userId
        model: UserModel, // The model to populate from
        select: "fullname email role", // Select only the fields you need from the UserModel
      });
      console.log(data);

      // let data = await ConnectionModel.find({ receiverId });
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  connectionFindPro = async (
    senterId: string
  ): Promise<Connection[] | null> => {
    try {
      console.log(senterId);

      let data = await ConnectionModel.find({ senterId: senterId }).populate({
        path: "receiverId", // The field in ConnectionModel that stores sender's userId
        model: ProModel, // The model to populate from
        select: "fullname email Profession", // Select only the fields you need from the UserModel
      });
      console.log(data);

      // let data = await ConnectionModel.find({ receiverId });
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  groupVideo = async (
    name: string,
    creator: string
  ): Promise<GroupVideo | null> => {
    try {
      const user = {
        name: name,
        creator: creator,
      };
      let data = await GroupVideoModel.create(user);

      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  groupVideoGet = async (): Promise<GroupVideo[] | null> => {
    try {
      let data = await GroupVideoModel.find({}).populate({
        path: "creator", // The field in ConnectionModel that stores sender's userId
        model: UserModel, // The model to populate from
        select: "fullname email role", // Select only the fields you need from the UserModel
      });
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  createCommunity = async (
    userId: string,
    description: string,
    ProfilePic: string
  ): Promise<Community | null> => {
    try {
      const user = {
        name: description,
        creator: userId,
        members: [],
        profilePic: ProfilePic,
      };
      const newCoversation = await CommunityModel.create(user);
      console.log(newCoversation);

      return newCoversation;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  totalCommunity = async (): Promise<Community[] | null> => {
    try {
      const coversation = await CommunityModel.find()
        .populate({
          path: "creator", // Path to populate
          select: "fullname email", // Fields to include
          model: UserModel, // The model to populate from
        })
        .exec();
      return coversation;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  communityReq = async (
    userId: string,
    communityId: string
  ): Promise<Community | null> => {
    try {
      const updatedCommunity = await CommunityModel.findByIdAndUpdate(
        communityId, // Find the community by its ID
        {
          $push: {
            members: { userId }, // Push new member to the members array
          },
        },
        { new: true, useFindAndModify: false } // Return the updated document
      ).exec();

      return updatedCommunity;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  CommunityUser = async (userId: string): Promise<Community | null> => {
    try {
      const updatedCommunity = await CommunityModel.findById(userId)
        .populate({
          path: "members.userId", // Path to populate
          select: "fullname email", // Fields to include
          model: UserModel, // The model to populate from
        })
        .exec();
      return updatedCommunity;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  statusUpdate = async (
    userId: string,
    communityId: string,
    status: string
  ): Promise<Community | null> => {
    try {
      const updatedCommunity = await CommunityModel.findOneAndUpdate(
        {
          _id: communityId,
          "members.userId": userId,
          "members.status": "pending",
        },
        {
          $set: { "members.$.status": status },
        },
        { new: true } // Optionally return the updated document
      );
      return updatedCommunity;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  groupCode = async (
    groupCode: string,
    communityId: string
  ): Promise<Community | null> => {
    try {
      const updatedCommunity = await CommunityModel.findOneAndUpdate(
        { _id: communityId },
        { $set: { groupCode: groupCode } }, // Update the groupCode field and updatedAt
        { new: true } // Optionally return the updated document
      );
      return updatedCommunity;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  proPayment = async (
    proId: string,
    name: string,
    userId: string
  ): Promise<ProPayment | null> => {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    try {
      let payment = await PaymentProModel.findOne({ proId, status: false });
      if (payment) {
        const userExists = payment.users.some((user) => user.userId === userId);

        if (!userExists) {
          payment.users.push({ userId, date: formattedDate });
          payment.amount += 500 * 0.9; // Increment the amount by 500
          await payment.save();
          console.log("User added to existing payment document.");
        } else {
          console.log("User already exists in the payment document.");
        }
      } else {
        payment = new PaymentProModel({
          proId,
          name: name, // You can change this to a relevant name
          users: [{ userId, date: formattedDate }],
          amount: 500 * 0.9, // Set the default amount, update if needed
          status: false, // You can change this as per your logic
        });
        await payment.save();
        console.log("New payment document created and user added.");
      }
      return payment;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  getWallet = async (id: string): Promise<Wallet[] | null> => {
    try {
      const updatedCommunity = await WalletModel.find({ proId: id }).sort({
        _id: -1,
      });
      return updatedCommunity;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  getProPaymentt = async (id: string): Promise<ProPayment[] | null> => {
    try {
      const updatedCommunity = await PaymentProModel.find({
        proId: id,
      }).populate({
        path: "users.userId", // Path to populate
        model: UserModel, // Use the model name as a string
        select: "fullname", // Specify which fields to include from the User model
      });
      return updatedCommunity;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  addQuizz = async (
    name: string,
    questions: string,
    communityId: string
  ): Promise<Quizz | null> => {
    try {
      const quiz = {
        name,
        questions,
        communityId,
      };
      const newQuiz = await Quiz.create(quiz);

      return newQuiz;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
}
