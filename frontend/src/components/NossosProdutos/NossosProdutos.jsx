import { Col, Row } from "react-bootstrap";

import { useEffect, useRef } from "react";
import { useState } from "react";
import Whatsapp from "../Whatsapp";
const NossosProdutos = ({ theme }) => {
  const produtosButtonRef = useRef(null);
  const produtosRef = useRef(null);
  const [menuTop, setMenuTop] = useState(0);

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
            backgroundColor: "rgb(255, 255, 255)",
            // display: "none",
            // animation: isVisible ? "fadein 0.5s" : "fadeout 0.5s",
            position: "absolute",
            height: 200,
            top: `${menuTop}px`, // logo abaixo do gatilho
            left: 0,
            right: 0,
            zIndex: 9,
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
          }}
        >
          {/* Aqui entra o looping nas categorias e subcategorias se houver */}
          Categoria A Catergoria B Categoria C
        </Row>
      )}
    </div>
  );
};

export default NossosProdutos;
