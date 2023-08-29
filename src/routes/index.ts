import { Router } from "express";

import UserController from "../app/controller/UserController";

const route = Router();

route.get("/test", (req, res) => {
  return res.json("ok");
});

route.post("/users", UserController.store);

export default route;
