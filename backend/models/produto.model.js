import { Schema, model } from "mongoose";
import { type } from "os";

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
    subcategoria: {
      type: Schema.Types.ObjectId,
      ref: "Subcategoria",
      required: true,
    },
    destaque: {
      type: String,
      enum: ["0", "1", "2"],
      default: "0",
    },

    imagens: [
      {
        url: String,
        filename: String, // para facilitar a exclusão posterior
      },
    ],
    espTec: [{ type: Object, default: [] }],
  },
  {
    timestamps: true,
  }
);

const ProdutoModel = model("Produto", produtoSchema);

export default ProdutoModel;
