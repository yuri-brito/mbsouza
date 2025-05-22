import { useEffect, useRef, useState } from "react";
import CarrosselHome from "../../components/CarrosselHome/CarrosselHome";
import NavBar from "../../components/NavBar/NavBar";
import { useLocation, useParams } from "react-router-dom";
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
        <Row className="gap-5">
          {produtosCategoria.map((p) => {
            return (
              <Col className="d-flex justify-content-center">
                <a
                  className="d-flex justify-content-center larguraCard"
                  href="/produtoDetail"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    bg={theme === "dark" ? "dark" : "light"}
                    className="p-0 larguraCard"
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    }}
                  >
                    <Card.Header className="titulos">
                      {p.subcategoria.categoria.nome}
                    </Card.Header>
                    <Card.Body>
                      <Col className="justify-content-center px-2">
                        <Col className="mb-4 justify-content-center">
                          <img
                            className="d-block p-0 mx-auto imgProduto"
                            src={p.imagens[0].url}
                            alt="Second slide"
                            style={{ borderRadius: 6 }}
                          />
                        </Col>
                        <Col className="d-flex flex-column justify-content-evenly ">
                          <Row
                            className="subtitulos mb-3"
                            style={{ fontWeight: 700 }}
                          >
                            {p.nome}
                          </Row>
                          <Row className="textos" style={{ textAlign: "left" }}>
                            {p.descricao}
                          </Row>
                        </Col>
                      </Col>
                    </Card.Body>
                    <Card.Footer className="textos" style={{ fontWeight: 700 }}>
                      {p.valor}
                    </Card.Footer>
                  </Card>
                </a>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default CategoriaPage;
