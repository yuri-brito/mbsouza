import { Col, Container, Row } from "react-bootstrap";

import { useEffect, useRef } from "react";
import { useState } from "react";
import Whatsapp from "../Whatsapp";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import "./NossosProdutos.css";
import { useNavigate } from "react-router-dom";
const NossosProdutos = ({ produtos, categorias, subcategorias }) => {
  const navigate = useNavigate();
  const { theme } = useContext(AuthContext);
  const produtosButtonRef = useRef(null);
  const produtosRef = useRef(null);
  const [menuTop, setMenuTop] = useState(0);
  const categoriasUtilizadas = [
    ...produtos.map((p) => p.subcategoria._id),
    ...produtos.map((p) => p.subcategoria.categoria._id),
  ];
  const atualizarTop = () => {
    if (produtosButtonRef.current) {
      const rect = produtosButtonRef.current.getBoundingClientRect();
      setMenuTop(rect.height); // ou rect.bottom se for `fixed`
    }
  };
  useEffect(() => {
    atualizarTop(); // calcula inicialmente

    window.addEventListener("resize", atualizarTop); // recalcula em resize

    return () => window.removeEventListener("resize", atualizarTop); // cleanup
  }, []);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true); // renderiza o componente
    }
  }, [isVisible]);
  return (
    <div
      ref={produtosButtonRef}
      className=" row  d-flex align-items-center p-0"
      style={{
        width: "100%",
        backgroundColor: "var(--bs-body-bg)",
        color: "var(--bs-body-color)",
        fontSize: 16,
        paddingBlock: 2,
        zIndex: 1,
        // marginTop: "100vw",
        marginInline: "auto",
        position: "relative",
      }}
    >
      <Whatsapp />
      <Col
        className="p-0 m-0 d-flex "
        style={{
          backgroundColor:
            theme === "dark" ? "rgb(49, 49, 49)" : "rgb(245, 245, 245)",
          cursor: "pointer",
          position: "relative",
          height: "100%",
        }}
      >
        <i
          className={"bi bi-list hamburguer p-2"}
          style={{
            animation: "fadein 1.5s",
            marginRight: 2,
            display: "flex", // <-- aqui
            alignItems: "center",
          }}
          onMouseEnter={() => {
            setIsVisible(true);
          }}
          onMouseLeave={() => {
            setIsVisible(false);
          }}
          // onMouseEnter={(e) => {
          //   if (produtosRef.current) {
          //     produtosRef.current.style.display = "flex";
          //   }
          //   // if (produtosButtonRef.current) {
          //   //   produtosButtonRef.current.children[0].className = "bi bi-x-lg";
          //   // }
          // }}
          // onMouseLeave={(e) => {
          //   if (produtosRef.current) {
          //     produtosRef.current.style.display = "none";
          //   }
          //   // if (produtosButtonRef.current) {
          //   //   produtosButtonRef.current.children[0].className = "bi bi-list";
          //   // }
          // }}
        >
          <b
            className="nProdutos"
            style={{
              fontStyle: "normal",
              fontWeight: 500,
              marginLeft: 6,
            }}
          >
            Nossos produtos
          </b>
        </i>
      </Col>
      {shouldRender && (
        <Row
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          // onMouseEnter={(e) => {
          //   if (produtosRef.current) {
          //     produtosRef.current.style.display = "flex";
          //   }
          //   // if (produtosButtonRef.current) {
          //   //   produtosButtonRef.current.children[0].className = "bi bi-x-lg";
          //   // }
          // }}
          // onMouseLeave={(e) => {
          //   if (produtosRef.current) {
          //     produtosRef.current.style.display = "none";
          //   }
          //   // if (produtosButtonRef.current) {
          //   //   produtosButtonRef.current.children[0].className = "bi bi-list";
          //   // }
          // }}
          ref={produtosRef}
          className={`m-0 ${isVisible ? "fadein" : "fadeout"}`}
          onAnimationEnd={() => {
            if (!isVisible) setShouldRender(false); // só remove após fadeout
          }}
          style={{
            backgroundColor: theme === "dark" ? "rgb(33, 37, 41)" : "white",
            // display: "none",
            // animation: isVisible ? "fadein 0.5s" : "fadeout 0.5s",
            position: "absolute",
            // height: 200,
            top: `${menuTop}px`, // logo abaixo do gatilho
            left: 0,
            right: 0,
            zIndex: 9,
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
          }}
        >
          <Container>
            <Row className="d-flex flex-wrap">
              {categorias.map((c) => {
                return (
                  <Col
                    key={c._id}
                    className="mb-3 "
                    style={{
                      flex: "0 1 25%", // importante: permite quebra para nova linha
                      minWidth: 140,
                      maxWidth: "100%", // impede overflow lateral
                    }}
                  >
                    <Row
                      as={"div"}
                      className={
                        categoriasUtilizadas.includes(c._id)
                          ? "subtitulos hoverSet"
                          : "subtitulos"
                      }
                      style={{
                        whiteSpace: "nowrap",
                        cursor: categoriasUtilizadas.includes(c._id)
                          ? "pointer"
                          : "normal",
                        fontWeight: 700,
                        color: !categoriasUtilizadas.includes(c._id) && "gray",
                      }}
                      onClick={() => {
                        if (categoriasUtilizadas.includes(c._id)) {
                          navigate(`/CategoriaPage/${c._id}`);
                          setIsVisible(false);
                        }
                      }}
                    >
                      {c.nome}
                    </Row>
                    {subcategorias
                      .filter((s) => s.categoria._id === c._id)
                      .map((s) => {
                        return (
                          <Row
                            className={
                              categoriasUtilizadas.includes(s._id)
                                ? "textos ms-1 hoverSet"
                                : "textos ms-1"
                            }
                            style={{
                              whiteSpace: "nowrap",
                              cursor: categoriasUtilizadas.includes(s._id)
                                ? "pointer"
                                : "normal",
                              color:
                                !categoriasUtilizadas.includes(s._id) && "gray",
                            }}
                            onClick={() => {
                              if (categoriasUtilizadas.includes(s._id)) {
                                navigate(`/CategoriaPage/${s._id}`);
                                setIsVisible(false);
                              }
                            }}
                          >
                            {s.nome}
                          </Row>
                        );
                      })}
                  </Col>
                );
              })}
            </Row>
          </Container>
          {/* Aqui entra o looping nas categorias e subcategorias se houver */}
        </Row>
      )}
    </div>
  );
};

export default NossosProdutos;
