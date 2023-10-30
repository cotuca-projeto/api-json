export const port = process.env.PORT || 3000;
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import * as core from "express-serve-static-core";
import express from "express";

export function initConfig(app: core.Express) {
  if (!app) throw new Error("Missing app or express");

  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");
  app.use(express.static(path.join(__dirname, "..", "views")));
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  if (!process.env.SESSION_SECRET) throw new Error("Missing SESSION_SECRET");

  app.use(
    session({
      secret: `${process.env.SESSION_SECRET}`,
      resave: true,
      saveUninitialized: true,
    })
  );
  app.set("views", path.join(__dirname, "..", "views"));
}

export const general = {
  CACHE_DIR: path.join(__dirname, "..", "cache", "database.json"),
};
