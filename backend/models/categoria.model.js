import { Schema, model } from "mongoose";

const categoriaSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CategoriaModel = model("Categoria", categoriaSchema);

export default CategoriaModel;
