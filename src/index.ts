import path from "path";
import express from "express";
import { port, initConfig } from "./config";
const router = express();

// Inicialização das configurações
initConfig(router);

// Inicialização das rotas
router.get("/", (req, res) => {
  res.render("index");
});

router.post("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public"));

  const { email, password } = req.body;
  res.render("login");
});

router.post("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public"));

  const { email, password } = req.body;
  res.render("register");
});

// Inicialização do servidor
router.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port} !`);
});
