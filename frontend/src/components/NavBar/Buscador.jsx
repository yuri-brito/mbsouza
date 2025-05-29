import { useState } from "react";
import { Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
function Buscador({ produtos }) {
  const [termo, setTermo] = useState("");
  const [show, setShow] = useState(false);
  const [corFechar, setCorFechar] = useState("var(--bs-body-color)");
  const handleChange = (e) => {
    setTermo(e.target.value);
    if (e.target.value === "") {
      setShow(false);
    } else {
      setShow(true);
    }
  };
  return (
    <div
      style={{
        position: "relative",
        width: "50vw",
      }}
    >
      <FloatingLabel
        label="Pesquisar Produtos"
        className="pesquisaNavbar"
        style={{
          fontSize: 12,
          width: "50vw",
        }}
      >
        <Form.Control
          type="text"
          name="termo"
          placeholder="..."
          value={termo}
          style={{}}
          onChange={handleChange}
        />
        <span
          className="separadorTraco"
          style={{
            position: "absolute",
            top: 5,
            right: 26,
            color: "#737373",
            fontSize: 15,
          }}
        >
          |
        </span>
        <span
          className="lupaPesquisa"
          style={{
            position: "absolute",
            top: 7.5,
            right: 8,
            color: "#737373",
            fontSize: 14,
          }}
        >
          <i className="bi bi-search"></i>
        </span>
      </FloatingLabel>
      {show && (
        <Row
          className="m-0 p-0 animate__animated animate__fadeInDown"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            backgroundColor: "var(--bs-body-bg)",
            border: "1px solid #ccc",
            borderTop: "none",
            maxHeight: "200px",
            overflowY: "auto",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            borderRadius: "5px 5px 5px 5px",
            display: "block",
            color: "var(--bs-body-color)",
          }}
        >
          <Row
            className=" m-0 p-0 justify-content-end "
            style={{
              position: "absolute",
              top: 0,
              right: 10,
              width: 10,
              cursor: "pointer",
              color: corFechar,
            }}
            onClick={() => {
              setShow(false);
              setTermo("");
              setCorFechar("var(--bs-body-color)");
            }}
            onMouseEnter={() => setCorFechar("red")}
            onMouseLeave={() => setCorFechar("var(--bs-body-color)")}
          >
            {" "}
            x
          </Row>
          <Container>
            {produtos
              .filter((p) => p.nome.toLowerCase().includes(termo.toLowerCase()))
              .map((p) => {
                return (
                  <Row className="justify-content-start align-items-center mb-2">
                    <Col xs={"auto"}>
                      <img
                        width="100px"
                        src={p.imagens[0].url}
                        alt="imagem"
                      ></img>
                    </Col>
                    <Col className="textos" xs={"auto"}>
                      {p.nome}
                    </Col>
                  </Row>
                );
              })}
          </Container>
        </Row>
      )}
    </div>
  );
}

export default Buscador;
