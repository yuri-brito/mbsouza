import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import usuarioRouter from "./routes/usuario.routes.js";
import categoriaRouter from "./routes/categoria.routes.js";
import subcategoriaRouter from "./routes/subcategoria.routes.js";
import produtoRouter from "./routes/produto.routes.js";
import compression from "compression";
import dbConnect from "./config/db.config.js";
import profileImgRouter from "./routes/profileImg.routes.js";
import produtoImgRouter from "./routes/produtoImg.routes.js";
import { fileURLToPath } from "url";
import path from "path";
dotenv.config();
dbConnect();
const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use("/usuario", usuarioRouter);
app.use("/categoria", categoriaRouter);
app.use("/subcategoria", subcategoriaRouter);
app.use("/produto", produtoRouter);
app.use("/profileImg", profileImgRouter);
app.use("/produtoImg", produtoImgRouter);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "media/profileImages")));
app.use(
  "/produtoImages",
  express.static(path.join(__dirname, "media/produtoImages"))
);

app.listen(Number(process.env.PORT), () => {
  console.log(`server up and running on port ${process.env.PORT}`);
});
