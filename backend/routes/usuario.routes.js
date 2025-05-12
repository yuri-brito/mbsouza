import express, { application } from "express";

import UsuarioModel from "../models/usuario.model.js";

import generateToken from "../config/jwt.config.js";
import bcrypt from "bcrypt";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import crypto from "crypto";
// import isAdmin from "../middlewares/isAdmin.js";
import nodemailer from "nodemailer";
const router = express.Router();
const rounds = 10;
function generateActivationToken() {
  return crypto.randomBytes(32).toString("hex");
}
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    secure: true,
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/create", async (request, response) => {
  try {
    const { password, email } = request.body;
    if (
      !password ||
      !password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!])[0-9a-zA-Z$*&@#!]{8,}$/
      )
    ) {
      return response
        .status(400)
        .json({ msg: "A senha não tem os requisitos de segurança!" });
    }
    const saltString = await bcrypt.genSalt(rounds);
    const hashPassword = await bcrypt.hash(password, saltString);
    const activationToken = generateActivationToken();

    const newUsuario = await UsuarioModel.create({
      ...request.body,
      senhaHash: hashPassword,
      activationToken: activationToken,
      activationExpires: Date.now() + 3600000,
    });
    // const editedUser = await UsuarioModel.findByIdAndUpdate(
    //   newUsuario._id.valueOf(),
    //   {
    //     profileImg: {},
    //   },
    //   { runValidators: true }
    // );
    delete newUsuario._doc.senha;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Ativação de conta em YOOFERTA",
      html: `<h1> Bem vindo ao nosso site.</h1>
      <p> Por favor, confirme seu email clicando no link abaixo:</p>
      <a href=${
        process.env.NODE_ENV === "production"
          ? process.env.PROD_URL
          : process.env.DEV_URL
      }/activate/${activationToken}/${newUsuario._id}>ATIVE SUA CONTA</a>
      <p>Após clicar, basta efetuar o login normalmente em nosso site.</p>`,
      headers: {
        "X-Priority": "3",
        "X-MSMail-Priority": "Normal",
        "X-Mailer": "Nodemailer",
      },
    };
    try {
      const res = await transporter.sendMail(mailOptions);
    } catch (error) {
      await UsuarioModel.findByIdAndDelete(newUsuario._id);

      if (error.message === "No recipients defined")
        return response
          .status(500)
          .json({ msg: "Por favor, revise o e-mail inserido." });
    }
    return response.status(201).json(newUsuario);
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
});
router.put("/recuperar", async (request, response) => {
  try {
    const { unique } = request.body;

    // const saltString = await bcrypt.genSalt(rounds);
    // const hashPassword = await bcrypt.hash(password, saltString);
    const activationToken = generateActivationToken();
    const userEmail = await UsuarioModel.findOne({
      email: unique,
    });
    const userCpf = await UsuarioModel.findOne({
      cpf: unique,
    });

    if (!userCpf && !userEmail) {
      return response
        .status(400)
        .json({ msg: "Email ou CPF não localizados!" });
    }
    // delete newUsuario._doc.senha;
    if (userCpf) {
      await UsuarioModel.findByIdAndUpdate(userCpf._id, {
        senhaHash: "",
        blocked: true,
        activationToken: activationToken,
        activationExpires: Date.now() + 3600000,
      });
    } else {
      await UsuarioModel.findByIdAndUpdate(userEmail._id, {
        senhaHash: "",
        blocked: true,
        activationToken: activationToken,
        activationExpires: Date.now() + 3600000,
      });
    }
    const mailOptions = {
      from: process.env.EMAIL,
      to: userCpf ? userCpf.email : userEmail.email,
      subject: "Recuperação de senha em YOOFERTA",
      html: `<h1> Vamos recuperar sua Senha.</h1>
      <p> Por favor, clique no link abaixo para alterar sua senha:</p>
      <a href=${
        process.env.NODE_ENV === "production"
          ? process.env.PROD_URL
          : process.env.DEV_URL
      }/rescue/${activationToken}/${
        userCpf ? userCpf._id : userEmail._id
      }>RECUPERAR SENHA</a>`,
      headers: {
        "X-Priority": "3",
        "X-MSMail-Priority": "Normal",
        "X-Mailer": "Nodemailer",
      },
    };
    try {
      const res = await transporter.sendMail(mailOptions);
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Erro interno, tente mais tarde!" });
    }
    return response.status(201).json({
      msg: `Um link para recuperação de senha foi enviado para o seu email ${
        userCpf ? userCpf.email.slice(0, 1) : userEmail.email.slice(0, 1)
      }.....@${
        userCpf ? userCpf.email.split("@")[1] : userEmail.email.split("@")[1]
      }`,
    });
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
});
router.put("/alterarEmail", isAuth, async (request, response) => {
  try {
    const { novoEmail, user, codigo } = request.body;

    if (novoEmail && !codigo) {
      const codigoTrocaEmail = Math.floor(100000 + Math.random() * 900000);
      await UsuarioModel.findByIdAndUpdate(user, {
        codigoTrocaEmail: codigoTrocaEmail,
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: novoEmail,
        subject: "Alteração de email em YOOFERTA",
        html: `<h1> Vamos alterar seu email.</h1>
        <p> Por favor, insira o código abaixo para verificação do email:</p>
        <h4>${codigoTrocaEmail}</h4>`,
        headers: {
          "X-Priority": "3",
          "X-MSMail-Priority": "Normal",
          "X-Mailer": "Nodemailer",
        },
      };
      try {
        const res = await transporter.sendMail(mailOptions);
      } catch (error) {
        return response
          .status(500)
          .json({ msg: "Erro interno, tente mais tarde!" });
      }
      return response.status(201).json({ msg: codigoTrocaEmail });
    } else if (novoEmail && codigo) {
      await UsuarioModel.findByIdAndUpdate(user, {
        codigoTrocaEmail: "",
        email: novoEmail,
      });
      return response
        .status(201)
        .json({ msg: "Alteração de email efetivada." });
    } else {
      await UsuarioModel.findByIdAndUpdate(user, { codigoTrocaEmail: "" });
      return response
        .status(201)
        .json({ msg: "Tempo de resposta expirado ou código não confere." });
    }
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
});
router.get("/activate-account/:activationToken/:userId", async (req, res) => {
  try {
    const { activationToken, userId } = req.params;
    const userCad = await UsuarioModel.findOne({ _id: userId });
    if (userCad.active) {
      return res.status(201).send({ nome: userCad.nome });
    }
    const user = await UsuarioModel.findOne({
      activationToken: activationToken,
      activationExpires: { $gt: Date.now() },
    });
    if (!user) {
      const userDel = await UsuarioModel.findByIdAndDelete(userId);
      return res.status(400).send({
        nome: null,
        msg: "Link de ativação inválido ou expirado.",
      });
    }
    await UsuarioModel.findByIdAndUpdate(user._id, {
      active: true,
      activationToken: null,
      activationExpires: null,
    });

    return res.status(201).send({ nome: user.nome });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro interno, tente mais tarde." });
  }
});
router.put("/rescue-account/:activationToken/:userId", async (req, res) => {
  try {
    const { activationToken, userId } = req.params;

    const { password } = req.body;
    const user = await UsuarioModel.findOne({
      activationToken: activationToken,
      activationExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).send({
        nome: null,
        msg: "Link para recuperação de senha inválido ou expirado.",
      });
    }

    const saltString = await bcrypt.genSalt(rounds);
    const hashPassword = await bcrypt.hash(password, saltString);

    await UsuarioModel.findByIdAndUpdate(user._id, {
      senhaHash: hashPassword,
      blocked: false,
      activationToken: null,
      activationExpires: null,
    });

    return res.status(201).send({ nome: user.nome });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro interno, tente mais tarde." });
  }
});
router.post("/login", async (request, response) => {
  try {
    const { unique, password } = request.body;

    const userMail = await UsuarioModel.findOne({ email: unique });
    const userCpf = await UsuarioModel.findOne({ cpf: unique });

    if (!userMail && !userCpf) {
      return response
        .status(401)
        .json({ msg: "Email, CPF ou senha inválidos!" });
    }

    if (userMail) {
      if (!userMail.active) {
        return response
          .status(401)
          .json({ msg: "Conta inativa, realize a ativação da conta." });
      }
      if (userMail.blocked) {
        return response
          .status(401)
          .json({ msg: "Conta bloqueada, recupere a senha." });
      }
      if (await bcrypt.compare(password, userMail.senhaHash)) {
        delete userMail._doc.senhaHash;
        const token = generateToken(userMail);
        return response.status(200).json({
          userData: userMail,
          token: token,
        });
      } else {
        return response
          .status(400)
          .json({ msg: "Email, CPF ou senha inválidos!" });
      }
    }
    if (userCpf) {
      if (!userCpf.active) {
        return response
          .status(401)
          .json({ msg: "Conta inativa, realize a ativação da conta." });
      }
      if (userCpf.blocked) {
        return response
          .status(401)
          .json({ msg: "Conta bloqueada, recupere a senha." });
      }
      if (await bcrypt.compare(password, userCpf.senhaHash)) {
        delete userCpf._doc.senhaHash;
        const token = generateToken(userCpf);
        return response.status(200).json({
          userData: userCpf,
          token: token,
        });
      } else {
        return response
          .status(400)
          .json({ msg: "Email, CPF ou senha inválidos!" });
      }
    }
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "Erro interno, tente mais tarde." });
  }
});
router.put("/bloquear/:unique", async (request, response) => {
  try {
    const { unique } = request.params;
    const userCpf = await UsuarioModel.findOne({ cpf: unique });
    const userEmail = await UsuarioModel.findOne({ email: unique });

    if (!userCpf && !userEmail) {
      return;
    }
    if (userCpf) {
      const editedUser = await UsuarioModel.findByIdAndUpdate(
        userCpf._id,
        { blocked: true },
        { runValidators: true }
      );
    }
    if (userEmail) {
      const editedUser = await UsuarioModel.findByIdAndUpdate(
        userEmail._id,
        { blocked: true },
        { runValidators: true }
      );
    }

    return response.status(200).json({ msg: "Conta inativa." });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "Erro interno, tente mais tarde!" });
  }
});

