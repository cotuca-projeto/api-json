import { Request, Response, Router } from "express";

const _templateRouter = Router();

_templateRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: 200, message: "Ok!" });
});

_templateRouter.get("/query", async (req: Request, res: Response) => {
  console.log({ ...req.query });

  res.status(200).json({ status: 200, message: "Ok!", log: { ...req.query } });
});

export default _templateRouter;
