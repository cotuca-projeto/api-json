import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const indexRouter = Router();

indexRouter.delete("/delete", async (req: Request, res: Response) => {
  if (req.query.token !== process.env.TOKEN)
    return res.status(401).json({ status: 401, Message: "Unauthorized!" });

  let error = "";

  await prisma.timeLog.deleteMany().catch((err) => {
    error = err;
  });
  await prisma.category.deleteMany().catch((err) => {
    error += err;
  });
  await prisma.task.deleteMany().catch((err) => {
    error += err;
  });
  await prisma.users.deleteMany().catch((err) => {
    error += err;
  });

  if (error)
    return res.status(500).json({ status: 500, Message: "Internal error!", error });

  return res.status(200).json({ status: 200, Message: "All deleted!" });
});

export default indexRouter;
