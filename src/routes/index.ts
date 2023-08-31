import { Router } from "express";

import AuthController from "../app/controller/AuthController";
import UserController from "../app/controller/UserController";

const route = Router();

route.get("/test", (req, res) => {
  return res.json("ok");
});

// Auth routes
route.post("/auth/register", AuthController.register);
route.post("/auth/login", AuthController.login);

route.post("/users", UserController.store);

export default route;
