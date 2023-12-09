import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ITask } from "../interfaces";
import { convertTokenToJson } from "../utils";
const prisma = new PrismaClient();

export const controllerTask = {
  create: async (req: Request, res: Response) => {
    const { title, description, user } = req.query as unknown as ITask;

    if (!title || !description || !user) {
      const verification = {
        title: title || null,
        description: description || null,
        user_id: user || null,
      };
      return res
        .status(400)
        .json({ status: 400, Message: "Bad request!", verification });
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
    const id = parseInt(req.query.id as string);

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
    const payload = convertTokenToJson(req);

    if (!payload) {
      return res
        .status(400)
        .json({ status: 400, Message: "Bad request!", payload });
    }

    const tasks = await prisma.task.findMany({
      where: {
        user_id: payload.id,
      },
      include: {
        category: true,
      },
    });

    if (!tasks) {
      return res.status(204).json({
        Message: "Tasks not Found!",
      });
    }

    return res.status(200).json({ message: "Tasks Found!", tasks });
  },

  updateTasks: async (req: Request, res: Response) => {
    const payload = convertTokenToJson(req);

    const { title, description } = req.query;

    const task_id = req.query.task_id as unknown as number;

    if (!payload?.tasks) {
      return res.status(204).json({ message: "This user has no tasks" });
    }

    let element: number = 0;

    payload.tasks.map((e) => {
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

    return res.status(200).json({ message: `New Update in ${task.title}` });
  },
};
