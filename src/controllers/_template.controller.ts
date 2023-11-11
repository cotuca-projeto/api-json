import { Request, Response } from "express";

export const controllerTest = {
  test: (req: Request, res: Response) => {
    return res.status(200).json({ status: 200, message: "Ok!" });
  },
};
