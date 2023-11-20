import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import routerUsers from "./routes/users";
import _templateRouter from "./routes/_template";
import routerTasks from "./routes/task";
import indexRouter from "./routes/router";

// Iniciado a porta do servidor
const port: number = (process.env.PORT as unknown as number) || 3000;

// Executando o express (API-RestFull)
const app = express();

// Iniciado a comunicação com o servidor
app.listen(port, () =>
  console.log(`Server running on ${port}! http://localhost:${port}`)
);

// Iniciado configurações do express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Iniciado configurações do ejs
app.set("view engine", "ejs");

// Iniciado configurações de arquivos estático
app.set("views", path.join(__dirname, "public"));
app.use(express.static("public"));

// Iniciado as rotas
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ status: 200, message: "Ok!" });
  app.render("index.html");
});

app.use("/api/users", routerUsers);

app.use("/api", indexRouter);

app.use("/api/tasks", routerTasks);
