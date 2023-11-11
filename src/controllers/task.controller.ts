import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ITask } from "../interfaces";
const prisma = new PrismaClient();

export const controllerTask = {
  create: async (req: Request, res: Response) => {
    const { title, description, user_id } = req.query as unknown as ITask;

    if (!title || !description || !user_id) {
      const Verification = {
        title: title || null,
        description: description || null,
        user_id: user_id || null,
      };
      return res
        .status(400)
        .json({ status: 400, Message: "Bad request!", Verification });
    }

    const task = await prisma.task.create({
      data: {
        title: title,
        description: description,
        user_id: user_id,
        timeLog: {
          create: {
            created_at: new Date(),
            updated_at: new Date(),
            users: {
              connect: {
                user_id: user_id,
              },
            },
          },
        },
      },
    });

    return res
      .status(200)
      .json({ status: 200, Message: "Task created!", task });
  },
};
