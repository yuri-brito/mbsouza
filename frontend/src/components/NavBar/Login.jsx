import { useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";

import { SpinnerDotted } from "spinners-react";
import api from "../../api/api";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";

function Login(props) {
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ unique: "", password: "" });
  const [hidePassword, setHidepassword] = useState(true);
  const [uniqueValid, setUniqueValid] = useState();
  const [uniqueErrorMsg, setUniqueErrorMsg] = useState("");
  const [senhaErrorMsg, setSenhaErrorMsg] = useState("");
  const [forgotShow, setForgotShow] = useState(false);
  const [showActiveMsg, setShowActiveMsg] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [activeMsg, setActiveMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setForm({ unique: "", password: "" });
    setUniqueValid();
    setHidepassword(true);
    setUniqueValid();
    setUniqueErrorMsg("");
    setSenhaErrorMsg("");
    setForgotShow(false);
    setShowActiveMsg(false);
    setActiveMsg("");
    setShowErrorMsg(false);
    setIsLoading(false);
    setShow(false);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setUniqueValid();
    setUniqueErrorMsg("");
    setSenhaErrorMsg("");
    setShowErrorMsg(false);
    setShowActiveMsg(false);
  };
  const handleSubmit = async (e) => {
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
      setShow(false);
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
      setIsLoading(true);
      const res = await api.put("/usuario/recuperar", form);

      if (res.status === 201) {
        setShowActiveMsg(true);
        setActiveMsg(res.data.msg);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setShowErrorMsg(true);
      setActiveMsg(error.response.data.msg);
      console.log(error);
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
        Entre
      </Button>
      <Modal show={show} onHide={handleClose} backdrop="static">
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
                        label="CPF ou e-mail"
                        className="mb-3 labelCriarConta"
                        style={{ fontSize: 12 }}
                      >
                        <Form.Control
                          required
                          type="text"
                          placeholder=""
                          name="unique"
                          value={form.unique}
                          style={{
                            height: 30,
                            fontSize: 13,
                            minHeight: 35,
                          }}
                          onChange={handleChange}
                          isInvalid={uniqueValid === false}
                        />
                        <Form.Control.Feedback type="invalid">
                          {uniqueErrorMsg}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>

                    {showActiveMsg && (
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
                        onChange={handleChange}
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
                            hidePassword && form.password !== ""
                              ? "password"
                              : "text"
                          }
                          placeholder=""
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          style={{ paddingRight: 50 }}
                          isInvalid={uniqueValid === false}
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
                              uniqueValid === true
                                ? "var(--bs-form-valid-color)"
                                : uniqueValid === false &&
                                  "var(--bs-form-invalid-color)",
                          }}
                          onClick={(e) => {
                            setHidepassword(!hidePassword);
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
                      onClick={handleSubmit}
                      disabled={form.unique === "" || form.password === ""}
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
                      onClick={handleClose}
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

export default Login;
