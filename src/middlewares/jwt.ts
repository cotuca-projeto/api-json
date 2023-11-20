import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.SECRET || null;

export function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    if (!secret) {
      return res.status(401).send({ message: "No secret provided" });
    }
    jwt.verify(token, secret);
    return next();
  } catch (e: any) {
    return res.status(400).send({ message: "Token Invalid" });
  }
}

export const createToken = (user: any) => {
  if (!secret) {
    return null;
  }
  return jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      photo: user.profile_image || null,
    },
    secret
  );
};
