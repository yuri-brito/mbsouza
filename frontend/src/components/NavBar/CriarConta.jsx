import { useRef, useState } from "react";
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
import api from "../../api/api";
import { SpinnerDotted } from "spinners-react";
import "./NavBar.css";
function calcularDigitoVerificadorCPF(cpf) {
  // Remove qualquer caractere que não seja número
  cpf = cpf.replace(/\D/g, "");

  // Verifica se o CPF tem 9 dígitos
  if (cpf.length !== 9) {
    throw new Error("CPF deve conter 9 dígitos.");
  }

  // Função para calcular cada dígito verificador
  const calcularDigito = (baseCPF, pesoInicial) => {
    let soma = 0;
    for (let i = 0; i < baseCPF.length; i++) {
      soma += parseInt(baseCPF[i]) * (pesoInicial - i);
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  // Calcula o primeiro dígito verificador
  const primeiroDigito = calcularDigito(cpf, 10);

  // Adiciona o primeiro dígito ao CPF
  cpf += primeiroDigito;

  // Calcula o segundo dígito verificador
  const segundoDigito = calcularDigito(cpf, 11);

  // Retorna os dígitos verificadores
  return `${primeiroDigito}${segundoDigito}`;
}
function CriarConta(props) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: "",
    sexo: "",
  });

  const [hidePassword, setHidepassword] = useState(true);
  const [hidePasswordConfirm, setHidepasswordConfirm] = useState(true);
  const [showActiveMsg, setShowActiveMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setForm({
      nome: "",
      cpf: "",
      email: "",
      password: "",
      confirmPassword: "",
      sexo: "",
    });
    setNomeValid();
    setCpfValid();
    setCpfInvalidMsg("");
    setEmailValid();
    setEmailInvalidMsg("");
    setSenhaValid();
    setSenhaInvalidMsg("");
    setConfirmSenhaValid();
    setConfirmSenhaInvalidMsg("");
    setErrorMsg("");
    setHidepasswordConfirm(true);
    setHidepassword(true);
    setIsLoading(false);
    setShowActiveMsg(false);
    setShow(false);
  };

  const [nomeValid, setNomeValid] = useState();
  const [cpfValid, setCpfValid] = useState();
  const [cpfInvalidMsg, setCpfInvalidMsg] = useState("");
  const [emailValid, setEmailValid] = useState();
  const [emailInvalidMsg, setEmailInvalidMsg] = useState("");
  const [senhaValid, setSenhaValid] = useState();
  const [senhaInvalidMsg, setSenhaInvalidMsg] = useState("");
  const [confirmSenhaValid, setConfirmSenhaValid] = useState();
  const [confirmSenhaInvalidMsg, setConfirmSenhaInvalidMsg] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      let validou = true;
      if (form.nome === "") {
        setNomeValid(false);
        validou = false;
      }
      if (form.cpf === "") {
        setCpfValid(false);
        setCpfInvalidMsg("Insira um CPF.");
        validou = false;
      }
      if (form.email === "") {
        setEmailValid(false);
        setEmailInvalidMsg("Insira um e-mail.");
        validou = false;
      }
      if (form.password === "") {
        setSenhaValid(false);
        setSenhaInvalidMsg("Insira uma senha.");
        validou = false;
      }
      if (form.confirmPassword === "") {
        setConfirmSenhaValid(false);
        setConfirmSenhaInvalidMsg("Insira uma confirmação");
        validou = false;
      }
      if (!validou) {
        return;
      }
      setIsLoading(true);
      const res = await api.post("/usuario/create", form);

      if (res.status === 201) {
        setShowActiveMsg(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setShowActiveMsg(true);
      setIsLoading(false);
      setErrorMsg(error.response.data.msg);
    }
  };

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
    if (e.target.name === "cpf") {
      if (e.target.value === "") {
        if (cpfValid === true) {
          setCpfValid(false);
        }
      } else {
        if (!e.target.value.match(/([0-9]){11}/)) {
          setCpfValid(false);
          setCpfInvalidMsg("Insira os 11 dígitos do seu CPF");
          return;
        } else {
          const dv = calcularDigitoVerificadorCPF(e.target.value.slice(0, 9));
          if (dv === e.target.value.slice(-2)) {
            setCpfValid(true);
          } else {
            setCpfValid(false);
            setCpfInvalidMsg("Digite um CPF válido.");
          }
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
  return (
    <>
      <Button
        size="sm"
        className="criarContaButton"
        variant="success"
        onClick={handleShow}
        onMouseDown={(e) => {
          e.target.style.boxShadow = "none";
        }}
        onMouseUp={(e) => {
          e.target.style.boxShadow =
            " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
        }}
        style={{
          fontSize: 12,
          backgroundColor: "transparent",
          color: "var(--bs-text-color)",
          boxShadow:
            " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
      >
        Criar conta
      </Button>
      <Modal
        className="criarContaModal"
        show={show}
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header
          className="headerModalCadastro"
          closeButton={true}
          style={{ fontSize: 14 }}
        >
          {showActiveMsg ? (
            <>
              {errorMsg ? (
                <> Desculpe, ocorreu um erro. 😕</>
              ) : (
                <> Tudo certo! 😎</>
              )}
            </>
          ) : (
            <>
              {isLoading ? (
                <> Aguarde, criando conta...</>
              ) : (
                <>Insira seus dados e cadastre-se</>
              )}
            </>
          )}
        </Modal.Header>
        {showActiveMsg ? (
          <Row className=" msgEmailActive  m-3" style={{ fontSize: 12 }}>
            {errorMsg ? (
              <Row
                as={"p"}
                className="d-flex justify-content-center align-items-center animate__animated animate__fadeIn m-0 p-0"
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
                    padding: 0,
                  }}
                >
                  {errorMsg}
                </b>
              </Row>
            ) : (
              <Row
                as={"div"}
                className="d-flex justify-content-center align-items-center animate__animated animate__fadeIn p-0"
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
                  className="bMsgError p-0"
                  style={{
                    fontSize: 12,
                    paddingInline: 10,
                    color: "var(--bs-form-valid-color)",
                    textAlign: "center",
                  }}
                >
                  Enviamos um email de confirmação para ativar a sua conta.
                </b>
              </Row>
            )}
          </Row>
        ) : (
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
                <Modal.Body>
                  <Container>
                    <Form.Group className="mb-3">
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
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <FloatingLabel
                        label="CPF"
                        className="mb-3 labelCriarConta"
                        style={{ fontSize: 12 }}
                      >
                        <Form.Control
                          required
                          type="text"
                          placeholder=""
                          name="cpf"
                          maxLength={11}
                          value={form.cpf}
                          style={{
                            height: 30,
                            fontSize: 13,
                            minHeight: 35,
                          }}
                          onChange={handleChange}
                          isValid={cpfValid}
                          isInvalid={cpfValid === false}
                        />
                        <Form.Control.Feedback type="invalid">
                          {cpfInvalidMsg}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                          CPF válido.
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3">
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
                    </Form.Group>

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
                          <div className="regrasSenha" style={{ fontSize: 10 }}>
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
                                  <i style={{ textAlign: "left" }}>- Número</i>
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
                              hidePasswordConfirm && form.confirmPassword !== ""
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
                          {/* {form.password &&
                      form.password !== form.confirmPassword && (
                        <div className="invalid-feedback">
                          <Row className="m-0 ms-2 ">
                            <Col
                              xs="auto"
                              className="d-flex justify-content-start p-0 "
                            >
                              <i style={{ textAlign: "left" }}>
                                - As senhas não conferem!
                              </i>
                            </Col>
                            <Col
                              xs="auto"
                              className="d-flex justify-content-start align-items-bottom p-0 "
                            >
                              <i className="bi bi-x"></i>
                            </Col>
                          </Row>
                        </div>
                      )}
                    <div className="valid-feedback">
                      <Row className="m-0 ms-2 ">
                        <Col
                          xs="auto"
                          className="d-flex justify-content-start p-0 "
                        >
                          <i style={{ textAlign: "left" }}>
                            - As senhas conferem!
                          </i>
                        </Col>
                        <Col
                          xs="auto"
                          className="d-flex justify-content-start align-items-bottom p-0 "
                        >
                          <i className="bi bi-check"></i>
                        </Col>
                      </Row>
                    </div> */}
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
                          nomeValid === false ||
                          cpfValid === false ||
                          emailValid === false ||
                          senhaValid === false ||
                          confirmSenhaValid === false
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
          </Form>
        )}
      </Modal>
    </>
  );
}

export default CriarConta;
