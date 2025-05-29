import { useEffect, useRef, useState } from "react";

import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import "../../components/NavBar/NavBar.css";
import "../Home/Home.css";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import api from "../../api/api";
import toast from "react-hot-toast";
import CustomToast from "../../components/CustomToast";
function ContatoPage() {
  const { theme } = useContext(AuthContext);

  const [form, setForm] = useState({
    nome: "",
    assunto: "",
    email: "",
    telefone: "",
    msg: "",
  });

  const [showActiveMsg, setShowActiveMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nomeValid, setNomeValid] = useState();
  const [emailValid, setEmailValid] = useState();
  const [msgValid, setMsgValid] = useState();
  const [emailInvalidMsg, setEmailInvalidMsg] = useState("");
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "nome") {
      if (e.target.value === "") {
        if (nomeValid === true) {
          setNomeValid(false);
        }
      } else {
        if (nomeValid === false) {
          setNomeValid(true);
        }
      }
    }
    if (e.target.name === "msg") {
      if (e.target.value === "") {
        if (msgValid === true) {
          setMsgValid(false);
        }
      } else {
        if (msgValid === false) {
          setMsgValid(true);
        }
      }
    }

    if (e.target.name === "email") {
      if (e.target.value === "") {
        if (emailValid === true) {
          setEmailValid(false);
        }
      } else {
        if (
          !e.target.value.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm)
        ) {
          setEmailValid(false);
          setEmailInvalidMsg("Insira um e-mail válido.");
          return;
        } else {
          setEmailValid(true);
        }
      }
    }
  };
  const handleSubmit = async (e) => {
    try {
      setIsLoading(true);
      const res = await api.post("/usuario/enviar-email", form);
      console.log(res.data);
      setForm({
        nome: "",
        assunto: "",
        email: "",
        telefone: "",
        msg: "",
      });
      toast.success(
        (t) => <CustomToast t={t} message={`${res.data}`} duration={5000} />,
        {
          style: {
            borderRadius: "10px",
            border: "1px solid #62d346ff",
            color: "black",
            fontWeight: "400",
          },
        }
      );
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.msg || "Erro ao salvar produto";
      toast.error((t) => <CustomToast t={t} message={msg} duration={5000} />, {
        style: {
          borderRadius: "10px",
          border: "1px solid #ff4c4cff",
          color: "black",
          fontWeight: "400",
        },
      });
      if (msg === "Sua sessão expirou, realize novo login.") {
        setLoggedUser(null);
        localStorage.clear();
        navigate("/");
      }
    }
  };
  return (
    <div
      style={{
        marginBottom: 100,
        position: "relative",
        animation: "fadein 1.5s",
      }}
    >
      <Row
        className="d-flex justify-content-center p-0"
        style={{
          backgroundColor:
            theme === "dark" ? "rgb(0, 63, 106)" : "rgb(247, 113, 34)",
          height: "auto",

          marginInline: 0,
          color: "white",
          marginBottom: 50,
        }}
      >
        <h2 className="my-4 titulos">CONTATO</h2>
      </Row>
      <Container>
        <Row className="d-flex justify-content-center p-0 m-0">
          <Col xs={12} md={6}>
            <Row className="justify-content-center subtitulo mb-4">
              Solicite um orçamento
            </Row>
            <Container>
              <FloatingLabel
                label="Nome completo"
                className="mb-3 labelCriarConta"
                style={{ fontSize: 12 }}
              >
                <Form.Control
                  required
                  type="text"
                  placeholder=""
                  name="nome"
                  value={form.nome}
                  style={{
                    height: 30,
                    fontSize: 13,
                    minHeight: 35,
                  }}
                  onChange={handleChange}
                  isValid={nomeValid}
                  isInvalid={nomeValid === false}
                />
                <Form.Control.Feedback type="invalid">
                  Insira o seu nome.
                </Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel
                label="Endereço de email"
                className="mb-3 labelCriarConta"
                style={{ fontSize: 12 }}
              >
                <Form.Control
                  required
                  type="email"
                  placeholder=""
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  style={{
                    height: 30,
                    fontSize: 13,
                    minHeight: 35,
                  }}
                  isValid={emailValid}
                  isInvalid={emailValid === false}
                />
                <Form.Control.Feedback type="invalid">
                  {emailInvalidMsg}
                </Form.Control.Feedback>
                <Form.Control.Feedback type="valid">
                  E-mail válido.
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel
                label="Telefone"
                className="mb-3 labelCriarConta"
                style={{ fontSize: 12 }}
              >
                <Form.Control
                  required
                  type="text"
                  placeholder=""
                  name="telefone"
                  value={form.telefone}
                  style={{
                    height: 30,
                    fontSize: 13,
                    minHeight: 35,
                  }}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Insira o seu Telefone.
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel
                label="Assunto"
                className="mb-3 labelCriarConta"
                style={{ fontSize: 12 }}
              >
                <Form.Control
                  required
                  type="text"
                  placeholder=""
                  name="assunto"
                  value={form.assunto}
                  style={{
                    height: 30,
                    fontSize: 13,
                    minHeight: 35,
                  }}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Insira o assunto.
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel
                label="Mensagem"
                className="mb-3 labelCriarConta"
                style={{ fontSize: 12 }}
              >
                <Form.Control
                  required
                  as="textarea"
                  placeholder=""
                  name="msg"
                  value={form.msg}
                  style={{
                    // height: 30,
                    fontSize: 13,
                    minHeight: 80,
                  }}
                  onChange={handleChange}
                  isValid={msgValid}
                  isInvalid={msgValid === false}
                />
                <Form.Control.Feedback type="invalid">
                  Insira o sua mensagem.
                </Form.Control.Feedback>
              </FloatingLabel>
              <Button
                size="sm"
                style={{
                  width: "30%",
                  maxWidth: 120,
                  fontSize: 12,
                  padding: 2,
                  boxShadow:
                    " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                }}
                onMouseDown={(e) => {
                  e.target.style.boxShadow = "none";
                }}
                onMouseUp={(e) => {
                  e.target.style.boxShadow =
                    " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
                }}
                variant="primary"
              >
                {isLoading ? (
                  <Spinner size="sm"></Spinner>
                ) : (
                  <>
                    <i
                      className="bi bi-envelope-arrow-up icon"
                      style={{ fontWeight: "bold" }}
                    ></i>{" "}
                    <i
                      className="contatoZap"
                      style={{
                        fontStyle: "normal",
                        fontWeight: 450,
                      }}
                      onClick={handleSubmit}
                    >
                      {"Enviar"}
                    </i>
                  </>
                )}
              </Button>
            </Container>
          </Col>
          <Col
            xs={12}
            md={6}
            className="px-3 mt-5 mt-md-0 "
            style={{
              border: "1px solid #dee2e6",
              height: 140,
              maxWidth: "90%",
              margin: "0 auto",
              borderRadius: 4,
              padding: 6,
            }}
          >
            <Row className="justify-content-center subtitulo m-0 mb-3">
              Informações de contato
            </Row>
            <Row className="textos justify-content-center m-0 mb-2">
              Entre em contato por e-mail ou Whatsapp
            </Row>
            <Row className="justify-content-center m-0 p-0">
              <Row className="textos justify-content-start m-0">
                <b className="col-auto p-0 pe-1">Whatsapp:</b>{" "}
                <i className="col-auto p-0 ps-1">(21) 96999-1819</i>
              </Row>
              <Row className="textos justify-content-start m-0 flex-nowrap">
                <b className="col-auto p-0 pe-1">Email:</b>{" "}
                <i className="col-auto p-0 ps-1 ">
                  mbs.tratamentotermico@gmail.com
                </i>
              </Row>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ContatoPage;
