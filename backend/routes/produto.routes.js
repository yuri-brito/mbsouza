import express from "express";

import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

import isAdmin from "../middlewares/isAdmin.js";
import SubcategoriaModel from "../models/subcategoria.model.js";
import ProdutoModel from "../models/produto.model.js";

const router = express.Router();
router.post(
  "/create",
  isAuth,
  isAdmin,
  attachCurrentUser,
  async (request, response) => {
    try {
      const newProduto = await ProdutoModel.create({
        ...request.body,
      });
      return response.status(201).json(newProduto);
    } catch (error) {
      console.log(error);
      if (error.errorResponse && error.errorResponse.code === 11000) {
        return response.status(500).json({ msg: "Produto já existente." });
      }
      return response
        .status(500)
        .json({ msg: "Erro interno, tente mais tarde!" });
    }
  }
);
router.get(
  "/all",
  isAuth,
  isAdmin,
  attachCurrentUser,
  async (request, response) => {
    try {
      const loggedUser = request.currentUser;
      if (!loggedUser) {
        return response.status(404).json({ msg: "Usuário não encontrado!" });
      }

      let produto = await ProdutoModel.find().populate("subcategoria");

      return response.status(200).json(produto);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ msg: "Erro interno no servidor!" });
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

      let produto = await ProdutoModel.findById(id);
      if (!produto) {
        return response.status(404).json({ msg: "Produto não encontrado!" });
      }

      return response.status(200).json(produto);
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
      const editedProduto = await ProdutoModel.findByIdAndUpdate(
        id,
        { ...request.body },
        { returnDocument: "before", runValidators: true }
      );

      return response.status(200).json(editedProduto);
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

      const deletedProduto = await ProdutoModel.findByIdAndDelete(id);
      //tem que deletar a subcategoria de todos os produtos
      return response.status(200).json(deletedProduto);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ msg: "Erro interno no servidor!" });
    }
  }
);

export default router;
