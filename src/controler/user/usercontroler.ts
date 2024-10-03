import { Response, Request, NextFunction } from "express";
import { IUserInteractor } from "../../providers/interface/user/IUserInteractor";
import dotenv from "dotenv";
import { User } from "../../entities/user";
import { HashUtils } from "../../shared/utils/HashUtils";
import { SendMail } from "../../shared/utils/MailUtils";
import { UserModel } from "../../model/userModel";
import { JwtUtils } from "../../shared/utils/JwtUtils";
import { userPayment } from "../../shared/utils/userPayment";
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

export class UserController {
  private _interactor: IUserInteractor;
  private userdatas!: User;

  //the interactor help to access the user interface repository
  constructor(interactor: IUserInteractor) {
    this._interactor = interactor;
  }

  //signup fucntionalities and call the interactor
  //SIGN UP
  onSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "No User Data Provided" });
      }

      const { fullname, email, password, role } = req.body;

      let NewEmail = email.toLowerCase();

      const hashedPassword = await HashUtils.hashPassword(password);

      const existingUser = await this._interactor.login(NewEmail);
      if (existingUser) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "email Already exist" });
      }

      const generateRandomString = (): number => {
        return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
      };
      const otp = generateRandomString();

      const mailer = SendMail.sendmail(email, otp);

      const data = await this._interactor.signup(
        fullname,
        email,
        hashedPassword,
        otp,
        false,
        role
      );

      return res.status(ResponseStatus.OK).json({ message: `Check ${email}` });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  //OTP
  otp = async (req: Request, res: Response, next: NextFunction) => {
    const { storedEmail, otp } = req.body;
    try {
      const response = this._interactor.login(storedEmail);
      response
        .then((val) => {
          if (val?.otp == otp) {
            this._interactor.verifiedOtp(storedEmail, true);
            return res
              .status(ResponseStatus.OK)
              .json({ message: `Check ${storedEmail}`, success: true });
          } else {
            return res
              .status(ResponseStatus.BadRequest)
              .json({ message: "WRONG OPT", success: false });
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  //LOGIN
  login = async (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;
    try {
      console.log("login in page");
      const response = await this._interactor.login(email);
      if (!response) {
        return res
          .status(ResponseStatus.NotFound)
          .json({ message: "EMAIL NOT FOUND", success: false });
      } else {
        const comparePassword = await HashUtils.comparePassword(
          password,
          response.password
        );
        if (!comparePassword) {
          return res
            .status(ResponseStatus.NotFound)
            .json({ message: "WRONG PASSWORD", success: false });
        } else if (response.isBlocked) {
          return res
            .status(ResponseStatus.NotFound)
            .json({ message: "YOU HAVE BLOCKED", success: false });
        } else if (!response.isVerified) {
          return res
            .status(ResponseStatus.NotFound)
            .json({ message: "USER DOES NOT EXIST", success: false });
        } else {
          console.log("SUCCES");
          const JWTtoken = await JwtUtils.generateToken(response);
          const expiryDate = new Date(Date.now() + 3600000); // 1 hour
          if (response?.role == "user") {
            userPayment.userPaymentCheck(response);
          }
          return res.cookie('access_token', JWTtoken, {
            expires: expiryDate,
            httpOnly: true, // Ensures it’s not accessible via JS
            secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
          }).status(200).json({ data: response, success: true ,token: JWTtoken}); 
          
        }
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
      .catch((error) => console.log(error));
  };

  block = async (req: Request, res: Response, next: NextFunction) => {
    console.log("s");

    const { userId, action } = req.params;

    console.log(typeof userId);

    const isBlocked = action === "block";

    const response = await this._interactor.block(userId, isBlocked);
    if (response) {
      console.log(response);

      return res.status(200).json({ success: true });
    } else {
      return res
        .status(ResponseStatus.BadRequest)
        .json({ message: "cannot proced", success: false });
    }
  };

  adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log(req.body);

    const response = await this._interactor.adminLogin(email, password);
    if (response) {
      if (response.password != password) {
        console.log("a");
        return res.status(401).json({
          success: false,
          message: "Invalid password.",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Login succes",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
  };

  resentOtp = async (req: Request, res: Response, next: NextFunction) => {
    const { storedEmail } = req.body;
    try {
      const generateRandomString = (): number => {
        return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
      };
      const otp = generateRandomString();
      console.log("Generated OTP is ", otp);
      const mailer = SendMail.sendmail(storedEmail, otp);
      const response = await this._interactor.resentOtp(storedEmail, otp);
      if (response) {
        return res.status(200).json({
          success: true,
          message: "OTP succes",
        });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const existingUser = await this._interactor.login(email);
    if (existingUser) {
      const generateRandomString = (): number => {
        return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
      };
      const otp = generateRandomString();
      console.log("Generated OTP is ", otp);

      const mailer = SendMail.sendmail(email, otp);
      const response = await this._interactor.resentOtp(email, otp);

      return res.status(ResponseStatus.OK).json({ message: "email exist" });
    }
    return res
      .status(ResponseStatus.BadRequest)
      .json({ message: "email does not exist" });
  };

  restPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { password, storedEmail } = req.body;
    console.log(req.body);

    const hashedPassword = await HashUtils.hashPassword(password);
    const existingUser = await this._interactor.restPassword(
      storedEmail,
      hashedPassword
    );
    if (existingUser) {
      return res.status(ResponseStatus.OK).json({ message: "Sucess" });
    }
    return res.status(ResponseStatus.BadRequest).json({ message: "Not done" });
  };

  google = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: "No User Data Provided" });
      }

      const { name, email, userRole } = req.body;

      let NewEmail = email.toLowerCase();

      const hashedPassword = await HashUtils.hashPassword(name);

      const existingUser = await this._interactor.login(NewEmail);
      console.log(existingUser);

      if (existingUser) {
        const JWTtoken = await JwtUtils.generateToken(existingUser);
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour

        return res
          .cookie("access_token", JWTtoken, {
            expires: expiryDate,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production", // Ensure secure attribute is set in production
          })
          .status(200)
          .json({ success: true, data: existingUser });
      }
      const otp = 123;
      const data = await this._interactor.signup(
        name,
        email,
        hashedPassword,
        otp,
        false,
        userRole
      );

      const JWTtoken = await JwtUtils.generateToken(data);
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour

      return res
        .cookie("access_token", JWTtoken, {
          expires: expiryDate,
          httpOnly: false,
          secure: process.env.NODE_ENV === "production", // Ensure secure attribute is set in production
        })
        .status(200)
        .json({ success: true, data: data });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  payment = async (req: Request, res: Response, next: NextFunction) => {
    const { email, userId } = req.body;
    console.log(req.body, "safkshdfshkjkd");

    try {
      const data = await this._interactor.payment(email);
      const paymentData = await this._interactor.addPayment(userId);
      console.log(data);
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  userProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("emial", req.body);

      const {
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
      } = req.body;

      const fileData = req.file as any;
      const imageUrl = fileData.location;
      const data = await this._interactor.userProfile(
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

  userData = async (req: Request, res: Response, next: NextFunction) => {
    let { email } = req.body;
    try {
      const existingUser = await this._interactor.userData(email);
      if (!existingUser) {
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      }
      return res
        .status(ResponseStatus.OK)
        .json({ success: true, data: existingUser });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  userDataMain = async (req: Request, res: Response, next: NextFunction) => {
    let { email } = req.body;
    try {
      const userData = await this._interactor.login(email);

      const uaerProfileData = await this._interactor.userData(email);

      return res.status(ResponseStatus.OK).json({
        success: true,
        userData: userData,
        profileData: uaerProfileData,
      });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  ChatAi = async (req: Request, res: Response, next: NextFunction) => {
    let { userId, updatedChatHistory } = req.body;
    try {
      const chatHistory = updatedChatHistory;
      console.log(req.body);

      const userData = await this._interactor.ChatAi(userId, chatHistory);
      console.log("asfasdfsa", userData);
      return res.status(ResponseStatus.OK).json({ success: true });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  ShowChatAi = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      console.log(userId);

      const userData = await this._interactor.ShowChatAi(userId);
      console.log("asfasdfsa", userData);
      return res
        .status(ResponseStatus.OK)
        .json({ success: true, userData: userData });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  ChatAiDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.userId;
      console.log(userId);

      const userData = await this._interactor.ChatAiDelete(userId);
      console.log("asfasdfsa", userData);
      return res
        .status(ResponseStatus.OK)
        .json({ success: true, userData: userData });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  proData = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    console.log(email);

    try {
      const response = await this._interactor.login(email);
      console.log(response);

      return res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  userById = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try {
      const response = await this._interactor.userById(userId);

      return res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  checkPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, password } = req.body;
    try {
      console.log(req.body);
      const response = await this._interactor.checkPassword(userId);
      let comparePassword;
      if (response) {
        comparePassword = await HashUtils.comparePassword(
          password,
          response?.password
        );
      }
      console.log("comparePassword", comparePassword);
      if (comparePassword) {
        return res.status(200).json({
          success: true,
          data: response,
        });
      } else {
        return res.status(200).json({
          success: false,
          data: response,
        });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  addQuestions = async (req: Request, res: Response, next: NextFunction) => {
    const { question, name, communityId } = req.body;
    try {
      console.log(req.body);
      const response = await this._interactor.addQuestions(
        question,
        name,
        communityId
      );
      if (response) {
        return res.status(ResponseStatus.OK).json({ success: true });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  GetQuestions = async (req: Request, res: Response, next: NextFunction) => {
    const communityId = req.params.Id;
    console.log("communityId", communityId);

    try {
      const response = await this._interactor.GetQuestions(communityId);
      console.log(response);
      return res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  addAnswers = async (req: Request, res: Response, next: NextFunction) => {
    const { answer, userId, questionId } = req.body;
    try {
      const response = await this._interactor.addAnswers(
        answer,
        userId,
        questionId
      );
      if (response) {
        return res.status(ResponseStatus.OK).json({ success: true });
      }
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  userProfileData = async (req: Request, res: Response, next: NextFunction) => {
    let { userId } = req.body;
    try {
      const existingUser = await this._interactor.userProfileData(
        userId.userId
      );
      const data = await this._interactor.checkPassword(userId.userId);
      if (!existingUser) {
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      }
      return res
        .status(ResponseStatus.OK)
        .json({ success: true, data: existingUser, userData: data });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  toDoPost = async (req: Request, res: Response) => {
    const { text, userId } = req.body;
    try {
      const data = await this._interactor.toDoPost(text, userId);
      if (!data) {
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      }
      return res.status(ResponseStatus.OK).json({ success: true, data: data });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  todos = async (req: Request, res: Response) => {
    const { userId } = req.query;
    try {
      // to check if the userId is string or not , type error
      if (typeof userId !== "string") {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ success: false, message: "Invalid userId" });
      }
      const todos = await this._interactor.todos(userId);
      if (!todos) {
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      }
      return res.status(ResponseStatus.OK).json({ success: true, todos });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  completedtodos = async (req: Request, res: Response) => {
    const { userId } = req.query;
    try {
      // to check if the userId is string or not , type error
      if (typeof userId !== "string") {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ success: false, message: "Invalid userId" });
      }
      const completedTodos = await this._interactor.completedtodos(userId);
      if (!completedTodos) {
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      }
      return res
        .status(ResponseStatus.OK)
        .json({ success: true, completedTodos });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  completedtodosPost = async (req: Request, res: Response) => {
    const { updatedTodo } = req.body;
    try {
      const completedTodos = await this._interactor.completedtodosPost(
        updatedTodo._id
      );
      if (!completedTodos) {
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      }
      return res
        .status(ResponseStatus.OK)
        .json({ success: true, completedTodos });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  todoDel = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("req.params", req.params);

    try {
      // to check if the userId is string or not , type error
      if (typeof id !== "string") {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ success: false, message: "Invalid userId" });
      }
      const completedTodos = await this._interactor.todoDel(id);
      if (!completedTodos) {
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      }
      return res
        .status(ResponseStatus.OK)
        .json({ success: true, completedTodos });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  completedtodoDel = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("req.params", req.params);

    try {
      // to check if the userId is string or not , type error
      if (typeof id !== "string") {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ success: false, message: "Invalid userId" });
      }
      const completedTodos = await this._interactor.completedtodoDel(id);
      if (!completedTodos) {
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      }
      return res
        .status(ResponseStatus.OK)
        .json({ success: true, completedTodos });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };


}
