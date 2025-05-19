import { Schema, model } from "mongoose";

const produtoImgSchema = new Schema(
  {
    url: { type: String, default: "" },
    imageSize: { type: Number, default: 100 },
    position: { type: Object, default: { x: 0, y: 0 } },
  },
  { _id: false }
);
const produtoSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    codigo: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    descricao: {
      type: String,
      required: true,
    },
    valor: {
      type: Number,
      required: true,
      default: 0,
    },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
    },
    subcategoria: {
      type: Schema.Types.ObjectId,
      ref: "Subcategoria",
    },

    produtoImgs: [{ type: produtoImgSchema, default: [] }],
    espTec: [{ type: Object, default: [] }],
  },
  {
    timestamps: true,
  }
);

const ProdutoModel = model("Produto", produtoSchema);

export default ProdutoModel;
