import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAuth from "../middlewares/isAuth.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import UsuarioModel from "../models/usuario.model.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "media/profileImages/");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});
const router = express.Router();
const upload = multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } });
//Rota utilizada no frontend no arquivo Profile.js
router.post(
  "/upload",
  isAuth,
  attachCurrentUser,
  upload.single("image"),
  async (req, res) => {
    try {
      const loggedUser = req.currentUser;

      let editedUser;
      if (req.file) {
        if (loggedUser.profileImg.url !== "") {
          const __filename = fileURLToPath(import.meta.url);

          let __dirname = path.dirname(__filename);
          __dirname = path.dirname(__dirname);

          const imagePath = path.join(
            __dirname,
            "media/profileImages",
            path.basename(loggedUser.profileImg.url)
          );
          fs.unlink(imagePath, async (err) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                msg: "Falha ao deletar imagem do sistema de arquivos.",
              });
            }
          });
        }
        const imageUrl = `${process.env.NODE_URL}/images/${req.file.filename}`;
        editedUser = await UsuarioModel.findByIdAndUpdate(
          req.body.userId,
          {
            profileImg: {
              url: imageUrl,
              imageSize: +req.body.imageSize,
              position: JSON.parse(req.body.position),
            },
          },
          { runValidators: true, returnDocument: "after" }
        );
      } else {
        editedUser = await UsuarioModel.findByIdAndUpdate(
          req.body.userId,
          {
            profileImg: {
              url: loggedUser.profileImg.url,
              imageSize: +req.body.imageSize,
              position: JSON.parse(req.body.position),
            },
          },
          { runValidators: true, returnDocument: "after" }
        );
      }

      res.status(200).json(editedUser);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Erro interno no servidor" });
    }
  }
);

//Rota utilizada no frontend no arquivo Profile.js
router.delete("/excluir/:userId", isAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UsuarioModel.findById(userId).select({ profileImg: 1 });

    const __filename = fileURLToPath(import.meta.url);

    let __dirname = path.dirname(__filename);
    __dirname = path.dirname(__dirname);

    const imagePath = path.join(
      __dirname,
      "media/profileImages",
      path.basename(user.profileImg.url)
    );
    fs.unlink(imagePath, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ msg: "Falha ao deletar imagem do sistema de arquivos." });
      }
    });

    await UsuarioModel.findByIdAndUpdate(
      userId,
      {
        profileImg: {
          url: "",
          imageSize: 100,
          position: { x: 0, y: 0 },
        },
      },
      { runValidators: true }
    );

    res.json({ msg: "Arquivo deletado com sucesso" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
});

export default router;
