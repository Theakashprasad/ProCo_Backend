import { Request, Response, NextFunction } from "express";
import { AnySchema } from "yup";

export const validateRequest =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => { 
    try {
      await schema.validate(req.body);
      next();
    } catch (err) { 
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res
          .status(400) 
          .json({ message: "Unknown error occurred during validation" });
      }
    }
  };
