import { Request, Response, Router } from "express";
import { controlerUsers } from "../controllers/user.controller";
import { checkToken, isAdmin } from "../middlewares";

const routerUsers = Router();

routerUsers.get("/", (req: Request, res: Response) => {
  res.status(400).json({ status: 400, message: "Bad request!" });
});

routerUsers.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ status: 200, message: "Test Completed!" });
});

routerUsers.post("/register", async (req: Request, res: Response) => {
  await controlerUsers.register(req, res);
});

routerUsers.delete("/delete", isAdmin, async (req: Request, res: Response) => {
  await controlerUsers.deletebyId(req, res);
});

routerUsers.post("/find", isAdmin, async (req: Request, res: Response) => {
  await controlerUsers.findById(req, res);
});

routerUsers.get("/all", isAdmin, async (req: Request, res: Response) => {
  await controlerUsers.listAllUsers(req, res);
});

routerUsers.put(
  "/updateimage",
  checkToken,
  async (req: Request, res: Response) => {
    await controlerUsers.updateProfileImage(req, res);
  }
);

routerUsers.get(
  "/getimage",
  checkToken,
  async (req: Request, res: Response) => {
    await controlerUsers.getImage(req, res);
  }
);

routerUsers.put(
  "/forgotpassword",
  checkToken,
  async (req: Request, res: Response) => {
    await controlerUsers.forgetPassword(req, res);
  }
);

routerUsers.post("/login", async (req: Request, res: Response) => {
  await controlerUsers.login(req, res);
});

export default routerUsers;
