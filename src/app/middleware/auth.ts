import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import authConfig from "../../config/auth";

export default async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ errors: ["Unauthorized"] });
  }

  const [, token] = authorization.split(" ");

  try {
    const data = jwt.verify(
      token,
      process.env.JWT_SECRET || authConfig.jwt_secret
    ) as JwtPayload;

    const { email, id } = data;
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
