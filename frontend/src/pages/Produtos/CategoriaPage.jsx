import { useEffect, useRef, useState } from "react";
import CarrosselHome from "../../components/CarrosselHome/CarrosselHome";
import NavBar from "../../components/NavBar/NavBar";
import { useLocation, useParams } from "react-router-dom";
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
function CategoriaPage({ produtos, subcategorias }) {
  const { theme } = useContext(AuthContext);
  const { id } = useParams();
  const [produtosCategoria, setProdutosCategoria] = useState([]);
  const [categoria, setCategoria] = useState({});
  useEffect(() => {
    setProdutosCategoria(
      produtos.filter((p) => {
        console.log(
          p.subcategoria._id === id || p.subcategoria.categoria._id === id
        );
        return p.subcategoria._id === id || p.subcategoria.categoria._id === id;
      })
    );
    let categoria;
    let subcategoria;
    if (subcategorias.filter((s) => s._id === id).length === 0) {
      subcategoria = "";
      categoria = subcategorias.filter((s) => s.categoria._id === id)[0]
        ?.categoria.nome;
    } else {
      subcategoria = subcategorias.filter((s) => s._id === id)[0]?.nome;
      categoria = subcategorias.filter((s) => s._id === id)[0]?.categoria.nome;
    }
    setCategoria({ categoria: categoria, subcategoria: subcategoria });
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
          marginBottom: 50,
        }}
      >
        <h2 className="my-4 titulos">
          {categoria.categoria}
          {categoria.subcategoria === "" ? `` : ` - ${categoria.subcategoria}`}
        </h2>
      </Row>
      <Container>
        <Row className="d-flex flex-wrap justify-content-center gap-5">
          {produtosCategoria.map((p) => {
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
    </div>
  );
}

export default CategoriaPage;
