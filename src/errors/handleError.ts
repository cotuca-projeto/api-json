import * as core from "express-serve-static-core";
import { logCreate } from "./logCreate";
import { DangerError } from "./DangerError";
import { WarningError } from "./WarningError";
import { InvalidParameterError } from "./InvalidParameterError";

export async function handleError(error: any, app: core.Express) {
  if (error instanceof InvalidParameterError) {
    app.render("Invalid Parameter", { error: error.message });
  } else if (error instanceof WarningError) {
    console.error(error);

    app.render("Warning error", { error: error.message });
  } else if (error instanceof DangerError) {
    console.error(error);

    logCreate(error);
    app.render("Danger error", { error: error.message });
  } else if (error.message === "not-authorized") {
    console.error(error);

    app.render("not authorized", {
      error: "Eu não tenho autorização para fazer isso!",
    });
  } else {
    console.error(error);

    logCreate(error);
    app.render("Internal error", { error: error.message });
  }
}
