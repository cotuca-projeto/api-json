import { Request, Response, Router } from "express";
import { controllerTask } from "../controllers/task.controller";

const routerTasks = Router();

routerTasks.get("/create", async (req: Request, res: Response) => {
  await controllerTask.create(req, res);
});

routerTasks.delete("/delete", async (req: Request, res: Response) => {
    await controllerTask.deletebyId(req, res);
});

export default routerTasks;
