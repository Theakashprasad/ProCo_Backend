import { Response, Request, NextFunction } from "express";
import { UserModel } from "../model/userModel";

export class BlockCheckMiddleware {
  static async checkIfBlocked(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isBlocked) {
        console.log(" bloked");
        return res.status(403).json({ message: "User is blocked" });
      }
      console.log("not bloked");

      next();
    } catch (error) {
      console.error("Error checking if user is blocked:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