router.get("/:id", isAuth, attachCurrentUser, async (request, response) => {
  try {
    const { id } = request.params;
    const loggedUser = request.currentUser;
    if (!loggedUser) {
      return response.status(404).json({ msg: "Usuário não encontrado!" });
    }

    // if (loggedUser._id.valueOf() !== id && loggedUser.papel !== "admin") {
    //   console.log({
    //     data: new Date(),
    //     rota: "/usuario/:id",
    //     msg: `Usuário não administrador -> ${JSON.stringify(
    //       loggedUser._id
    //     )} tentou acessar a rota de profile`,
    //   });
    //   return response.status(401).json({ msg: "Usuário não autorizado!" });
    // }

    let usuario = await UsuarioModel.findById(id);
    if (!usuario) {
      return response.status(404).json({ msg: "Usuário não encontrado!" });
    }
    // console.log({
    //   data: new Date(),
    //   rota: `${request.originalUrl}`,
    //   metodo: `${request.method}`,
    //   msg: `Administrador ${JSON.stringify(loggedUser._id)}`,
    // });
    return response.status(200).json(usuario);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

router.put("/image", isAuth, attachCurrentUser, async (request, response) => {
  try {
    const { id } = request.params;
    const loggedUser = request.currentUser;

    const editedUser = await UsuarioModel.findByIdAndUpdate(
      loggedUser._id,
      { ...request.body },
      { returnDocument: "before", runValidators: true }
    );

    return response.status(200).json(editedUser);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

router.put("/edit", isAuth, attachCurrentUser, async (request, response) => {
  try {
    const loggedUser = request.currentUser;
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const editedUser = await UsuarioModel.findByIdAndUpdate(
      loggedUser._id,
      { ...request.body },
      { returnDocument: "before", runValidators: true }
    );

    return response.status(200).json(editedUser);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

router.post("/pagamento", async (request, response) => {
  try {
    let form;
    if (request.body.forma === "pix") {
      form = {
        reference_id: "ex-00001",
        customer: {
          name: "Jose da Silva",
          email: "email@test.com",
          tax_id: "12345678909",
          phones: [
            {
              country: "55",
              area: "11",
              number: "999999999",
              type: "MOBILE",
            },
          ],
        },
        items: [
          {
            name: "nome do item",
            quantity: 1,
            unit_amount: 500,
          },
        ],
        qr_codes: [
          {
            amount: {
              value: 500,
            },
            expiration_date: new Date(
              new Date().getDate() + 1,
              new Date().getMonth,
              new Date().getFullYear
            ),
          },
        ],
        shipping: {
          address: {
            street: "Avenida Brigadeiro Faria Lima",
            number: "1384",
            complement: "apto 12",
            locality: "Pinheiros",
            city: "São Paulo",
            region_code: "SP",
            country: "BRA",
            postal_code: "01452002",
          },
        },
        notification_urls: ["https://meusite.com/notificacoes"],
      };
    } else if (request.body.forma === "boleto") {
      form = {
        reference_id: "ex-00001",
        customer: {
          name: "Jose da Silva",
          email: "email@test.com",
          tax_id: "12345679891",
          phones: [
            {
              country: "55",
              area: "11",
              number: "999999999",
              type: "MOBILE",
            },
          ],
        },
        items: [
          {
            reference_id: "referencia do item",
            name: "nome do item",
            quantity: 1,
            unit_amount: 500,
          },
        ],
        shipping: {
          address: {
            street: "Avenida Brigadeiro Faria Lima",
            number: "1384",
            complement: "apto 12",
            locality: "Pinheiros",
            city: "São Paulo",
            region_code: "SP",
            country: "BRA",
            postal_code: "01452002",
          },
        },
        notification_urls: ["https://meusite.com/notificacoes"],
        charges: [
          {
            reference_id: "referencia da cobranca",
            description: "descricao da cobranca",
            amount: {
              value: 500,
              currency: "BRL",
            },
            payment_method: {
              type: "BOLETO",
              boleto: {
                due_date: "2024-07-20",
                instruction_lines: {
                  line_1: "Pagamento processado para DESC Fatura",
                  line_2: "Via PagSeguro",
                },
                holder: {
                  name: "Jose da Silva",
                  tax_id: "12345679891",
                  email: "jose@email.com",
                  address: {
                    country: "Brasil",
                    region: "São Paulo",
                    region_code: "SP",
                    city: "Sao Paulo",
                    postal_code: "01452002",
                    street: "Avenida Brigadeiro Faria Lima",
                    number: "1384",
                    locality: "Pinheiros",
                  },
                },
              },
            },
          },
        ],
      };
    } else {
      form = {
        reference_id: "ex-00001",
        customer: {
          name: "Jose da Silva",
          email: "email@test.com",
          tax_id: "12345678909",
          phones: [
            {
              country: "55",
              area: "11",
              number: "999999999",
              type: "MOBILE",
            },
          ],
        },
        items: [
          {
            reference_id: "referencia do item",
            name: "nome do item",
            quantity: 1,
            unit_amount: 500,
          },
        ],
        shipping: {
          address: {
            street: "Avenida Brigadeiro Faria Lima",
            number: "1384",
            complement: "apto 12",
            locality: "Pinheiros",
            city: "São Paulo",
            region_code: "SP",
            country: "BRA",
            postal_code: "01452002",
          },
        },
        notification_urls: ["https://meusite.com/notificacoes"],
        charges: [
          {
            reference_id: "referencia da cobranca",
            description: "descricao da cobranca",
            amount: {
              value: 500,
              currency: "BRL",
            },
            payment_method: {
              type: "CREDIT_CARD",
              installments: 1,
              capture: true,
              card: {
                encrypted: request.body.cartao.encrypt,
                store: false,
              },
              holder: {
                name: "Jose da Silva",
                tax_id: "65544332211",
              },
            },
          },
        ],
      };
    }
    const options = {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        accept: "*/*",
        Authorization:
          "Bearer 706a6e5e-d31f-438b-a445-0a174f05691f3e6289534960a7725fc7b49063daf61953ad-5edd-4177-b7ab-c9928a713aa1",
        "content-type": "application/json",
      },
    };
    const res = await fetch(
      "https://sandbox.api.pagseguro.com/orders",
      options
    );

    const data = await res.json();

    return response.status(201).json(data);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "Erro interno, tente mais tarde!" });
  }
});

export default router;
