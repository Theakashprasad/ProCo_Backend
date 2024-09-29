import { Response, Request, NextFunction } from "express";
import { User } from "../../entities/user";
import { IProInteractor } from "../../providers/interface/pro/IProInteractor";
import dotenv from "dotenv";
import MailService from "../../shared/utils/DirectMail";

dotenv.config();
//set enum for each reponse message
enum ResponseStatus {
  OK = 200,
  Created = 201,
  Accepted = 202,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
}

export class ProController {
  private _interactor: IProInteractor;

  //the interactor help to access the user interface repository
  constructor(interactor: IProInteractor) {
    this._interactor = interactor;
  }

  //signup fucntionalities and call the interactor
  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        fullname,
        Profession,
        subProfession,
        working,
        achievements,
        country,
        about,
        email,
        Linkedin,
      } = req.body;
      const fileData = req.file as any;
      const imageUrl = fileData.location;
      const data = await this._interactor.verify(
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
      if (!data) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "something went wrong" });
      }
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  emailCheck = async (req: Request, res: Response, next: NextFunction) => {
    let { email } = req.body;

    try {
      const existingUser = await this._interactor.emailCheck(email);
      if (!existingUser) {
        return res.status(ResponseStatus.OK).json({ success: false });
      }
      return res
        .status(ResponseStatus.OK)
        .json({ success: true, data: existingUser });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  verifyDoc = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, action } = req.params;
      const isBlocked = action === "true";

      const response = await this._interactor.verifyDoc(userId, isBlocked);
      if (response) {
        const mailService = new MailService();
        mailService
          .sendMail({
            email: "akashprasadyt123@gmail.com",
            subject: "Access Request",
            text: "http://localhost:3000/login",
          })
          .catch((error) => {
            console.error("Failed to send email:", error);
          });
        return res.status(200).json({ success: true });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  user = async (req: Request, res: Response, next: NextFunction) => {
    const response = this._interactor.user();
    response
      .then((val) => {
        return res.status(200).json({ data: val, success: true });
      })
      .catch((error) => {
        return res.status(ResponseStatus.BadRequest).json(error);
      });
  };

  proDoc = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.params.email;
    console.log("email", email);

    try {
      const existingUser = await this._interactor.emailCheck(email);
      console.log(existingUser);
      if (existingUser)
        return res.status(200).json({ data: existingUser, success: true });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  blogPost = async (req: Request, res: Response, next: NextFunction) => {
    const { email, about } = req.body;
    const fileData = req.files as any;
    console.log("fileData", fileData);

    const image = fileData["cropped_image"].map(
      (image: { location: string }) => image.location
    );
    console.log("imageData", image);

    // const image = fileData.location;
    // console.log('fileData', image);

    try {
      const existingUser = await this._interactor.blogPost(about, image, email);
      if (!existingUser)
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      return res.status(200).json({ data: existingUser, success: true });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  Allblogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingUser = await this._interactor.Allblogs();
      if (existingUser)
        return res.status(200).json({ data: existingUser, success: true });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  blogSave = async (req: Request, res: Response, next: NextFunction) => {
    const { blogId, userId } = req.body;
    console.log("object", blogId);
    try {
      const existingUser = await this._interactor.blogSave(blogId, userId);
      if (existingUser)
        return res.status(200).json({ data: existingUser, success: true });
      else return res.status(200).json({ success: false });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  getblogSave = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const existingUser = await this._interactor.getblogSave(id);
      console.log("asdfasdf", existingUser);
      if (existingUser)
        return res.status(200).json({ data: existingUser, success: true });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  removeBlogSave = async (req: Request, res: Response, next: NextFunction) => {
    const { blogId, userId } = req.params;
    try {
      const existingUser = await this._interactor.removeBlogSave(
        blogId,
        userId
      );
      console.log("existingUser", existingUser);
      if (existingUser) {
        return res.status(200).json({ data: existingUser, success: true });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  blogLike = async (req: Request, res: Response, next: NextFunction) => {
    const { blogId, userEmail, action } = req.body;
    console.log("email", req.body);

    try {
      const existingUser = await this._interactor.blogLike(
        blogId,
        userEmail,
        action
      );
      if (existingUser)
        return res.status(200).json({ data: existingUser, success: true });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  connection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { senterId, follow, receiverId } = req.params;
      console.log("req.params", req.params);

      const response = await this._interactor.connection(
        senterId,
        follow,
        receiverId
      );
      console.log("response", response);

      if (response) {
        return res.status(200).json({ success: true });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  connectionFind = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { receiverId } = req.params;
      console.log(req.params);

      const response = await this._interactor.connectionFind(receiverId);
      console.log("response", response);

      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  connectionFindUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { senterId } = req.params;
      console.log("senterId", senterId);

      const response = await this._interactor.connectionFindUser(senterId);
      console.log("response", response);

      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  connectionFindPro = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { senterId } = req.params;
      console.log("senterId", senterId);

      const response = await this._interactor.connectionFindPro(senterId);
      console.log("response", response);

      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  groupVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, creator } = req.body;
      console.log(req.body);

      const response = await this._interactor.groupVideo(name, creator);
      console.log("response", response);

      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  groupVideoGet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this._interactor.groupVideoGet();
      console.log("response", response);

      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  createCommunity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { creator, name } = req.body;
      console.log(req.body);

      const ProfilePic = "https://avatar.iran.liara.run/public/boy";
      const response = await this._interactor.createCommunity(
        creator,
        name,
        ProfilePic
      );
      console.log("response", response);

      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  totalCommunity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this._interactor.totalCommunity();
      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  communityReq = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, communityId } = req.body;
      console.log(req.body);

      const response = await this._interactor.communityReq(userId, communityId);
      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  CommunityUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const response = await this._interactor.CommunityUser(userId);
      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  statusUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, communityId, status } = req.body;
      const response = await this._interactor.statusUpdate(
        userId,
        communityId,
        status
      );
      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  groupCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { groupCode, communityId } = req.body;
      console.log("assss", req.body);

      const response = await this._interactor.groupCode(groupCode, communityId);
      console.log("response", response);
      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  proPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { proId, name, userId } = req.body;
      const response = await this._interactor.proPayment(proId, name, userId);
      console.log("response", response);
      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  getWallet = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const response = await this._interactor.getWallet(id);
      console.log("response", response);
      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  getProPaymentt = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const response = await this._interactor.getProPaymentt(id);
      console.log("response", response);
      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };


  addQuizz = async (req: Request, res: Response, next: NextFunction) => {
    const { name, questions, communityId } = req.body;
    try {
      const response = await this._interactor.addQuizz(name, questions, communityId);
      console.log("response", response);
      if (response) {
        return res.status(200).json({ success: true, data: response });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "cannot proced", success: false });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };
}
