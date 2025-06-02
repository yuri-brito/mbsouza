import { useEffect, useRef, useState } from "react";
import CarrosselHome from "../../components/CarrosselHome/CarrosselHome";
import NavBar from "../../components/NavBar/NavBar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import "./CategoriaPage.css";
import GaleriaProduto from "./GaleriaProduto";
function ProdutoPage({ produtos, subcategorias }) {
  const navigate = useNavigate();
  const { theme } = useContext(AuthContext);
  const { id } = useParams();
  const [produtosCategoria, setProdutosCategoria] = useState([]);
  const [produto, setProduto] = useState(
    produtos.filter((p) => p._id === id)[0]
  );
  
  useEffect(() => {
    setProduto(produtos.filter((p) => p._id === id)[0]);
    setProdutosCategoria(produtos.filter((pi) => produtos.filter((p) => p._id === id)[0].subcategoria.categoria._id === pi.subcategoria.categoria._id))
  }, [produtos, subcategorias, id]);
 
  return (
    <div
      style={{
        position: "relative",
        animation: "fadein 1.5s",
        marginBottom: 100,
      }}
    >
      <Row
        className="d-flex justify-content-center"
        style={{
          backgroundColor:
            theme === "dark" ? "rgb(0, 63, 106)" : "rgb(247, 113, 34)",
          height: "auto",

          marginInline: 0,
          color: "white",
          marginBottom: 10,
        }}
      >
        <div className="my-2 titulos">{produto?.nome}</div>
      </Row>
      <Container>
        <Row className=" justify-content-center align-items-start ">
          <Col md={6} lg={5} className=" d-flex justify-content-center">
            {produto && produto.imagens.length !== 0 && (
              <GaleriaProduto imagens={produto.imagens.map((i) => i.url)} />
            )}
          </Col>
          <Col className="justify-content-center pt-5">
            <Row>
              <div className="textos" style={{ textAlign: "left" }}>
                {produto?.descricao}
              </div>
              <div className="my-3 subtitulos" style={{ textAlign: "center" }}>
                {produto?.valor === 0
                  ? "Preço sob consulta"
                  : new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(produto?.valor)}
                <i className="textos" style={{ fontSize: 12 }}>
                  {"  "}
                  no pix ou boleto
                </i>
              </div>

              <div className="textos" style={{ textAlign: "left" }}>
                Entre em contato e obtenha o melhor orçamento da cidade para o
                serviços relacionados a esse produto.
              </div>
              <div>
                <Button
                  variant="success"
                  size="sm"
                  className="mt-4"
                  style={{ width: "30%" }}
                >
                  <i className="bi bi-whatsapp"></i> Whatsapp
                </Button>
              </div>
              <div className="textos" style={{ textAlign: "left" }}>
                Categorias: {produto?.subcategoria.nome} /{" "}
                {produto?.subcategoria?.categoria.nome}
              </div>
            </Row>
          </Col>
        </Row>
        <Row>
          <div
            className="titulos mt-5 mb-2"
            style={{ borderBottom: "1px solid var(--bs-body-color)" }}
          >
            Dados Técnicos
          </div>

          <div className="mb-5 d-flex row justify-content-center">
            {produto?.espTec.map((et) => {
              console.log(et);
              return (
                <Row
                  className="justify-content-center textos"
                  style={{
                    borderBottom: "1px solid rgb(194, 194, 194)",
                    width: "90%",
                  }}
                >
                  <Col className="col-6" style={{ textAlign: "left" }}>
                    {et.nome}
                  </Col>
                  <Col className="col-6" style={{ textAlign: "left" }}>
                    {et.valor}
                  </Col>
                </Row>
              );
            })}
          </div>
        </Row>
        <Row>
          <div
            className="titulos mt-5 mb-5"
            style={{ borderBottom: "1px solid var(--bs-body-color)" }}
          >
            Produtos relacionados
          </div>
          <Container>

                    <Row className="d-flex flex-wrap justify-content-center gap-5">


{produtosCategoria.map(p=>(

                    <Col className="col-auto d-flex justify-content-center">
                      <Card
                        bg={theme === "dark" ? "dark" : "light"}
                        className="p-0 larguraCard"
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                      >
                        <Card.Body>
                          <Col className="justify-content-center px-2">
                            {p.imagens.length === 0 ? (
                              <Row
                                className="justify-content-center align-items-center"
                                style={{
                                  width: "100%",
                                  marginInline: "auto",
                                  marginTop: 0,
                                  height: "250px",
                                }}
                              >
                                Sem imagens disponíveis 😒
                              </Row>
                            ) : (
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
                            )}
  
                            <Col className="d-flex flex-column justify-content-evenly ">
                              <Row
                                className="subtitulos mb-3 justify-content-center mt-3 nomeClicavel"
                                onClick={(e) => {
                                  navigate(`/ProdutoPage/${p._id}`);
                                }}
                              >
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
                            ? "Preço sob consulta"
                            : new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(p.valor)}
                        </Card.Footer>
                      </Card>
                    </Col>

))}
                    </Row>
          </Container>
        </Row>
      </Container>
    </div>
  );
}

export default ProdutoPage;
