import { Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { IUser } from "../interfaces";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const controlerUsers = {
  register: async (req: Request, res: Response) => {
    const { email, first_name, last_name, password, username, profile_image } =
      req.query as unknown as IUser;

    console.log({ ...req.query });

    if (!email || !first_name || !last_name || !password || !username)
      throw new BadRequestError("Missing parameters");

    let image: Buffer | null = null;

    if (profile_image) {
      image = Buffer.from(profile_image, "base64");
    }

    const user = await prisma.users.create({
      data: {
        email: email,
        first_name: first_name,
        last_name: last_name,
        password_hash: password,
        username: username,
        timeLog: {
          create: {
            created_at: new Date(),
            updated_at: new Date(),
          },
        },
        profile_image: image || null,
      },
    });
    return res
      .status(201)
      .json({ status: 201, Message: "User created!", log: user });
  },
  delete: (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const user = prisma.users.delete({
      where: {
        user_id: id,
      },
    });
    res.json(user);
  },
  listById: async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const user = await prisma.users.findUnique({
      where: {
        user_id: id,
      },
    });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    res.status(200).json({ status: 200, info_user: user });
  },
  listAllUsers: async (req: Request, res: Response) => {
    const users = await prisma.users.findMany();
    res.status(200).json({ status: 200, info_users: users });
  },
};