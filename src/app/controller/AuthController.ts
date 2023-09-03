import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";

import jwtConfig from "../../config/auth";
import User from "../model/User";

class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      console.log(req.body);

      const user = await User.create(req.body);

      if (!user) {
        res.status(400).json({ errors: [{ message: "User not created" }] });
      }

      return res.json({
        message: "User created",
      });
    } catch (e: any) {
      if (e.errors && Array.isArray(e.errors)) {
        const errorResponse = e.errors.map(
          (err: { message: string; path: string }) => ({
            title: err.path,
            message: err.message,
          })
        );

        return res.status(400).json({
          errors: errorResponse,
        });
      }

      return res.status(500).json({
        errors: ["An unexpected error occurred"],
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      // verifying that email or password are valid
      if ((!email && !password) || (email === "" && password === "")) {
        return res.status(400).json({
          errors: ["Email and password are required"],
        });
      }

      // find and validate user
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({
          errors: ["Email or password is invalid"],
        });
      }

      // verify password
      if (!(await user.passwordIsValid(password))) {
        return res.status(400).json({
          errors: ["Email or password is invalid"],
        });
      }

      // return token
      const token = jwt.sign(
        { email: user.email, id: user.id },
        jwtConfig.jwt_secret,
        {
          expiresIn: jwtConfig.expire_in,
        }
      );

      return res.json({ access_token: token });
    } catch (e: any) {
      if (e.errors && Array.isArray(e.errors)) {
        const errorResponse = e.errors.map(
          (err: { message: string; path: string }) => ({
            title: err.path,
            message: err.message,
          })
        );

        return res.status(400).json({
          errors: errorResponse,
        });
      }

      return res.status(500).json({
        errors: ["An unexpected error occurred"],
      });
    }
  }

  async me(req: Request, res: Response): Promise<Response> {
    try {
      const email = req.userEmail;

      if (email) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return res.status(400).json({
            errors: ["User not found"],
          });
        }

        return res.json(user);
      }

      return res.status(400).json({
        errors: ["Unauthorized"],
      });
    } catch (e: any) {
      if (e.errors && Array.isArray(e.errors)) {
        const errorResponse = e.errors.map(
          (err: { message: string; path: string }) => ({
            title: err.path,
            message: err.message,
          })
        );

        return res.status(400).json({
          errors: errorResponse,
        });
      }

      return res.status(500).json({
        errors: ["An unexpected error occurred"],
      });
    }
  }
}

export default new AuthController();
