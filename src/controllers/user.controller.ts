import { Request, Response } from "express";
import { IUser } from "../interfaces";
import { PrismaClient, users } from "@prisma/client";
import { createToken } from "../middlewares";
import sharp from "sharp";
import { convertTokenToJson } from "../utils";
const prisma = new PrismaClient();

export const controlerUsers = {
  register: async (req: Request, res: Response) => {
    const { email, first_name, last_name, password, username, photo } =
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

    if (photo) {
      image = Buffer.from(photo, "base64");
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
          password_hash: password.replace(" ", ""),
          username: username,
          // timeLog: { // já tem o trigger no banco de dados por isso desativei
          //   create: {
          //     created_at: new Date(),
          //     updated_at: new Date(),
          //   },
          // },
          profile_image: image ?? null,
        },
      })
      .catch((err) => {
        if (
          err.meta.cause === "Record to insert already exists." ||
          err.meta.target
        ) {
          return res
            .status(401)
            .json({ status: 401, Message: "User already exists!" });
        } else {
          res.status(500).json({ status: 500, Message: "Internal error!" });
        }
      });

    return res.status(201).json({
      status: 201,
      Message: "User created!",
      // user: userWithoutPassword,
      token: createToken(user as users, null),
    });
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

    return res.status(200).json({ status: 200, Message: "User deleted!" });
  },

  findById: async (req: Request, res: Response) => {
    const id: number = parseInt(req.query.id as string);
    const user = await prisma.users
      .findUnique({
        where: {
          user_id: id,
        },
        include: {
          timeLog: true,
          category: true,
          task: true,
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
    return res.status(200).json({ status: 200, message: user });
  },

  listAllUsers: async (req: Request, res: Response) => {
    const users = await prisma.users.findMany({
      include: {
        timeLog: true,
        category: true,
        task: true,
      },
    });

    const usersWithoutPassword = users.map((user) => {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return res.status(200).json({ status: 200, user: usersWithoutPassword });
  },

  updateProfileImage: async (req: Request, res: Response) => {
    const { photo } = req.query as unknown as IUser;
    const userDecode = convertTokenToJson(req);

    if (!userDecode) {
      return res.status(401).json({ message: "Invalid values user" });
    }

    const user = await prisma.users
      .findUnique({
        where: {
          email: userDecode.email,
          password_hash: userDecode.password,
        },
        include: {
          timeLog: true,
          category: true,
          task: true,
          _count: true,
        },
      })
      .catch((err) => {
        if (err.meta.cause === "Record to select does not exist.") {
          res.status(302).json({ status: 302, Message: "User not found!" });
        } else {
          res.status(500).json({ status: 500, Message: "Internal error!" });
        }
      });

    if (!user) {
      return res.status(302).json({ status: 302, Message: "User not found!" });
    }

    let image: Buffer | null = null;

    if (photo) {
      const result = await fetch(photo);
      const buffer = await result.arrayBuffer();

      const imageSizeInMB = buffer.byteLength / (1024 * 1024);

      if (imageSizeInMB > 3) {
        return res
          .status(400)
          .json({ status: 400, Message: "Image size exceeds 3 MB limit." });
      }

      const resizedImageBuffer = await sharp(buffer)
        .resize({ width: 3 * 100, height: 4 * 100 })
        .toBuffer();

      image = Buffer.from(resizedImageBuffer);
    }

    const userUpdate = await prisma.users.update({
      include: {
        timeLog: true,
      },
      where: {
        user_id: user.user_id,
      },
      data: {
        profile_image: image!,
      },
    });

    return res
      .status(200)
      .json({ status: 200, Message: "Image updated!", userUpdate });
  },

  forgetPassword: async (req: Request, res: Response) => {
    const userDecode = convertTokenToJson(req);

    const password = req.query.password as string;

    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!password || regex.test(password)) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!userDecode) {
      return res.status(401).json({ status: 401, message: "Invalid token!" });
    }

    const user = await prisma.users
      .findUnique({
        where: {
          email: userDecode.email,
          username: userDecode.username,
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

  getImage: async (req: Request, res: Response) => {
    const userDecode = convertTokenToJson(req);

    if (!userDecode) {
      return res.status(401).json({ status: 401, message: "Invalid token!" });
    }

    const user = await prisma.users.findUnique({
      where: {
        user_id: userDecode.id,
      },
      select: {
        profile_image: true,
      },
    });

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found!" });
    }

    if (!user.profile_image) {
      return res
        .status(404)
        .json({ status: 404, message: "Profile image not found!" });
    }

    const byteArray = new Uint8Array(user.profile_image);
    const buffer = Buffer.from(byteArray);

    res.contentType("image/jpeg");
    res.send(buffer);
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.query as unknown as IUser;

    const user = await prisma.users.findUnique({
      where: {
        email: email,
        password_hash: password,
      },
      include: {
        timeLog: true,
        category: true,
        task: true,
        _count: true,
      },
    });

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found!" });
    }

    const task = await prisma.task.findMany({
      where: {
        user_id: user.user_id,
      },
    });

    const userWithoutPassword = {
      ...user,
      password_hash: undefined,
    };

    return res.status(200).json({
      status: 200,
      // user: userWithoutPassword,
      token: createToken(user, task ? task : null),
    });
  },
};
