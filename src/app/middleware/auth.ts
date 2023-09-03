/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import authConfig from "../../config/auth";
import User from "../model/User";

declare module "express" {
  interface Request {
    userId?: number | any;
    userEmail?: string;
  }
}
export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ errors: ["Unauthorized"] });
  }

  const [, token] = authorization.split(" ");

  try {
    const data = jwt.verify(token, authConfig.jwt_secret) as JwtPayload;

    const { email } = data;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        errors: ["Unauthorized"],
      });
    }

    req.userId = user.id;
    req.userEmail = user.email;

    next();
  } catch (e: any) {
    if (e.errors && Array.isArray(e.errors)) {
      return res.status(400).json({
        errors: e.errors.map((err: { message: string }) => err.message),
      });
    }

    return res.status(401).json({
      errors: ["Unauthorized"],
    });
  }
};
