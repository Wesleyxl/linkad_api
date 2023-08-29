import { type Request } from "express";
import multer, { MulterError, type FileFilterCallback } from "multer";
import { resolve, extname } from "path";

function randomNumber(): number {
  return Math.floor(Math.random() * 1000 + 1000);
}

interface MulterConfig {
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => void;
  storage: multer.StorageEngine;
}

const multerConfigUser: MulterConfig = {
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      const error = new MulterError("LIMIT_UNEXPECTED_FILE");
      error.message = "File must be an image";
      callback(error);
    } else {
      callback(null, true);
    }
  },

  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(
        null,
        resolve(__dirname, "..", "..", "public", "images", "users")
      );
    },
    filename: (req, file, callback) => {
      callback(
        null,
        `${Date.now()}_${randomNumber()}${extname(file.originalname)}}`
      );
    },
  }),
};

export { multerConfigUser };
