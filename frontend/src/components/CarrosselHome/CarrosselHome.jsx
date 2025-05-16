import { Card, Col, Row } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import "./CarrosselHome.css";
import "../../pages/Home/Home.css";
import teste from "../../assets/teste.png";
import { useEffect } from "react";
import { useState } from "react";
function CarrosselHome({ theme }) {
  const [controlsVis, setControlsVis] = useState(false);

  //fazer chamada puxando os produtos em superdestaque

  return (
    <Carousel
      className="carrosselHome"
      id="carrosselHome"
      style={{
        width: "100%",
        marginInline: "auto",
        marginTop: 20,
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
      <Carousel.Item>
        <Row className="d-flex justify-content-center m-0 py-3 " style={{}}>
          <a
            className="d-flex justify-content-center"
            href="/produtoDetail"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              bg={theme === "dark" ? "dark" : "light"}
              className="p-0"
              style={{
                width: "70%",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
            >
              <Card.Header className="titulos">Aquecedores</Card.Header>
              <Card.Body>
                <Row className="justify-content-center px-2">
                  <Col xs={12} md={6} className="mb-4 justify-content-center">
                    <img
                      className="d-block p-0 mx-auto imgProduto"
                      src={teste}
                      alt="Second slide"
                      style={{ borderRadius: 6 }}
                    />
                  </Col>
                  <Col
                    xs={12}
                    md={6}
                    className="d-flex flex-column justify-content-evenly "
                  >
                    <Row
                      className="subtitulos mb-3"
                      style={{ fontWeight: 700 }}
                    >
                      Aquecedor a Gás Rinnai – Rinnai – Linha Digital – REU E27
                      FEH
                    </Row>
                    <Row className="textos" style={{ textAlign: "left" }}>
                      Mais conforto, segurança e qualidade na hora do banho, sem
                      preocupações com a conta de luz no final do mês. Fabricado
                      no Brasil, este aquecedor possui modulação de chama,
                      sistemas de segurança integrados, exaustão forçada e
                      controle digital de temperatura.
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>R$ 1.400,00</Card.Footer>
            </Card>
          </a>
        </Row>
      </Carousel.Item>
      <Carousel.Item>
        <Row className="d-flex justify-content-center m-0 py-3 " style={{}}>
          <a
            className="d-flex justify-content-center"
            href="/produtoDetail"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              bg={theme === "dark" ? "dark" : "light"}
              className="p-0"
              style={{
                width: "70%",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
            >
              <Card.Header className="titulos">Aquecedores</Card.Header>
              <Card.Body>
                <Row className="justify-content-center px-2">
                  <Col xs={12} md={6} className="mb-4 justify-content-center">
                    <img
                      className="d-block p-0 mx-auto imgProduto"
                      src={teste}
                      alt="Second slide"
                      style={{ borderRadius: 6 }}
                    />
                  </Col>
                  <Col
                    xs={12}
                    md={6}
                    className="d-flex flex-column justify-content-evenly "
                  >
                    <Row
                      className="subtitulos mb-3"
                      style={{ fontWeight: 700 }}
                    >
                      Aquecedor a Gás Rinnai – Rinnai – Linha Digital – REU E27
                      FEH
                    </Row>
                    <Row className="textos" style={{ textAlign: "left" }}>
                      Mais conforto, segurança e qualidade na hora do banho, sem
                      preocupações com a conta de luz no final do mês. Fabricado
                      no Brasil, este aquecedor possui modulação de chama,
                      sistemas de segurança integrados, exaustão forçada e
                      controle digital de temperatura.
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>R$ 1.400,00</Card.Footer>
            </Card>
          </a>
        </Row>
      </Carousel.Item>
      <Carousel.Item>
        <Row className="d-flex justify-content-center m-0 py-3 " style={{}}>
          <a
            className="d-flex justify-content-center"
            href="/produtoDetail"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              bg={theme === "dark" ? "dark" : "light"}
              className="p-0"
              style={{
                width: "70%",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
            >
              <Card.Header className="titulos">Aquecedores</Card.Header>
              <Card.Body>
                <Row className="justify-content-center px-2">
                  <Col xs={12} md={6} className="mb-4 justify-content-center">
                    <img
                      className="d-block p-0 mx-auto imgProduto"
                      src={teste}
                      alt="Second slide"
                      style={{ borderRadius: 6 }}
                    />
                  </Col>
                  <Col
                    xs={12}
                    md={6}
                    className="d-flex flex-column justify-content-evenly "
                  >
                    <Row
                      className="subtitulos mb-3"
                      style={{ fontWeight: 700 }}
                    >
                      Aquecedor a Gás Rinnai – Rinnai – Linha Digital – REU E27
                      FEH
                    </Row>
                    <Row className="textos" style={{ textAlign: "left" }}>
                      Mais conforto, segurança e qualidade na hora do banho, sem
                      preocupações com a conta de luz no final do mês. Fabricado
                      no Brasil, este aquecedor possui modulação de chama,
                      sistemas de segurança integrados, exaustão forçada e
                      controle digital de temperatura.
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>R$ 1.400,00</Card.Footer>
            </Card>
          </a>
        </Row>
      </Carousel.Item>
      <Carousel.Item>
        <Row className="d-flex justify-content-center m-0 py-3 " style={{}}>
          <a
            className="d-flex justify-content-center"
            href="/produtoDetail"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              bg={theme === "dark" ? "dark" : "light"}
              className="p-0"
              style={{
                width: "70%",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
            >
              <Card.Header className="titulos">Aquecedores</Card.Header>
              <Card.Body>
                <Row className="justify-content-center px-2">
                  <Col xs={12} md={6} className="mb-4 justify-content-center">
                    <img
                      className="d-block p-0 mx-auto imgProduto"
                      src={teste}
                      alt="Second slide"
                      style={{ borderRadius: 6 }}
                    />
                  </Col>
                  <Col
                    xs={12}
                    md={6}
                    className="d-flex flex-column justify-content-evenly "
                  >
                    <Row
                      className="subtitulos mb-3"
                      style={{ fontWeight: 700 }}
                    >
                      Aquecedor a Gás Rinnai – Rinnai – Linha Digital – REU E27
                      FEH
                    </Row>
                    <Row className="textos" style={{ textAlign: "left" }}>
                      Mais conforto, segurança e qualidade na hora do banho, sem
                      preocupações com a conta de luz no final do mês. Fabricado
                      no Brasil, este aquecedor possui modulação de chama,
                      sistemas de segurança integrados, exaustão forçada e
                      controle digital de temperatura.
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>R$ 1.400,00</Card.Footer>
            </Card>
          </a>
        </Row>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarrosselHome;
