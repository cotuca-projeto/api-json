import { Request, Response } from "express";
import { IUser } from "../interfaces";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const controlerUsers = {
  register: async (req: Request, res: Response) => {
    const { email, first_name, last_name, password, username, profile_image } =
      req.query as unknown as IUser;

    if (!email || !first_name || !last_name || !password || !username) {
      const Verification = {
        email: email || null,
        first_name: first_name || null,
        last_name: last_name || null,
        password: password ? "existed" : null,
        username: username || null,
      };
      return res
        .status(400)
        .json({ status: 400, Message: "Bad request!", Verification });
    }

    let image: Buffer | null = null;

    if (profile_image) {
      image = Buffer.from(profile_image, "base64");
    }

    const emailExisted = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    const usernameExisted = await prisma.users.findUnique({
      where: {
        username: username,
      },
    });

    if (emailExisted) {
      return res
        .status(401)
        .json({ status: 401, Message: "Email already exists!" });
    }

    if (usernameExisted) {
      return res
        .status(401)
        .json({ status: 401, Message: "Username already exists!" });
    }

    const user = await prisma.users
      .create({
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
      })
      .catch((err) => {
        if (
          err.meta.cause === "Record to insert already exists." ||
          err.meta.target
        ) {
          res
            .status(401)
            .json({ status: 401, Message: "User already exists!" });
        } else {
          res.status(500).json({ status: 500, Message: "Internal error!" });
        }
      });
    return res
      .status(201)
      .json({ status: 201, Message: "User created!", log: user });
  },
  deletebyId: async (req: Request, res: Response) => {
    const id: number = parseInt(req.query.id as string);

    const findUser = await prisma.users.findUnique({
      where: {
        user_id: id,
      },
    });

    if (findUser) {
      await prisma.timeLog.deleteMany({
        where: {
          user_id: findUser.user_id,
        },
      });

      await prisma.task.deleteMany({
        where: {
          user_id: findUser.user_id,
        },
      });

      await prisma.category.deleteMany({
        where: {
          user_id: findUser.user_id,
        },
      });

      await prisma.users.delete({
        where: {
          user_id: findUser.user_id,
        },
      });
    }

    return res
      .status(200)
      .json({ status: 200, Message: "User deleted!", findUser });
  },
  deleteAll: async (req: Request, res: Response) => {
    const users = await prisma.users.deleteMany();
    return res
      .status(200)
      .json({ status: 200, Message: "Users deleted!", users });
  },
  findById: async (req: Request, res: Response) => {
    const id: number = parseInt(req.query.id as string);
    const user = await prisma.users
      .findUnique({
        where: {
          user_id: id,
        },
      })
      .catch((err) => {
        if (err.meta?.cause === "Record to select does not exist.") {
          res.status(302).json({ status: 302, Message: "User not found!" });
        } else {
          res.status(500).json({ status: 500, Message: "Internal error!" });
        }
      });

    if (!user)
      return res.status(302).json({ status: 302, Message: "User not found!" });
    return res.status(200).json({ status: 200, info_user: user });
  },
  listAllUsers: async (req: Request, res: Response) => {
    const users = await prisma.users.findMany();
    res.status(200).json({ status: 200, info_users: users });
  },
  updateProfileImage: async (req: Request, res: Response) => {
    const { email, password, profile_image } = req.query as unknown as IUser;
    const id: number = parseInt(req.params.id);

    const user = await prisma.users
      .findUnique({
        where: {
          email: email,
          password_hash: password,
        },
        include: {
          timeLog: true,
        },
      })
      .catch((err) => {
        if (err.meta.cause === "Record to select does not exist.") {
          res.status(302).json({ status: 302, Message: "User not found!" });
        } else {
          res.status(500).json({ status: 500, Message: "Internal error!" });
        }
      });

    let image: Buffer | null = null;

    if (profile_image) {
      image = Buffer.from(profile_image, "base64");
    } else {
      image = user?.profile_image || null;
    }

    const userUpdate = await prisma.users.update({
      include: {
        timeLog: true,
      },
      where: {
        user_id: id,
      },
      data: {
        profile_image: image,
      },
    });
  },
  forgetPassword: async (req: Request, res: Response) => {
    const { email, username, password } = req.query as unknown as IUser;

    const user = await prisma.users
      .findUnique({
        where: {
          email: email,
          username: username,
        },
        select: {
          user_id: true,
        },
      })
      .catch((err) => {
        if (err.meta.cause === "Record to select does not exist.") {
          res.status(302).json({ status: 302, Message: "User not found!" });
        } else {
          res.status(500).json({ status: 500, Message: "Internal error!" });
        }
      });

    await prisma.users.update({
      where: {
        user_id: user?.user_id,
      },
      data: {
        password_hash: password,
      },
    });

    return res.status(200).json({ status: 200, Message: "Password changed!" });
  },
};
