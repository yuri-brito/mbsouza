import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function Buscador({ produtos }) {
  const [termo, setTermo] = useState("");
  const [show, setShow] = useState(false);
  const [corFechar, setCorFechar] = useState("var(--bs-body-bg)");
  const [efeitoRow, setEfeitoRow] = useState(" animate__zoomIn");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setTermo(e.target.value);
    if (e.target.value === "") {
      setEfeitoRow("animate__zoomOut");
      setTimeout(() => setShow(false), 300);
    } else {
      setEfeitoRow(" animate__zoomIn");

      setShow(true);
    }
  };
  const handleFechar = () => {
    setEfeitoRow(" animate__zoomOut");
    setTimeout(() => {
      setShow(false);
      setTermo("");

      setCorFechar("var(--bs-body-bg)");
    }, 300); // Tempo da animação
  };
  const [quebras, setQuebras] = useState({}); // <== Estado mapeado para quebras
  const refs = useRef({}); // <== Guardar os refs das Rows

  useEffect(() => {
    if (!show) return;

    const novosValores = {};
    Object.keys(refs.current).forEach((id) => {
      const el = refs.current[id];

      if (el) {
        const cols = el.querySelectorAll(".col-monitor");

        if (cols.length >= 2) {
          const top1 = cols[0].offsetTop;
          const top2 = cols[1].offsetTop;
          console.log(top1, top2);
          novosValores[id] = top2 > top1;
        }
      }
    });

    setQuebras(novosValores);
  }, [show, termo, produtos]);

  // ResizeObserver ajustado
  useEffect(() => {
    const observers = [];

    Object.keys(refs.current).forEach((id) => {
      const el = refs.current[id];
      if (el) {
        const observer = new ResizeObserver(() => {
          const cols = el.querySelectorAll(".col-monitor");
          if (cols.length >= 2) {
            const top1 = cols[0].offsetTop;
            const top2 = cols[1].offsetTop;

            setQuebras((prev) => ({
              ...prev,
              [id]: top2 > top1,
            }));
          }
        });

        observer.observe(el);
        observers.push(observer);
      }
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [show, termo, produtos]);

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
          className={`m-0 p-0 animate__animated ${efeitoRow} animate__faster`}
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
          <Button
            variant="dark"
            className=" m-0 p-0 textos  "
            style={{
              position: "sticky",
              top: 10,
              left: "95%",
              width: 20,
              height: 20,
              cursor: "pointer",
              color: corFechar,
              backgroundColor: "var(--bs-body-color)",
              display: "flex",
              zIndex: 9999,
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            }}
            onClick={handleFechar}
            onMouseEnter={() => setCorFechar("red")}
            onMouseLeave={() => setCorFechar("var(--bs-body-bg)")}
          >
            {"x"}
          </Button>
          <Container>
            {produtos
              .filter((p) => p.nome.toLowerCase().includes(termo.toLowerCase()))
              .map((p, i) => {
                if (!refs.current[p._id])
                  refs.current[p._id] = React.createRef();
                const justifyContent = quebras[p._id] ? "center" : "flex-start";
                return (
                  <Row
                    className=" align-items-center mb-2"
                    key={p._id}
                    ref={(el) => (refs.current[p._id] = el)}
                    onClick={() => {
                      navigate(`/ProdutoPage/${p._id}`);
                      handleFechar();
                    }}
                    style={{
                      justifyContent,
                      position: "relative",
                      transition: "justify-content 0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    <Col
                      style={{
                        position: "absolute",
                        alignSelf: "center",
                        marginLeft: !quebras[p._id] && 20,
                        width: "90%",
                        bottom: -4,
                        borderBottom: "1px solid var(--bs-body-color)",
                      }}
                    ></Col>
                    <Col
                      className="col-monitor"
                      xs={"auto"}
                      style={{
                        alignSelf: "stretch",
                        display: "flex",
                        alignItem: "center",
                      }}
                    >
                      <img
                        width="100px"
                        src={p.imagens.length !== 0 && p.imagens[0].url}
                        alt=""
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          console.log("clicou");
                        }}
                      ></img>
                    </Col>

                    <Col
                      className="col-monitor textos"
                      xs={"auto"}
                      style={{
                        alignSelf: "stretch",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div>{p.nome}</div>
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
