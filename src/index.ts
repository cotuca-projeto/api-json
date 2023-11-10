import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { handleError } from "./errors/handleError";
import { BadRequestError } from "./errors/BadRequestError";
import { IUser } from "./interfaces";

const prisma = new PrismaClient();

const port: number = (process.env.PORT as unknown as number) || 3000;

// Executando o express (API-RestFull)
const app = express();

// Iniciado as rotas
try {
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: 200, message: "Ok!" });
  });

  app.get("/test", (req: Request, res: Response) => {
    console.log({ ...req.query });

    res
      .status(200)
      .json({ status: 200, message: "Ok!", log: { ...req.query } });
  });

  app.post("/register", async (req: Request, res: Response) => {
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
  });

  app.delete("/user/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const user = prisma.users.delete({
      where: {
        user_id: id,
      },
    });
    res.json(user);
  });

  app.get("/user/:id", async (req: Request, res: Response) => {
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
  });
} catch (error) {
  handleError(error, app.response);
}

// Iniciado a comunicação
app.listen(port, () =>
  console.log(`Server running on ${port}! https://localhost:${port}`)
);
