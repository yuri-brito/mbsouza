import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import "./CarrosselHome.css";
import "../../pages/Home/Home.css";
import teste from "../../assets/teste.png";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function CarrosselHome({ theme, produtos }) {
  const navigate = useNavigate();
  const [controlsVis, setControlsVis] = useState(false);
  const [produtosSuperDestaque, setProdutosSuperDestaque] = useState([]);
  useEffect(() => {
    setProdutosSuperDestaque(
      produtos.filter((p) => {
        return p.destaque === "2";
      })
    );
  }, [produtos]);
  console.log(produtosSuperDestaque);
  return (
    <Carousel
      interval={null}
      className="carrosselHome "
      id="carrosselHome"
      style={{
        width: "100%",
        marginInline: "auto",
        marginTop: 0,
      }}
      controls={controlsVis}
      onMouseEnter={(e) => {
        setControlsVis(true);
      }}
      onMouseLeave={(e) => {
        setControlsVis(false);
      }}
      indicators={controlsVis}
    >
      {produtosSuperDestaque.map((p) => {
        console.log(p);
        return (
          <Carousel.Item
            style={{ minHeight: "fit-content", overflow: "visible" }}
          >
            <Row className="justify-content-center align-items-center d-flex flex-nowrap ">
              <Col
                xs="auto"
                style={{ minWidth: "100px" }}
                className=" mb-4 d-flex flex-column  justify-content-center align-items-center colunas "
              >
                <Row className="d-flex justify-content-center align-items-center m-0 py-3 ">
                  <img
                    className="d-block p-0 mx-auto imgProduto"
                    src={p.imagens[0].url}
                    alt="Produto"
                    style={{
                      // height: "100%", // força ocupar toda a altura
                      width: "25vw", // mantém a proporção da imagem
                      // maxWidth: "100%", // impede ultrapassar largura
                      objectFit: "contain",
                      display: "block",
                      borderRadius: 6,
                    }}
                  />
                </Row>
              </Col>
              <Col
                xs="auto"
                style={{ minWidth: "100px", width: "60vw", overflowY: "auto" }}
                className="d-flex flex-column justify-content-center align-items-center colunas "
              >
                <Row
                  className="subtitulos mb-3"
                  style={{
                    fontWeight: 700,
                    paddingInline: "1rem",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    height: "5vw",
                  }}
                >
                  {p.nome}
                </Row>
                <Row
                  className="textos d-flex flex-wrap mb-5"
                  style={{
                    textAlign: "left",
                    paddingInline: "1rem",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    // fontSize: "clamp(12px, 2vw, 18px)",
                    // height: "20vw",
                  }}
                >
                  {p.descricao}
                </Row>
                <Row>
                  <Button
                    size="sm"
                    variant="success"
                    className="textos"
                    onClick={() => {
                      navigate(`/ProdutoPage/${p._id}`);
                    }}
                  >
                    <i className="bi bi-ticket-detailed"> </i> Detalhar
                  </Button>
                </Row>
              </Col>
            </Row>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
}

export default CarrosselHome;
