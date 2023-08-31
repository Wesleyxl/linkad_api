import { type Request, type Response } from "express";

// import User from "../model/User";

class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      console.log(req.body);

      // const user = await User.create(req.body);

      // if (!user) {
      //   res.status(400).json({ errors: [{ message: "User not created" }] });
      // }

      return res.json(req.body);
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
    return res.json("login");
  }
}

export default new AuthController();
