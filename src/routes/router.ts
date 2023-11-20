import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

const indexRouter = Router();

indexRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: 200, message: "Ok!" });
});

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
    return res
      .status(500)
      .json({ status: 500, Message: "Internal error!", error });

  return res.status(200).json({ status: 200, Message: "All deleted!" });
});

indexRouter.get("/validate", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    if (!process.env.SECRET) {
      return res.status(401).send({ message: "No secret provided" });
    }
    jwt.verify(token, process.env.SECRET);
    const user = jwt.decode(token);
    return res.status(200).send({ message: "Token Valid", user });
  } catch (e: any) {
    return res.status(400).send({ message: "Token Invalid" });
  }
});

export default indexRouter;
