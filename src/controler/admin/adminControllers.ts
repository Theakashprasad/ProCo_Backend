import { Response, Request, NextFunction } from "express";
import { IUserInteractor } from "../../providers/interface/user/IUserInteractor";
import dotenv from "dotenv";
import { admin } from "../../entities/admin";
import { IAdminInteractor } from "../../providers/interface/admin/IAdminInteractor";
import { JwtUtils } from "../../shared/utils/AdminJwt";
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

export class AdminController {
  private _interactor: IAdminInteractor;
  private userdatas!: admin;

  //the interactor help to access the user interface repository
  constructor(interactor: IAdminInteractor) {
    this._interactor = interactor;
  }

  adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log("admin", req.body);

    const response = await this._interactor.adminLogin(email, password);
    if (response) {
      if (response.password != password) {
        return res.status(401).json({
          success: false,
          message: "Invalid password.",
        });
      }
      const JWTtoken = await JwtUtils.generateToken(response);
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour

      return res
        .cookie("access_Admin_token", JWTtoken, {
          expires: expiryDate,
          httpOnly: false,
          secure: process.env.NODE_ENV === "production", // Ensure secure attribute is set in production 
        })
        .status(200)
        .json({
          success: true,
          message: "Login succes",
          token:JWTtoken,
        });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
  };

  getPayment = async (req: Request, res: Response) => {
    try {
      const data = await this._interactor.getPayment();

      if (!data) {
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      }
      return res.status(ResponseStatus.OK).json({ success: true, data });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  getProPayment = async (req: Request, res: Response) => {
    try {
      const data = await this._interactor.getProPayment();

      if (!data) {
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      }
      return res.status(ResponseStatus.OK).json({ success: true, data });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  addWallet = async (req: Request, res: Response) => {
    const { proId, numberOfUsers, amount } = req.body;
    try {
      const data = await this._interactor.addWallet(
        proId,
        numberOfUsers,
        amount
      );
      if (!data) {
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      }
      return res.status(ResponseStatus.OK).json({ success: true, data });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };

  proPayStatus = async (req: Request, res: Response) => {
    const { proId } = req.params;
    try {
      const data = await this._interactor.proPayStatus(proId);
      if (!data) {
        return res.status(ResponseStatus.BadRequest).json({ success: false });
      }
      return res.status(ResponseStatus.OK).json({ success: true, data });
    } catch (error) {
      return res.status(ResponseStatus.BadRequest).json(error);
    }
  };


  
  blogVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, action } = req.params;
      console.log("blof", req.params);
      
      const isBlocked = action === 'true';
     console.log(isBlocked);
     
      const response = await this._interactor.blogVerify(userId, isBlocked);
      console.log('response',response);
      
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



}
