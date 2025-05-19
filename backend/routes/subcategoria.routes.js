import express from "express";

import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

import isAdmin from "../middlewares/isAdmin.js";
import SubcategoriaModel from "../models/subcategoria.model.js";

const router = express.Router();
router.post(
  "/create",
  isAuth,
  isAdmin,
  attachCurrentUser,
  async (request, response) => {
    try {
      const { password, email } = request.body;

      const newCategoria = await SubcategoriaModel.create({
        ...request.body,
      });
      return response.status(201).json(newCategoria);
    } catch (error) {
      console.log(error);
      if (error.errorResponse && error.errorResponse.code === 11000) {
        return response
          .status(500)
          .json({ msg: "Conta de usuário já existente." });
      }
      return response
        .status(500)
        .json({ msg: "Erro interno, tente mais tarde!" });
    }
  }
);

router.get(
  "/:id",
  isAuth,
  isAdmin,
  attachCurrentUser,
  async (request, response) => {
    try {
      const { id } = request.params;
      const loggedUser = request.currentUser;
      if (!loggedUser) {
        return response.status(404).json({ msg: "Usuário não encontrado!" });
      }

      let categoria = await SubcategoriaModel.findById(id);
      if (!categoria) {
        return response
          .status(404)
          .json({ msg: "Subcategoria não encontrado!" });
      }

      return response.status(200).json(categoria);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ msg: "Erro interno no servidor!" });
    }
  }
);

router.put(
  "/edit/:id",
  isAuth,
  isAdmin,
  attachCurrentUser,
  async (request, response) => {
    try {
      const { id } = request.params;
      const editedCategoria = await SubcategoriaModel.findByIdAndUpdate(
        id,
        { ...request.body },
        { returnDocument: "before", runValidators: true }
      );

      return response.status(200).json(editedCategoria);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ msg: "Erro interno no servidor!" });
    }
  }
);
router.delete(
  "/delete/:id",
  isAuth,
  isAdmin,
  attachCurrentUser,
  async (request, response) => {
    try {
      const { id } = request.params;

      const deletedCategoria = await SubcategoriaModel.findByIdAndDelete(id);
      //tem que deletar a subcategoria de todos os produtos
      return response.status(200).json(deletedCategoria);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ msg: "Erro interno no servidor!" });
    }
  }
);

export default router;
