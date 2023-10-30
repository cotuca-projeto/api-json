import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function addUser(
  email: string,
  first_name: string,
  last_name: string,
  password: string,
  username: string
) {
  if (!email || !first_name || !last_name || !password || !username)
    throw new Error("Missing data");

  return await prisma.users.create({
    data: {
      email: email,
      first_name: first_name,
      last_name: last_name,
      password_hash: password,
      username: username,
    },
  });
}
