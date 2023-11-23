import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ITask, IUser } from "../interfaces";
import jwt, { JwtPayload } from "jsonwebtoken";
const prisma = new PrismaClient();

export const controllerTask = {
  create: async (req: Request, res: Response) => {
    const { title, description, user } = req.body as unknown as ITask;

    if (!title || !description || !user) {
      const Verification = {
        title: title || null,
        description: description || null,
        user_id: user || null,
      };
      return res
        .status(400)
        .json({ status: 400, Message: "Bad request!", Verification });
    }

    const task = await prisma.task
      .create({
        data: {
          title: title,
          description: description,
          user_id: user,
          timeLog: {
            create: {
              created_at: new Date(),
              updated_at: new Date(),
              users: {
                connect: {
                  user_id: user,
                },
              },
            },
          },
        },
      })
      .catch((err) => {
        return res.status(400).json({ status: 400, Message: "Bad request!" });
      });

    return res
      .status(200)
      .json({ status: 200, Message: "Task created!", task });
  },

  deletebyId: async (req: Request, res: Response) => {
    const id = parseInt(req.body.id as string);

    if (!id) {
      return res
        .status(400)
        .json({ status: 400, Message: "Bad request!", id: id });
    }

    const task = await prisma.task.findUnique({
      where: {
        task_id: id,
      },
    });

    if (task) {
      await prisma.task.delete({
        where: {
          task_id: id,
        },
      });
      await prisma.timeLog.deleteMany({
        where: {
          task_id: id,
        },
      });
    }

    return res
      .status(200)
      .json({ status: 200, Message: "Task deleted!", task });
  },

  getTasks: async (req: Request, res: Response) => {
    const AuthToken = req.headers.authorization?.split(" ")[1];

    const payload = jwt.decode(AuthToken as string) as JwtPayload;

    if (!payload) {
      return res
        .status(400)
        .json({ status: 400, Message: "Bad request!", payload });
    }

    const tasks = await prisma.task
      .findMany({
        where: {
          user_id: payload.id as IUser["id"],
        },
        include: {
          category: true,
        },
      })

    if (!tasks) {
      return res.status(404).json({
        status: 200, Message: "Tasks not Found!"
      })
    }

    return res
      .status(200)
      .json({ status: 200, Message: "Tasks Found!", tasks });
  },

  updateTasks: async (req: Request, res: Response) => {

  }
};
