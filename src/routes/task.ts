import { Request, Response, Router } from "express";
import { controllerTask } from "../controllers/task.controller";
import { checkToken } from "../middlewares";

const routerTasks = Router();

routerTasks.post("/create", async (req: Request, res: Response) => {
  await controllerTask.create(req, res);
});

routerTasks.delete(
  "/delete",
  checkToken,
  async (req: Request, res: Response) => {
    await controllerTask.deletebyId(req, res);
  }
);

routerTasks.get(
  "/gettasks",
  checkToken,
  async (req: Request, res: Response) => {
    await controllerTask.getTasks(req, res);
  }
);

routerTasks.post(":id", checkToken, async (req: Request, res: Response) => {
  await controllerTask.getById(req, res);
});

routerTasks.put("/update", checkToken, async (req: Request, res: Response) => {
  await controllerTask.updateTasks(req, res);
});

export default routerTasks;
