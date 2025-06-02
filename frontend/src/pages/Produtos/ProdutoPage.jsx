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
  console.log(produto);
  useEffect(() => {
    setProduto(produtos.filter((p) => p._id === id)[0]);
    //   setCategoria({ categoria: categoria, subcategoria: subcategoria });
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
            className="titulos mt-5"
            style={{ borderBottom: "1px solid var(--bs-body-color)" }}
          >
            Produtos relacionados
          </div>

          <div>Carousel</div>
        </Row>
      </Container>
    </div>
  );
}

export default ProdutoPage;
