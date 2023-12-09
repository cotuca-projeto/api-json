import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../interfaces";

export function convertTokenToJson(req: Request) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  const userDecode = jwt.decode(token as string) as JwtPayload;
  if (!userDecode) {
    return null;
  } else {
    return userDecode as IUser;
  }
}
