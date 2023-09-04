import { Router } from "express";

// controller
import AuthController from "../app/controller/AuthController";
import PublicationController from "../app/controller/PublicationController";
import UserController from "../app/controller/UserController";
import Auth from "../app/middleware/auth";

const route = Router();

route.get("/test", (req, res) => {
  return res.json("ok");
});

// Auth routes
route.post("/auth/register", AuthController.register);
route.post("/auth/login", AuthController.login);
route.get("/auth/me", Auth, AuthController.me);

// users
route.get("/users", Auth, UserController.index);

// publications
route.get("/publications", Auth, PublicationController.index);
route.post("/publications", Auth, PublicationController.store);

export default route;
