import { logCreate } from "./logCreate";
import { DangerError } from "./DangerError";
import { WarningError } from "./WarningError";
import { BadRequestError } from "./BadRequestError";
import { Response } from "express";

export function handleError(error: any, app: Response) {
  if (error instanceof BadRequestError) {
    return app.status(400).json({
      status: 400,
      message: "Bad Request",
      error: error.message,
    });
  } else if (error instanceof WarningError) {
    console.warn(error);

    return app.status(400).json({
      status: 400,
      message: "Warning Error",
      error: error.message,
    });
  } else if (error instanceof DangerError) {
    console.error(error);

    logCreate(error);
    return app.status(400).json({
      status: 400,
      message: "Danger Error",
      error: error.message,
    });
  } else if (error.message === "not-authorized") {
    console.info(error);

    return app.status(401).json({
      status: 401,
      message: "Not authorized",
      error: error.message,
    });
  } else {
    console.error(error);

    logCreate(error);
    return app.status(400).json({
      status: 400,
      message: "Internal Error",
      error: error.message,
    });
  }
}
