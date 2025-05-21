import { Schema, model } from "mongoose";

const subcategoriaSchema = new Schema(
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
    categoria: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubcategoriaModel = model("Subcategoria", subcategoriaSchema);

export default SubcategoriaModel;
