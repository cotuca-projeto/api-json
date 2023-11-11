import { Request, Response, Router } from "express";
import { controlerUsers } from "../controllers/user.controller";

const routerUsers = Router();

routerUsers.get("/", (req: Request, res: Response) => {
  res.status(400).json({ status: 400, message: "Bad request!" });
});

routerUsers.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ status: 200, message: "Test Completed!" });
});

routerUsers.post("/register", async (req: Request, res: Response) => {
  controlerUsers.register(req, res);
});

routerUsers.delete("/user/:id", async (req: Request, res: Response) => {
  controlerUsers.delete(req, res);
});

routerUsers.get("/user/:id", async (req: Request, res: Response) => {
  controlerUsers.listById(req, res);
});

routerUsers.get("/users", async (req: Request, res: Response) => {
  controlerUsers.listAllUsers(req, res);
});

export default routerUsers;
