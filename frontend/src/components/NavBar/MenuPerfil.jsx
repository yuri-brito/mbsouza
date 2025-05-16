import { useContext, useEffect } from "react";
import {
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Row,
  Col,
  Form,
  Modal,
  Container,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import { useRef, useState } from "react";

function MenuPerfil() {
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const [showDrop, setShowDrop] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dropDownRef = useRef(null);

  useEffect(() => {
    const element = dropDownRef.current;

    // Cria um MutationObserver para observar mudanças nas classes
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          // console.log("As classes foram alteradas:", element.classList);
          setShowDrop(Array.from(element.classList).includes("show"));
        }
      }
    });

    // Configura o observer para observar mudanças no atributo 'class'
    observer.observe(element, { attributes: true });

    // Limpeza: desconecta o observer quando o componente é desmontado
    return () => {
      observer.disconnect();
    };
  }, []);

  //Area do criar conta
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
  //fim da area do criar conta

  //area de logar
  const [showLogin, setShowLogin] = useState(false);
  const [formLogin, setFormLogin] = useState({ unique: "", password: "" });
  const [hidePasswordLogin, setHidepasswordLogin] = useState(true);
  const [uniqueValid, setUniqueValid] = useState();
  const [uniqueErrorMsg, setUniqueErrorMsg] = useState("");
  const [senhaErrorMsg, setSenhaErrorMsg] = useState("");
  const [forgotShow, setForgotShow] = useState(false);
  const [showActiveMsgLogin, setShowActiveMsgLogin] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [activeMsg, setActiveMsg] = useState("");
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const handleShowLogin = () => {
    setShowLogin(true);
  };
  const handleCloseLogin = () => {
    setFormLogin({ unique: "", password: "" });
    setUniqueValid();
    setHidepasswordLogin(true);
    setUniqueValid();
    setUniqueErrorMsg("");
    setSenhaErrorMsg("");
    setForgotShow(false);
    setShowActiveMsgLogin(false);
    setActiveMsg("");
    setShowErrorMsg(false);
    setIsLoadingLogin(false);
    setShowLogin(false);
  };
  const handleChangeLogin = (e) => {
    setFormLogin({ ...form, [e.target.name]: e.target.value });
    setUniqueValid();
    setUniqueErrorMsg("");
    setSenhaErrorMsg("");
    setShowErrorMsg(false);
    setShowActiveMsg(false);
  };
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (tentativas > 3) {
        setUniqueErrorMsg("Conta bloqueada");
        setUniqueValid(false);
        setSenhaErrorMsg(
          "Sua conta foi bloqueada, por favor, recupera a senha para ativá-la novamente"
        );
        const response = await api.put(`/usuario/bloquear/${form.unique}`);

        return;
      }

      const response = await api.post("/usuario/login", form);
      setLoggedUser({ ...response.data });
      localStorage.setItem("loggedUser", JSON.stringify(response.data));
      setTentativas(0);
      setShowLogin(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setUniqueErrorMsg(error.response.data.msg);
        setUniqueValid(false);
        setSenhaErrorMsg(error.response.data.msg);
        setTentativas(tentativas + 1);
      } else {
        setUniqueErrorMsg(error.response.data.msg);
        setUniqueValid(false);
        setSenhaErrorMsg(error.response.data.msg);
      }
      console.log(error);
    }
  };
  const handleSubmitForgot = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsLoadingLogin(true);
      const res = await api.put("/usuario/recuperar", form);

      if (res.status === 201) {
        setShowActiveMsgLogin(true);
        setActiveMsg(res.data.msg);
      }
      setIsLoadingLogin(false);
    } catch (error) {
      setIsLoadingLogin(false);
      setShowErrorMsg(true);
      setActiveMsg(error.response.data.msg);
      console.log(error);
    }
  };
  //fim da area de logar
  return (
    <>
      <DropdownButton
        // as={"button"}
        ref={dropDownRef}
        className="dropdownMenu"
        onMouseDown={(e) => {
          dropDownRef.current.style.boxShadow = "none";
        }}
        onMouseUp={(e) => {
          dropDownRef.current.style.boxShadow =
            " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
        }}
        style={{
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
        variant="success"
        title={
          <Row className="m-0">
            <Col
              className="col-md-auto p-0  d-flex flex-column align-items-end justify-content-center"
              style={{ position: "relative" }}
            >
              <div
                className="d-flex profileImgButton justify-content-center align-items-center "
                style={{
                  // width: 50,
                  // height: 50,
                  position: "relative",
                  borderRadius: "50%",
                  overflow: "hidden",
                  color: "var(--bs-text-color)",
                  fontSize: 12,
                }}
              >
                {showDrop ? (
                  <i
                    className="bi bi-x-lg animate__animated "
                    style={{ animation: "fadein 1.5s" }}
                  ></i>
                ) : (
                  <p
                    style={{ fontSize: 14, animation: "fadein 1.5s" }}
                    className="bi bi-person-circle animate__animated  p-0 m-0"
                  ></p>
                )}
              </div>
            </Col>

            <Col
              className={`p-0 textoLogin`}
              style={{
                marginLeft: 2,
                color: "var(--bs-text-color)",
                fontWeight: 500,
                boxShadow: "none",
              }}
            >
              Login
            </Col>
          </Row>
        }
        size="sm"
        align="middle"
      >
        <Dropdown.Item
          eventKey="0"
          style={{ paddingInline: 12 }}
          onClick={handleShow}
          active={pathname === "/"}
        >
          Criar conta
        </Dropdown.Item>

        <Dropdown.Item
          eventKey="1"
          style={{ paddingInline: 12 }}
          onClick={handleShowLogin}
        >
          Entre
        </Dropdown.Item>
      </DropdownButton>
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
      <Modal show={showLogin} onHide={handleCloseLogin} backdrop="static">
        <Modal.Header
          className="headerModalCadastro"
          closeButton={true}
          style={{ fontSize: 14 }}
        >
          {forgotShow ? (
            <>Insira credenciais para recuperação</>
          ) : (
            <> Insira suas credenciais</>
          )}
        </Modal.Header>

        {forgotShow ? (
          <Form>
            {isLoadingLogin ? (
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
                        label="CPF ou e-mail"
                        className="mb-3 labelCriarConta"
                        style={{ fontSize: 12 }}
                      >
                        <Form.Control
                          required
                          type="text"
                          placeholder=""
                          name="unique"
                          value={formLogin.unique}
                          style={{
                            height: 30,
                            fontSize: 13,
                            minHeight: 35,
                          }}
                          onChange={handleChangeLogin}
                          isInvalid={uniqueValid === false}
                        />
                        <Form.Control.Feedback type="invalid">
                          {uniqueErrorMsg}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>

                    {showActiveMsgLogin && (
                      <Row
                        as={"div"}
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
                            paddingInline: 0,
                            color: "var(--bs-form-valid-color)",
                            textAlign: "center",
                          }}
                        >
                          {activeMsg}
                        </b>
                      </Row>
                    )}
                    {showErrorMsg && (
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
                            paddingInline: 0,
                            color: "var(--bs-form-invalid-color)",
                            textAlign: "center",
                          }}
                        >
                          {activeMsg}
                        </b>
                      </Row>
                    )}
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
                        onClick={handleSubmitForgot}
                        disabled={form.unique === ""}
                      >
                        <i className="bi bi-person-plus"></i> Recuperar
                      </Button>
                    </Col>
                    <Col xs="auto" className="mb-2">
                      <Button
                        className="cadastroButtons"
                        variant="secondary"
                        size="sm"
                        type="submit"
                        style={{ fontSize: 11 }}
                        onClick={(e) => {
                          setForgotShow(false);
                        }}
                      >
                        <i className="bi bi-x-circle"></i> Voltar
                      </Button>
                    </Col>
                  </Row>
                </Modal.Footer>
              </>
            )}
          </Form>
        ) : (
          <Form>
            <>
              <Modal.Body>
                <Container>
                  <Form.Group className="mb-3">
                    <FloatingLabel
                      label="CPF ou e-mail"
                      className="mb-3 labelCriarConta"
                      style={{ fontSize: 12 }}
                    >
                      <Form.Control
                        required
                        type="text"
                        placeholder=""
                        name="unique"
                        value={form.cpf}
                        style={{
                          height: 30,
                          fontSize: 13,
                          minHeight: 35,
                        }}
                        onChange={handleChangeLogin}
                        isInvalid={uniqueValid === false}
                      />
                      <Form.Control.Feedback type="invalid">
                        {uniqueErrorMsg}
                      </Form.Control.Feedback>
                      <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>

                  <Row>
                    <Col className="col-8 " style={{ minWidth: 200 }}>
                      <FloatingLabel
                        label="Insira sua senha"
                        className="mb-3 labelCriarConta "
                        style={{ fontSize: 12 }}
                      >
                        <Form.Control
                          required
                          type={
                            hidePasswordLogin && formLogin.password !== ""
                              ? "password"
                              : "text"
                          }
                          placeholder=""
                          name="password"
                          value={formLogin.password}
                          onChange={handleChangeLogin}
                          style={{ paddingRight: 50 }}
                          isInvalid={uniqueValid === false}
                        />
                        <i
                          className={
                            hidePasswordLogin
                              ? "bi bi-eye-slash togglePassword"
                              : "bi bi-eye togglePassword"
                          }
                          style={{
                            position: "absolute",
                            top: 3,
                            right: 30,
                            fontSize: 20,
                            color:
                              uniqueValid === true
                                ? "var(--bs-form-valid-color)"
                                : uniqueValid === false &&
                                  "var(--bs-form-invalid-color)",
                          }}
                          onClick={(e) => {
                            setHidepassword(!hidePasswordLogin);
                          }}
                        ></i>
                        <Form.Control.Feedback type="invalid">
                          {uniqueErrorMsg}
                        </Form.Control.Feedback>
                        <Button
                          className="LoginButtonForgot"
                          variant="success"
                          style={{
                            fontSize: 9,
                            backgroundColor: "transparent",
                            marginTop: 8,
                            color: "#198754",
                            paddingBlock: 2,
                            paddingInline: 4,
                          }}
                          size="sm"
                          onClick={(e) => {
                            setForgotShow(true);
                          }}
                        >
                          Esqueceu a senha?
                        </Button>
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="col p-0" style={{}}>
                      {senhaErrorMsg && (
                        <Row
                          as={"p"}
                          className="d-flex justify-content-center align-items-center animate__animated animate__fadeIn m-0 p-0"
                        >
                          <Col xs="auto" className="m-0">
                            <svg
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 130.2 130.2"
                              style={{ width: 25, height: 25 }}
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
                          </Col>
                          <Col xs="auto" className="p-0">
                            <b
                              className="bMsgError"
                              style={{
                                fontSize: 12,
                                paddingInline: 0,
                                color: "var(--bs-form-invalid-color)",
                                textAlign: "center",
                              }}
                            >
                              {senhaErrorMsg}
                            </b>
                          </Col>
                        </Row>
                      )}
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
                      onClick={handleSubmitLogin}
                      disabled={
                        formLogin.unique === "" || formLogin.password === ""
                      }
                    >
                      <i className="bi bi-person-plus"></i> Entrar
                    </Button>
                  </Col>
                  <Col xs="auto" className="mb-2">
                    <Button
                      className="cadastroButtons"
                      variant="secondary"
                      size="sm"
                      type="submit"
                      style={{ fontSize: 11 }}
                      onClick={handleCloseLogin}
                    >
                      <i className="bi bi-x-circle"></i> Cancelar
                    </Button>
                  </Col>
                </Row>
              </Modal.Footer>
            </>
          </Form>
        )}
      </Modal>
    </>
  );
}

export default MenuPerfil;
