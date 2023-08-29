import { type Request, type Response } from "express";

import User from "../model/User";

class UserController {
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.create(req.body);

      if (!user) {
        return res.status(400).json({
          errors: ["An unexpected error occurred"],
        });
      }

      return res.json(user);
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

export default new UserController();
