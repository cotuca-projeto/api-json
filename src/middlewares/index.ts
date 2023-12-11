import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ITask, IUser } from "../interfaces";

const secret = process.env.TOKEN ?? null;

export function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization ?? req.body.token;

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    if (!secret) {
      return res.status(401).send({ message: "No secret provided" });
    }
    const decode = jwt.verify(token, secret);
    console.log(decode);

    return next();
  } catch (e: any) {
    return res.status(400).send({ message: "Token Invalid" });
  }
}

export function createToken(user: IUser, task?: ITask[] | null) {
  if (!secret) {
    return null;
  }

  const userTasks = task ? { task } : user;

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      photo: user.photo || null,
      tasks: userTasks ?? user.tasks,
    },
    secret
  );
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.query.token !== process.env.TOKEN) {
    return res
      .status(401)
      .json({ message: "Not Authorized! You need put a token" });
  } else {
    next();
  }
}
