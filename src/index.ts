import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import routerUsers from "./routes/users";
import _templateRouter from "./routes/_template";
import routerTasks from "./routes/task";
import indexRouter from "./routes/router";
import cors from "cors";

// Iniciado a porta do servidor
const port: number = (process.env.PORT as unknown as number) || 3001;

// Executando o express (API-RestFull)
const app = express();
app.use(cors());

// Iniciado a comunicação com o servidor
app.listen(port, () =>
  console.log(`Server running on ${port}! http://localhost:${port}`)
);

// Iniciado configurações do express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Iniciado configurações do ejs
app.set("view engine", "ejs");

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Handle the error
  console.error(err);

  // Send an appropriate response
  res.status(500).json({ error: "Internal Server Error" });
});

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
