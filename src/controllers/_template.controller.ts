import { Request, Response } from "express";

export const _TemplateTest = {
  test: (req: Request, res: Response) => {
    return res.status(200).json({ status: 200, message: "Ok!" });
  },
};
