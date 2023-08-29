import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { resolve } from "path";

import sequelize from "./database";
import route from "./routes";

dotenv.config();

class App {
  public express: express.Express;
  private databaseConnection: any;

  constructor() {
    this.express = express();
    this.middleware();
    this.database();
    this.routes();
  }

  private middleware(): void {
    this.express.use(express.json());
    this.express.use(cors());
    this.express.use(express.static(resolve(__dirname, "..", "public")));
  }

  private database(): void {
    this.databaseConnection = sequelize;
  }

  private routes(): void {
    this.express.use(route);
  }
}

export default new App().express;
