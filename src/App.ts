import cors from "cors";
import express from "express";

class App {
  public express: express.Express;

  constructor() {
    this.express = express();
    this.middleware();
  }

  private middleware(): void {
    this.express.use(express.json());
    this.express.use(cors());
  }
}

export default new App().express;
