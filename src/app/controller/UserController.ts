import { type Request, type Response } from "express";

import User from "../model/User";

class UserController {
  /**
   * Retrieves all users from the database.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @return {Promise<Response>} The response containing the list of users or an error message.
   */
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password_hash", "createdAt", "updatedAt"] },
      });

      if (users.length < 1) {
        return res.status(400).json({
          errors: ["Users not found"],
        });
      }

      return res.json(users);
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

  /**
   * Updates a user.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @return {Promise<Response>} the updated user or an error response
   */
  async update(req: Request, res: Response): Promise<Response> {
    try {
      // update user
      const user = await User.update(req.body, {
        where: { email: req.userEmail },
      });

      if (!user) {
        return res.status(400).json({
          errors: ["User not updated"],
        });
      }

      return res.json({
        message: "User updated",
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

export default new UserController();
