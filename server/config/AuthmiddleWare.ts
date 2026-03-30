import { Request, Response, NextFunction } from "express";
import { accessVerify } from "./jwt";

export const AuthmiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req?.cookies?.tooken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = accessVerify(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    // Attach user info to request
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};