import { Request, Response, Router } from "express";
import { controllerTask } from "../controllers/task.controller";
import { checkToken } from "../middlewares/jwt";

const routerTasks = Router();

routerTasks.get("/create", checkToken, async (req: Request, res: Response) => {
  await controllerTask.create(req, res);
});

routerTasks.delete(
  "/delete",
  checkToken,
  async (req: Request, res: Response) => {
    await controllerTask.deletebyId(req, res);
  }
);

routerTasks.get("/gettasks", checkToken, async (req: Request, res: Response) => {
  await controllerTask.getTasks(req, res);
});

export default routerTasks;
