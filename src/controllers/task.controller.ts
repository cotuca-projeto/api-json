import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ITask, IUser } from "../interfaces";
import { convertTokenToJson } from "../utils";
import { OutputData } from "@editorjs/editorjs";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import { createToken } from "../middlewares";

export const controllerTask = {
  create: async (req: Request, res: Response) => {
    const { json, token } = req.body;

    const newJson: OutputData = JSON.parse(json as string);
    if (newJson.blocks.length <= 0)
      return res.status(400).json({ message: "Bad request!" });
    const title = newJson.blocks[0].data.text;
    const cut = newJson.blocks.slice(1);
    const description = JSON.stringify(cut);
    const userOld = jwt.decode(token as string) as ITask;
    if (!userOld) return res.status(400).json({ message: "Bad request!" });
    if (!json) {
      return res.status(400).json({ message: "Bad request!" });
    }

    const task = await prisma.task
      .create({
        data: {
          title,
          description,
          user_id: userOld.id,
          timeLog: {
            create: {
              created_at: new Date(),
              updated_at: new Date(),
              users: {
                connect: {
                  user_id: userOld.id,
                },
              },
            },
          },
        },
      })
      .catch((err) => {
        return res.status(400).json({ message: "Bad request!" });
      });

    if (!task) {
      return res.status(400).json({ message: "Bad request!" });
    }

    const user = await prisma.users.findUnique({
      where: {
        user_id: userOld.id,
      },
      include: {
        task: true,
        category: true,
        timeLog: true,
      },
    });

    return res.status(200).json({
      message: "Task created!",
      token: createToken(user as unknown as IUser),
      user: user,
      task: task,
    });
  },

  deletebyId: async (req: Request, res: Response) => {
    const id = parseInt(req.body.id as string);

    if (!id) {
      return res.status(400).json({ message: "Bad request!", id: id });
    }

    const task = await prisma.task.findUnique({
      where: {
        task_id: id,
      },
    });

    let userID;

    if (task) {
      userID = task.user_id;
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

    const user = await prisma.users.findUnique({
      where: {
        user_id: userID,
      },
      include: {
        task: true,
        category: true,
        timeLog: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    return res.status(200).json({
      message: "Task deleted!",
      token: createToken(user as unknown as IUser),
    });
  },

  getTasks: async (req: Request, res: Response) => {
    const payload = convertTokenToJson(req);

    if (!payload) {
      return res.status(400).json({ message: "Bad request!", payload });
    }

    const tasks = await prisma.task.findMany({
      where: {
        user_id: payload.id,
      },
    });

    if (!tasks) {
      return res.status(204).json({
        message: "Tasks not Found!",
      });
    }

    const user = await prisma.users.findUnique({
      where: {
        user_id: payload.id,
      },
      include: {
        task: true,
        category: true,
        timeLog: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    return res.status(200).json({
      message: "Tasks Found!",
      token: createToken(user as unknown as IUser),
    });
  },

  getById: async (req: Request, res: Response) => {
    const payload = convertTokenToJson(req);

    if (!payload?.tasks)
      return res.status(400).json({ message: "Not Content tasks!" });

    const id = parseInt(req.params.id as string);

    let element: number = 0;

    payload.tasks.map((e) => {
      if (e.id === id) {
        element = e.id;
      }
    });

    if (!id || element !== id) {
      return res.status(400).json({ message: "Bad Request!" });
    }

    const taskData = await prisma.task.findUnique({
      where: {
        task_id: element ?? id,
      },
    });

    if (!taskData) return res.status(404).json({ message: "Not found!" });

    return res.status(200).json({ message: "Ok!", data: taskData });
  },

  updateTasks: async (req: Request, res: Response) => {
    const { json, token } = req.body;

    const task_id = req.body.id as unknown as number;
    const user = jwt.decode(token as string) as IUser;
    const newJson: OutputData = JSON.parse(json as string);

    const title = newJson.blocks[0].data.text;
    const cut = newJson.blocks.slice(1);
    const description = JSON.stringify(cut);

    if (!user?.tasks) {
      return res.status(204).json({ message: "This user has no tasks" });
    }

    let element: number = 0;

    user.tasks.map((e) => {
      if (e.id === task_id) {
        element = e.id;
      }
    });

    if (!task_id && element !== task_id) {
      return res
        .status(400)
        .json({ message: "Bad Request, send Task_id with value!" });
    }

    const task = await prisma.task.findUnique({
      where: {
        task_id: element ?? task_id,
      },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const updateTask = await prisma.task.update({
      where: {
        task_id: task.task_id,
      },
      data: {
        title: (title as string) ?? task?.title,
        description: (description as string) ?? task?.description,
      },
    });

    if (!updateTask)
      return res.status(500).json({ message: "Internal error failed!" });

    return res.status(200).json({
      message: `New Update in ${task.title}`,
      token: createToken(user),
    });
  },
};
