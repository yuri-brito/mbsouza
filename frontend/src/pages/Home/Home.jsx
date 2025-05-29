import { useEffect, useRef, useState } from "react";
import CarrosselHome from "../../components/CarrosselHome/CarrosselHome";
import NavBar from "../../components/NavBar/NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Carousel,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Confetti from "react-confetti";
import { SpinnerDotted } from "spinners-react";
import api from "../../api/api";
import ProfilePage from "../ProfilePage/ProfilePage";
import Footer from "../../components/Footer/Footer";
import "./Home.css";
import Whatsapp from "../../components/Whatsapp";
import EmpresaPage from "../Empresa/EmpresaPage";
import teste from "../../assets/teste.png";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import CarouselLogos from "./CarouselLogos";
function Home({ produtos }) {
  const { state, pathname } = useLocation();
  const { theme } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModalBoasVindas, setShowModalBoasVindas] = useState(false);
  const [showModalRecuperacaoSenha, setShowModalRecuperacaoSenha] =
    useState(false);
  const [form, setForm] = useState({
    user: "",
    activationToken: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (state && state.origin === "Activate") {
      setShowModalBoasVindas(true);
    }
    if (state && state.origin === "Rescue") {
      setShowModalRecuperacaoSenha(true);
      setForm({
        ...form,
        activationToken: state.activationToken,
        user: state.user,
      });
    }
  }, []);
  const handleClose = () => {
    setShowModalBoasVindas(false);
  };
  const handleCloseRecuperar = () => {
    setForm({
      password: "",
      confirmPassword: "",
    });

    setSenhaValid();
    setSenhaInvalidMsg("");
    setConfirmSenhaValid();
    setConfirmSenhaInvalidMsg("");
    setHidepasswordConfirm(true);
    setHidepassword(true);
    setShowActiveMsg("");
    setShowErrorMsg("");
    setShowModalRecuperacaoSenha(false);
  };
  const [senhaValid, setSenhaValid] = useState();
  const [senhaInvalidMsg, setSenhaInvalidMsg] = useState("");
  const [confirmSenhaValid, setConfirmSenhaValid] = useState();
  const [confirmSenhaInvalidMsg, setConfirmSenhaInvalidMsg] = useState("");
  const [hidePassword, setHidepassword] = useState(true);
  const [hidePasswordConfirm, setHidepasswordConfirm] = useState(true);
  const [showActiveMsg, setShowActiveMsg] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState("");
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      if (e.target.value === "") {
        if (senhaValid === true) {
          setSenhaValid(false);
          setSenhaInvalidMsg("Insira uma senha.");
        }
      } else {
        setSenhaValid();
        setSenhaInvalidMsg("");
        if (
          e.target.value.match(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!])[0-9a-zA-Z$*&@#!]{8,}$/
          )
        ) {
          setSenhaValid(true);
          setSenhaInvalidMsg("");
        } else {
          setSenhaValid(false);
          setSenhaInvalidMsg("Insira uma senha segura.");
        }
      }
      if (!form.confirmPassword || e.target.value !== form.confirmPassword) {
        setConfirmSenhaValid(false);
        setConfirmSenhaInvalidMsg("As senhas não conferem.");
      } else {
        setConfirmSenhaValid(true);
        setConfirmSenhaInvalidMsg("");
      }
    }
    if (e.target.name === "confirmPassword") {
      if (e.target.value === "") {
        if (confirmSenhaValid === true) {
          setConfirmSenhaValid(false);
        }
        setConfirmSenhaInvalidMsg("Insira uma confirmação.");
      } else {
        if (form.password && form.password === e.target.value) {
          setConfirmSenhaValid(true);
          setConfirmSenhaInvalidMsg("");
        } else {
          setConfirmSenhaValid(false);
          setConfirmSenhaInvalidMsg("As senhas não conferem.");
        }
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      setIsLoading(true);
      const res = await api.put(
        `/usuario/rescue-account/${form.activationToken}/${form.user}`,
        form
      );

      if (res.status === 201) {
        setShowActiveMsg("Senha alterada com sucesso!");
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setShowErrorMsg(error.response.data.msg);
      setIsLoading(false);
    }
  };
  const [produtosDestaque, setProdutosDestaque] = useState([]);
  useEffect(() => {
    setProdutosDestaque(
      produtos.filter((p) => {
        return p.destaque === "1";
      })
    );
  }, [produtos]);
  return (
    <div
      style={{
        position: "relative",
        animation: "fadein 1.5s",
        marginBottom: 100,
      }}
    >
      <Modal onHide={handleClose} show={showModalBoasVindas}>
        <Modal.Header closeButton className="headerModalCadastro">
          {state && state.status === "conta ativada" ? (
            <>
              <Confetti
                width={"500%"}
                wind={0}
                numberOfPieces={200}
                tweenDuration={7000}
                recycle={false}
              />
              {"Seja Bem-vinda(o)"}
            </>
          ) : (
            <>Erro na Ativação</>
          )}
        </Modal.Header>
        <Modal.Body
          style={{ fontSize: 12 }}
          className="modalBodyActiveFeedBack"
        >
          {state && state.status === "conta ativada" ? (
            <>
              {`Prezada(o) ${state.nome}, sua conta foi ativada com sucesso. Agora, você pode realizar o
          login em nosso site.`}
            </>
          ) : (
            <>
              {`Prezado, houve um erro na ativação. ${
                state && state.msg
              } Por favor, realize um novo cadastro.`}
            </>
          )}
        </Modal.Body>
      </Modal>
      <Modal onHide={handleCloseRecuperar} show={showModalRecuperacaoSenha}>
        <Modal.Header closeButton className="headerModalCadastro">
          {isLoading ? <>Alterando senha...</> : <>Insira a nova senha</>}
        </Modal.Header>
        <Form>
          {isLoading ? (
            <Row className="d-flex justify-content-center m-0 my-4">
              <SpinnerDotted
                size={67}
                thickness={106}
                speed={141}
                color="#36ad47"
              />
            </Row>
          ) : (
            <>
              {!showActiveMsg && !showErrorMsg && (
                <>
                  <Modal.Body>
                    <Container>
                      <Row>
                        <Col className="col-6 " style={{ minWidth: 200 }}>
                          <FloatingLabel
                            label="Insira uma senha"
                            className="mb-3 labelCriarConta "
                            style={{ fontSize: 12 }}
                          >
                            <Form.Control
                              required
                              type={
                                hidePassword && form.password !== ""
                                  ? "password"
                                  : "text"
                              }
                              placeholder=""
                              name="password"
                              value={form.password}
                              onChange={handleChange}
                              style={{ paddingRight: 50 }}
                              isValid={senhaValid === true}
                              isInvalid={senhaValid === false}
                            />
                            <i
                              className={
                                hidePassword
                                  ? "bi bi-eye-slash togglePassword"
                                  : "bi bi-eye togglePassword"
                              }
                              style={{
                                position: "absolute",
                                top: 3,
                                right: 30,
                                fontSize: 20,
                                color:
                                  senhaValid === true
                                    ? "var(--bs-form-valid-color)"
                                    : senhaValid === false &&
                                      "var(--bs-form-invalid-color)",
                              }}
                              onClick={(e) => {
                                setHidepassword(!hidePassword);
                              }}
                            ></i>
                            <Form.Control.Feedback type="invalid">
                              {senhaInvalidMsg}
                            </Form.Control.Feedback>
                            <div
                              className="regrasSenha"
                              style={{ fontSize: 10 }}
                            >
                              <Col>
                                <Row
                                  className="m-0 ms-2 mt-1 "
                                  style={{
                                    color:
                                      form.password &&
                                      form.password.match(/([A-Z])/)
                                        ? "var(--bs-form-valid-color)"
                                        : form.password &&
                                          !form.password.match(/([A-Z])/) &&
                                          "var(--bs-form-invalid-color)",
                                  }}
                                >
                                  <Col
                                    xs="auto"
                                    className="d-flex justify-content-start p-0 "
                                  >
                                    <i style={{ textAlign: "left" }}>
                                      - Letra maiúscula
                                    </i>
                                  </Col>
                                  <Col
                                    xs="auto"
                                    className="d-flex justify-content-start align-items-bottom p-0 "
                                  >
                                    {form.password &&
                                    form.password.match(/([A-Z])/) ? (
                                      <i className="bi bi-check"></i>
                                    ) : (
                                      form.password &&
                                      !form.password.match(/([A-Z])/) && (
                                        <i className="bi bi-x"></i>
                                      )
                                    )}
                                  </Col>
                                </Row>
                                <Row
                                  className="m-0 ms-2 mt-1 "
                                  style={{
                                    color:
                                      form.password &&
                                      form.password.match(/([a-z])/)
                                        ? "var(--bs-form-valid-color)"
                                        : form.password &&
                                          !form.password.match(/([a-z])/) &&
                                          "var(--bs-form-invalid-color)",
                                  }}
                                >
                                  <Col
                                    xs="auto"
                                    className="d-flex justify-content-start p-0 "
                                  >
                                    <i style={{ textAlign: "left" }}>
                                      - Letra minúscula
                                    </i>
                                  </Col>
                                  <Col
                                    xs="auto"
                                    className="d-flex justify-content-start align-items-bottom p-0 "
                                  >
                                    {form.password &&
                                    form.password.match(/([a-z])/) ? (
                                      <i className="bi bi-check"></i>
                                    ) : (
                                      form.password &&
                                      !form.password.match(/([a-z])/) && (
                                        <i className="bi bi-x"></i>
                                      )
                                    )}
                                  </Col>
                                </Row>
                                <Row
                                  className="m-0 ms-2 mt-1 "
                                  style={{
                                    color:
                                      form.password &&
                                      form.password.match(/([\d])/)
                                        ? "var(--bs-form-valid-color)"
                                        : form.password &&
                                          !form.password.match(/([\d])/) &&
                                          "var(--bs-form-invalid-color)",
                                  }}
                                >
                                  <Col
                                    xs="auto"
                                    className="d-flex justify-content-start p-0 "
                                  >
                                    <i style={{ textAlign: "left" }}>
                                      - Número
                                    </i>
                                  </Col>
                                  <Col
                                    xs="auto"
                                    className="d-flex justify-content-start align-items-bottom p-0 "
                                  >
                                    {form.password &&
                                    form.password.match(/([\d])/) ? (
                                      <i className="bi bi-check"></i>
                                    ) : (
                                      form.password &&
                                      !form.password.match(/([\d])/) && (
                                        <i className="bi bi-x"></i>
                                      )
                                    )}
                                  </Col>
                                </Row>

                                <Row
                                  className="m-0 ms-2 mt-1 "
                                  style={{
                                    color:
                                      form.password &&
                                      form.password.match(/([$*&@#!])/)
                                        ? "var(--bs-form-valid-color)"
                                        : form.password &&
                                          !form.password.match(/([$*&@#!])/) &&
                                          "var(--bs-form-invalid-color)",
                                  }}
                                >
                                  <Col
                                    xs="auto"
                                    className="d-flex justify-content-start p-0 "
                                  >
                                    <i style={{ textAlign: "left" }}>
                                      - Caracter especial $*&@#!
                                    </i>
                                  </Col>
                                  <Col
                                    xs="auto"
                                    className="d-flex justify-content-start align-items-bottom p-0 "
                                  >
                                    {form.password &&
                                    form.password.match(/([$*&@#!])/) ? (
                                      <i className="bi bi-check"></i>
                                    ) : (
                                      form.password &&
                                      !form.password.match(/([$*&@#!])/) && (
                                        <i className="bi bi-x"></i>
                                      )
                                    )}
                                  </Col>
                                </Row>

                                <Row
                                  className="m-0 ms-2 mt-1 "
                                  style={{
                                    color:
                                      form.password &&
                                      form.password.match(
                                        /([0-9a-zA-Z$*&@#!]{8,}$)/
                                      )
                                        ? "var(--bs-form-valid-color)"
                                        : form.password &&
                                          !form.password.match(
                                            /([0-9a-zA-Z$*&@#!]{8,}$)/
                                          ) &&
                                          "var(--bs-form-invalid-color)",
                                  }}
                                >
                                  <Col
                                    xs="auto"
                                    className="d-flex justify-content-start p-0 "
                                  >
                                    <i
                                      style={{
                                        textAlign: "left",
                                      }}
                                    >
                                      - Mínimo 8 dígitos
                                    </i>
                                  </Col>
                                  <Col
                                    xs="auto"
                                    className="d-flex justify-content-start align-items-bottom p-0 "
                                  >
                                    {form.password &&
                                    form.password.match(
                                      /([0-9a-zA-Z$*&@#!]{8,}$)/
                                    ) ? (
                                      <i className="bi bi-check"></i>
                                    ) : (
                                      form.password &&
                                      !form.password.match(
                                        /([0-9a-zA-Z$*&@#!]{8,}$)/
                                      ) && <i className="bi bi-x"></i>
                                    )}
                                  </Col>
                                </Row>
                              </Col>
                            </div>
                          </FloatingLabel>
                        </Col>
                        <Col className="col-6" style={{ minWidth: 200 }}>
                          <FloatingLabel
                            label="Confirme a senha"
                            className="mb-3 labelCriarConta"
                            style={{ fontSize: 12 }}
                          >
                            <Form.Control
                              required
                              type={
                                hidePasswordConfirm &&
                                form.confirmPassword !== ""
                                  ? "password"
                                  : "text"
                              }
                              placeholder=""
                              name="confirmPassword"
                              value={form.confirmPassword}
                              onChange={handleChange}
                              style={{ paddingRight: 50 }}
                              isValid={confirmSenhaValid === true}
                              isInvalid={confirmSenhaValid === false}
                            />
                            <i
                              className={
                                hidePasswordConfirm
                                  ? "bi bi-eye-slash togglePassword"
                                  : "bi bi-eye togglePassword"
                              }
                              style={{
                                position: "absolute",
                                top: 3,
                                right: 30,
                                fontSize: 20,
                                color:
                                  confirmSenhaValid === true
                                    ? "var(--bs-form-valid-color)"
                                    : confirmSenhaValid === false &&
                                      "var(--bs-form-invalid-color)",
                              }}
                              onClick={(e) => {
                                setHidepasswordConfirm(!hidePasswordConfirm);
                              }}
                            ></i>
                            <Form.Control.Feedback type="invalid">
                              {confirmSenhaInvalidMsg}
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">
                              As senhas conferem.
                            </Form.Control.Feedback>
                          </FloatingLabel>
                        </Col>
                      </Row>
                    </Container>
                  </Modal.Body>
                  <Modal.Footer style={{ justifyContent: "center" }}>
                    <Row className="d-flex justify-content-evenly w-100 ">
                      <Col xs="auto" className="mb-2">
                        <Button
                          className="cadastroButtons"
                          variant="success"
                          size="sm"
                          type="submit"
                          style={{ fontSize: 11 }}
                          onClick={handleSubmit}
                          disabled={
                            senhaValid === false || confirmSenhaValid === false
                          }
                        >
                          <i className="bi bi-person-plus"></i> Cadastrar
                        </Button>
                      </Col>
                      <Col xs="auto" className="mb-2">
                        <Button
                          className="cadastroButtons"
                          variant="secondary"
                          size="sm"
                          type="submit"
                          style={{ fontSize: 11 }}
                          onClick={handleClose}
                        >
                          <i className="bi bi-x-circle"></i> Cancelar
                        </Button>
                      </Col>
                    </Row>
                  </Modal.Footer>
                </>
              )}
              {showActiveMsg && (
                <Row
                  as={"div"}
                  className="d-flex justify-content-center align-items-center animate__animated animate__fadeIn mb-2"
                  style={{ marginInline: "auto" }}
                >
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 130.2 130.2"
                    style={{ width: 50, height: 50 }}
                  >
                    <circle
                      class="path circle"
                      fill="none"
                      stroke="var(--bs-form-valid-color)"
                      stroke-width="10"
                      stroke-miterlimit="10"
                      cx="65.1"
                      cy="65.1"
                      r="60.1"
                    />
                    <polyline
                      class="path check"
                      fill="none"
                      stroke="var(--bs-form-valid-color)"
                      stroke-width="10"
                      stroke-linecap="round"
                      stroke-miterlimit="10"
                      points="100.2,40.2 51.5,88.8 29.8,67.5 "
                    />
                  </svg>

                  <b
                    className="bMsgError"
                    style={{
                      fontSize: 12,
                      paddingInline: 10,
                      color: "var(--bs-form-valid-color)",
                      textAlign: "center",
                    }}
                  >
                    {showActiveMsg}
                  </b>
                </Row>
              )}
              {showErrorMsg && (
                <Row
                  as={"p"}
                  className="d-flex justify-content-center align-items-center animate__animated animate__fadeIn m-0 p-0 mb-2"
                  style={{ marginInline: "auto" }}
                >
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 130.2 130.2"
                    style={{ width: 50, height: 50 }}
                  >
                    <circle
                      class="path circle"
                      fill="none"
                      stroke="var(--bs-form-invalid-color)"
                      stroke-width="10"
                      stroke-miterlimit="10"
                      cx="65.1"
                      cy="65.1"
                      r="60.1"
                    />
                    <line
                      class="path line"
                      fill="none"
                      stroke="var(--bs-form-invalid-color)"
                      stroke-width="10"
                      stroke-linecap="round"
                      stroke-miterlimit="10"
                      x1="34.4"
                      y1="37.9"
                      x2="95.8"
                      y2="92.3"
                    />
                    <line
                      class="path line"
                      fill="none"
                      stroke="var(--bs-form-invalid-color)"
                      stroke-width="10"
                      stroke-linecap="round"
                      stroke-miterlimit="10"
                      x1="95.8"
                      y1="38"
                      x2="34.4"
                      y2="92.2"
                    />
                  </svg>{" "}
                  <b
                    style={{
                      fontSize: 12,
                      paddingInline: 10,
                      color: "var(--bs-form-invalid-color)",
                      textAlign: "center",
                    }}
                  >
                    {showErrorMsg}
                  </b>
                </Row>
              )}
            </>
          )}
        </Form>
      </Modal>

      <CarrosselHome theme={theme} produtos={produtos} />

      <Row
        className="d-flex justify-content-center"
        style={{
          backgroundColor:
            theme === "dark" ? "rgb(0, 63, 106)" : "rgb(247, 113, 34)",
          height: "auto",
          marginTop: 100,
          marginInline: 0,
          color: "white",
          marginBottom: 50,
          padding: "30px 16px",
        }}
      >
        <Col xs={12}>
          <h2 className="mt-4 mb-4 titulos">
            MB Souza é garantia de qualidade em Aquecedores e Boilers no Rio de
            Janeiro
          </h2>
          <p className="textos" style={{ maxWidth: "600px", margin: "0 auto" }}>
            A MB Souza é sinônimo de confiança e experiência em instalações de
            aquecedores e boilers. Com um histórico de mais de 25 anos, sempre
            estivemos na vanguarda em soluções aquecedoras com os princípios
            técnicos de excelência, segurança e eficiência.
          </p>
          <div
            className="mt-3"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <a
              href="https://wa.me/5521969991819?text=Ol%C3%A1%2C%20estou%20interessado%20em%20seus%20produtos."
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button
                variant="light"
                style={{ width: "100%", maxWidth: 200, fontSize: 14 }}
              >
                <i
                  className="bi bi-whatsapp icon"
                  style={{ fontWeight: "bold" }}
                ></i>{" "}
                <i
                  className="contatoZap"
                  style={{
                    fontStyle: "normal",
                    fontWeight: 450,
                  }}
                >
                  {"Whatsapp"}
                </i>
              </Button>
            </a>
          </div>
        </Col>
      </Row>
      <Row className="mt-4 mb-5 mx-0">
        <h2 className="titulos">Nossos Destaques</h2>
        <p className="textos mb-5">
          Separamos produtos exclusivos pensando em você.
        </p>
        <Container>
          <Row className="d-flex flex-wrap justify-content-center gap-5">
            {produtosDestaque.map((p) => {
              return (
                <Col className="col-auto d-flex justify-content-center">
                  <Card
                    bg={theme === "dark" ? "dark" : "light"}
                    className="p-0 larguraCard"
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    }}
                  >
                    {/* <Card.Header className="titulos">
                    {p.subcategoria.categoria.nome}
                  </Card.Header> */}
                    <Card.Body>
                      <Col className="justify-content-center px-2">
                        <Carousel
                          className="carrosselCard"
                          //   id="carrosselHome"
                          style={{
                            width: "100%",
                            marginInline: "auto",
                            marginTop: 0,
                          }}
                          interval={null}
                          indicators={true}
                        >
                          {p.imagens.map((img, i) => {
                            return (
                              <Carousel.Item key={i}>
                                <Row
                                  className="d-flex justify-content-center align-items-center m-0 py-3 "
                                  style={{
                                    width: "100%",
                                    height: "250px", // altura padrão do slide
                                    overflow: "hidden",
                                  }}
                                >
                                  <img
                                    className="d-block p-0 mx-auto imgProduto"
                                    src={img.url}
                                    alt="Produto"
                                    style={{
                                      height: "100%", // força ocupar toda a altura
                                      width: "auto", // mantém a proporção da imagem
                                      maxWidth: "100%", // impede ultrapassar largura
                                      objectFit: "contain",
                                      display: "block",
                                    }}
                                  />
                                </Row>
                              </Carousel.Item>
                            );
                          })}
                        </Carousel>

                        <Col className="d-flex flex-column justify-content-evenly ">
                          <Row className="subtitulos mb-3 justify-content-center mt-3 nomeClicavel">
                            {p.nome}
                          </Row>
                          <Row className="textos mb-3 justify-content-center mt-3">
                            <Col>
                              <b
                                className="nomeClicavel"
                                style={{ fontWeight: 400 }}
                                onClick={(e) => {
                                  console.log("Fois");
                                }}
                              >
                                {p.subcategoria.categoria.nome}
                              </b>
                              <b> - </b>
                              <b
                                className="nomeClicavel"
                                style={{ fontWeight: 400 }}
                                onClick={(e) => {
                                  console.log("Fois");
                                }}
                              >
                                {p.subcategoria.nome}
                              </b>
                            </Col>
                          </Row>
                        </Col>
                      </Col>
                    </Card.Body>
                    <Card.Footer className="textos" style={{ fontWeight: 700 }}>
                      {p.valor === 0
                        ? "Preço sob enconmenda"
                        : new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(p.valor)}
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </Row>
      <Row className="mt-4 mb-5 mx-0">
        <Row
          style={{
            backgroundColor:
              theme === "dark" ? "rgb(0, 63, 106)" : "rgb(247, 113, 34)",
            height: "auto",
            marginTop: 100,
            marginInline: 0,
            color: "white",
            marginBottom: 50,
            padding: "30px 16px",
          }}
        >
          <h2 className="titulos">Novidades em nosso estoque</h2>
          <p className="textos ">
            Últimas novidades do mercado de aquecedores.
          </p>
        </Row>
        <Container>
          <Row className="d-flex flex-wrap justify-content-center gap-5">
            {produtos
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // ordena por data decrescente
              .slice(0, 2)
              .map((p) => {
                return (
                  <Col className="col-auto d-flex justify-content-center">
                    <Card
                      bg={theme === "dark" ? "dark" : "light"}
                      className="p-0 larguraCard"
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      }}
                    >
                      {/* <Card.Header className="titulos">
                    {p.subcategoria.categoria.nome}
                  </Card.Header> */}
                      <Card.Body>
                        <Col className="justify-content-center px-2">
                          <Carousel
                            className="carrosselCard"
                            //   id="carrosselHome"
                            style={{
                              width: "100%",
                              marginInline: "auto",
                              marginTop: 0,
                            }}
                            interval={null}
                            indicators={true}
                          >
                            {p.imagens.map((img, i) => {
                              return (
                                <Carousel.Item key={i}>
                                  <Row
                                    className="d-flex justify-content-center align-items-center m-0 py-3 "
                                    style={{
                                      width: "100%",
                                      height: "250px", // altura padrão do slide
                                      overflow: "hidden",
                                    }}
                                  >
                                    <img
                                      className="d-block p-0 mx-auto imgProduto"
                                      src={img.url}
                                      alt="Produto"
                                      style={{
                                        height: "100%", // força ocupar toda a altura
                                        width: "auto", // mantém a proporção da imagem
                                        maxWidth: "100%", // impede ultrapassar largura
                                        objectFit: "contain",
                                        display: "block",
                                      }}
                                    />
                                  </Row>
                                </Carousel.Item>
                              );
                            })}
                          </Carousel>

                          <Col className="d-flex flex-column justify-content-evenly ">
                            <Row className="subtitulos mb-3 justify-content-center mt-3 nomeClicavel">
                              {p.nome}
                            </Row>
                            <Row className="textos mb-3 justify-content-center mt-3">
                              <Col>
                                <b
                                  className="nomeClicavel"
                                  style={{ fontWeight: 400 }}
                                  onClick={(e) => {
                                    console.log("Fois");
                                  }}
                                >
                                  {p.subcategoria.categoria.nome}
                                </b>
                                <b> - </b>
                                <b
                                  className="nomeClicavel"
                                  style={{ fontWeight: 400 }}
                                  onClick={(e) => {
                                    console.log("Fois");
                                  }}
                                >
                                  {p.subcategoria.nome}
                                </b>
                              </Col>
                            </Row>
                          </Col>
                        </Col>
                      </Card.Body>
                      <Card.Footer
                        className="textos"
                        style={{ fontWeight: 700 }}
                      >
                        {p.valor === 0
                          ? "Preço sob enconmenda"
                          : new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(p.valor)}
                      </Card.Footer>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </Container>
      </Row>
      <Row
        style={{
          backgroundColor:
            theme === "dark" ? "rgb(0, 63, 106)" : "rgb(247, 113, 34)",
          height: "auto",
          marginTop: 100,
          marginInline: 0,
          color: "white",
          marginBottom: 50,
          padding: "30px 16px",
        }}
      >
        <h2 className="titulos">Nossos principais clientes</h2>
      </Row>
      <CarouselLogos />
      {/* <Link to={"/pagamento"}>Pagamentos</Link> */}
    </div>
  );
}

export default Home;
