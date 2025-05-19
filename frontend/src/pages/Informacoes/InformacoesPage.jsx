import { useEffect, useRef, useState } from "react";
import CarrosselHome from "../../components/CarrosselHome/CarrosselHome";
import NavBar from "../../components/NavBar/NavBar";
import { useLocation } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";

function InformacoesPage({ theme }) {
  return (
    <div style={{ position: "relative", animation: "fadein 1.5s" }}>
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
        <h2 className="my-4 titulos">INFORMAÇÕES</h2>
      </Row>
      <Row className="d-flex justify-content-start">
        <h5 className="subtitulos" style={{ width: "60%", textAlign: "left" }}>
          Solidez no mercado
        </h5>
        <p className="textos" style={{ width: "60%", textAlign: "left" }}>
          A MB Souza é sinônimo de confiança e experiência em instalações de
          aquecedores e boilers. Com um histórico de mais de 25 anos, sempre
          estivemos na vanguarda em soluções aquecedoras com os princípios
          técnicos de excelência, segurança e eficiência.
        </p>
      </Row>
    </div>
  );
}

export default InformacoesPage;
