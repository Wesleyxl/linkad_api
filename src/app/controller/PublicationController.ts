import { type Request, type Response } from "express";

import Publication from "../model/Publication";

class PublicationController {
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const publications = await Publication.findAll();

      if (publications.length < 1) {
        return res.status(400).json({
          errors: ["Publications not found"],
        });
      }

      return res.json(publications);
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

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const publication = await Publication.create(req.body);

      if (!publication) {
        return res.status(400).json({
          errors: [{ message: "Publication not created" }],
        });
      }

      return res.json(publication);
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

export default new PublicationController();
