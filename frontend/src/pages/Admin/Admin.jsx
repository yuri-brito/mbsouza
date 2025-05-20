import { useEffect, useRef, useState } from "react";
import CarrosselHome from "../../components/CarrosselHome/CarrosselHome";
import NavBar from "../../components/NavBar/NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import api from "../../api/api";
import toast from "react-hot-toast";
import CustomToast from "../../components/CustomToast";

function Admin() {
  const { loggedUser, theme } = useContext(AuthContext);
  console.log(loggedUser);
  const navigate = useNavigate();
  if (loggedUser.userData.papel !== "admin") {
    navigate("/");
  }
  const [formInserirCategoria, setFormInserirCategoria] = useState({
    nome: "",
  });
  const [showInserirCategoria, setShowInserirCategoria] = useState(false);
  const handleShowInserirCategoria = () => {
    setShowInserirCategoria(true);
  };
  const handleCloseInserirCategoria = () => {
    setFormInserirCategoria({ nome: "" });

    setShowInserirCategoria(false);
  };
  const handleChangeInserirCategoria = (e) => {
    setFormInserirCategoria({
      ...formInserirCategoria,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmitInserirCategoria = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await api.post(
        "/categoria/create",
        formInserirCategoria
      );

      setShowInserirCategoria(false);
      navigate("/Admin");
    } catch (error) {
      if (
        error.response.data.msg === "Sua sessão expirou, realize novo login."
      ) {
        toast.error(
          (t) => (
            <CustomToast
              t={t}
              message={error.response.data.msg}
              duration={5000}
            />
          ),
          {
            style: {
              borderRadius: "10px",
              border: "1px solid #ff4c4cff",
              color: "black",
              fontWeight: "400",
            },
          }
        );
      } else {
        toast.error(
          (t) => (
            <CustomToast
              t={t}
              message={error.response.data.msg}
              duration={5000}
            />
          ),
          {
            style: {
              borderRadius: "10px",
              border: "1px solid #ff4c4cff",
              color: "black",
              fontWeight: "400",
            },
          }
        );
      }
    }
  };
  return (
    <div
      style={{
        position: "relative",
        animation: "fadein 1.5s",
        marginBottom: 100,
      }}
    >
      <Modal
        show={showInserirCategoria}
        onHide={handleCloseInserirCategoria}
        backdrop="static"
      >
        <Modal.Header
          className="headerModalCadastro"
          closeButton={true}
          style={{ fontSize: 14 }}
        >
          Insira o nome da nova categoria
        </Modal.Header>

        {/* {forgotShow ? (
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
                ) : ( */}
        <Form>
          <>
            <Modal.Body>
              <Container>
                <Form.Group className="mb-3">
                  <FloatingLabel
                    label="Nome da categoria"
                    className="mb-3 labelCriarConta"
                    style={{ fontSize: 12 }}
                  >
                    <Form.Control
                      required
                      type="text"
                      placeholder=""
                      name="nome"
                      value={formInserirCategoria.nome}
                      style={{
                        height: 30,
                        fontSize: 13,
                        minHeight: 35,
                      }}
                      onChange={handleChangeInserirCategoria}
                    />
                    <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
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
                    onClick={handleSubmitInserirCategoria}
                    disabled={formInserirCategoria.nome === ""}
                  >
                    <i className="bi bi-floppy"></i> Salvar
                  </Button>
                </Col>
                <Col xs="auto" className="mb-2">
                  <Button
                    className="cadastroButtons"
                    variant="secondary"
                    size="sm"
                    type="submit"
                    style={{ fontSize: 11 }}
                    onClick={handleCloseInserirCategoria}
                  >
                    <i className="bi bi-x-circle"></i> Cancelar
                  </Button>
                </Col>
              </Row>
            </Modal.Footer>
          </>
        </Form>
        {/* )} */}
      </Modal>
      <Row
        className="d-flex justify-content-center mx-0 p-0"
        style={{
          backgroundColor:
            theme === "dark" ? "rgb(0, 63, 106)" : "rgb(247, 113, 34)",
          height: "auto",

          marginInline: 0,
          color: "white",
          marginBottom: 50,
        }}
      >
        <h2 className="my-4 titulos">ADMINISTRAÇÃO</h2>
      </Row>
      <Row className="d-flex justify-content-start mx-0 p-0 ">
        <Container>
          <Row className=" mb-4 g-3">
            <Col xs={12} md={6}>
              <Card>
                <Card.Header className="titulos">Categorias</Card.Header>
                <Card.Body>
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
                    Categoria A
                  </Button>
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
                    {" "}
                    Categoria B
                  </Button>
                </Card.Body>
                <Card.Footer>
                  <Button
                    size="sm"
                    style={{
                      width: "30%",
                      maxWidth: 120,
                      //   fontSize: 12,
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
                    variant="success"
                    className="textos"
                    onClick={handleShowInserirCategoria}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Incluir
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Card.Header className="titulos">Subcategorias</Card.Header>
                <Card.Body>
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
                    Subcategorias A
                  </Button>
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
                    Subcategorias B
                  </Button>
                </Card.Body>
                <Card.Footer>
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
                    variant="success"
                  >
                    <i className="bi bi-plus-circle me-2"></i>Incluir
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
          <Row className=" d-flex justify-content-start m-0 p-0">
            <Card className="p-0">
              <Card.Header className="titulos">Produtos</Card.Header>
              <Card.Body>
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
                  Produto A
                </Button>
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
                  Produto B
                </Button>
              </Card.Body>
              <Card.Footer>
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
                  variant="success"
                >
                  <i className="bi bi-plus-circle me-2"></i>Incluir
                </Button>
              </Card.Footer>
            </Card>
          </Row>
        </Container>
      </Row>
    </div>
  );
}

export default Admin;
