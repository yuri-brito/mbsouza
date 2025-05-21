import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import ProdutoModel from "../models/produto.model.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "media/produtoImages/");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } });

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
__dirname = path.dirname(__dirname);

// ✅ Upload de várias imagens ao criar ou editar produto
router.post(
  "/upload/:produtoId",
  isAuth,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { produtoId } = req.params;

      const newImages = req.files.map((file) => ({
        url: `${process.env.NODE_URL}/produtoImages/${file.filename}`,
        filename: file.filename,
      }));

      const produto = await ProdutoModel.findByIdAndUpdate(
        produtoId,
        { $push: { imagens: { $each: newImages } } },
        { new: true }
      );

      res.status(200).json(produto);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Erro ao salvar imagens" });
    }
  }
);

// ✅ Remover uma imagem específica de um produto
router.delete("/remover/:produtoId/:filename", isAuth, async (req, res) => {
  try {
    const { produtoId, filename } = req.params;

    const produto = await ProdutoModel.findById(produtoId);
    if (!produto)
      return res.status(404).json({ msg: "Produto não encontrado" });

    const __filename = fileURLToPath(import.meta.url);
    let __dirname = path.dirname(__filename);
    __dirname = path.dirname(__dirname);

    const imagePath = path.join(__dirname, "media/produtoImages", filename);

    // await para garantir fluxo sequencial
    await fs.unlink(imagePath);

    const updated = await ProdutoModel.findByIdAndUpdate(
      produtoId,
      { $pull: { imagens: { filename } } },
      { new: true }
    );

    return res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Erro ao excluir imagem do produto" });
  }
});

// ✅ Deletar todas imagens quando produto for deletado
router.delete("/remover-todas/:produtoId", isAuth, async (req, res) => {
  try {
    const { produtoId } = req.params;

    const produto = await ProdutoModel.findById(produtoId);
    if (!produto)
      return res.status(404).json({ msg: "Produto não encontrado" });

    for (const img of produto.imagens) {
      const imagePath = path.join(
        __dirname,
        "media/produtoImages",
        img.filename
      );
      fs.unlink(imagePath, (err) => {
        if (err) console.log("Erro ao excluir imagem:", err.message);
      });
    }

    produto.imagens = [];
    await produto.save();

    res.status(200).json({ msg: "Todas as imagens foram removidas" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Erro ao remover todas as imagens" });
  }
});

export default router;
