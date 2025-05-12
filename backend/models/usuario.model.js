import { Schema, model } from "mongoose";
const AddressSchema = new Schema(
  {
    logradouro: { type: String, default: "" },
    bairro: { type: String, default: "" },
    complemento: { type: String, default: "" },
    numero: { type: String, default: "" },
    cidade: { type: String, default: "" },
    estado: { type: String, default: "" },
    pais: { type: String, default: "" },
    cep: { type: String, default: "" },
  },
  { _id: false }
);
const profileImgSchema = new Schema(
  {
    url: { type: String, default: "" },
    imageSize: { type: Number, default: 100 },
    position: { type: Object, default: { x: 0, y: 0 } },
  },
  { _id: false }
);
const usuarioSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
    },
    active: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    senhaHash: {
      type: String,
      required: true,
    },
    celular: {
      type: String,
      trim: true,
      default: "",
      match: /^([0-9]){11}$/,
    },
    cpf: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      match: /^([0-9]){11}$/,
    },
    activationToken: { type: String },
    activationExpires: { type: Date },

    profileImg: { type: profileImgSchema, default: {} },
    endereco: { type: AddressSchema, default: {} },
    papel: {
      type: String,
      enum: ["usuario", "admin", "cadastrador"],
      default: "usuario",
    },
    codigoTrocaEmail: { type: String, default: "" },
    codigoTrocaCelular: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const UsuarioModel = model("Usuario", usuarioSchema);

export default UsuarioModel;
