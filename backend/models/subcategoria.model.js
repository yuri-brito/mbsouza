import { Schema, model } from "mongoose";

const subcategoriaSchema = new Schema(
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

const SubcategoriaModel = model("Subcategoria", subcategoriaSchema);

export default SubcategoriaModel;
