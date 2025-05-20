import { Schema, model } from "mongoose";

const categoriaSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoriaModel = model("Categoria", categoriaSchema);

export default CategoriaModel;
