import { Request, Response, Router } from "express";
import { controllerTask } from "../controllers/task.controller";
import { checkToken } from "../middlewares";

const routerTasks = Router();

routerTasks.post("/create", checkToken, async (req: Request, res: Response) => {
  await controllerTask.create(req, res);
});

routerTasks.delete(
  "/delete",
  checkToken,
  async (req: Request, res: Response) => {
    await controllerTask.deletebyId(req, res);
  }
);

routerTasks.post(
  "/gettasks",
  checkToken,
  async (req: Request, res: Response) => {
    await controllerTask.getTasks(req, res);
  }
);

routerTasks.post(":id", checkToken, async (req: Request, res: Response) => {
  await controllerTask.getById(req, res);
});

routerTasks.get("/update", checkToken, async (req: Request, res: Response) => {
  await controllerTask.updateTasks(req, res);
});

export default routerTasks;
