import { Row } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import "./InformacoesPage.css";
function InformacoesPage() {
  const { theme } = useContext(AuthContext);
  return (
    <div
      style={{
        position: "relative",
        animation: "fadein 1.5s",
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
        <h2 className="my-4 titulos">INFORMAÇÕES</h2>
      </Row>
      <Row
        className="d-flex justify-content-center my-0 p-0  larguraCustom"
        style={{
          color:
            theme === "dark" ? "var(--bs-body-color)" : "rgb(101, 101, 101)",
          marginInline: "auto",
        }}
      >
        <h5
          className="titulos  mb-4 "
          style={{
            color: "var(--bs-body-color)",
            width: "100%",
            textAlign: "center",
            fontWeight: "bolder",
            borderBottom: "2px solid rgb(204, 204, 204)",
            paddingBottom: 20,
          }}
        >
          Bem-vindo à MBS - Comércio e Serviços de Instalações
        </h5>
        <p
          className="textos mb-4"
          style={{ width: "100%", textAlign: "left", marginInline: "auto" }}
        >
          Há quase 20 anos no mercado, a <b>MBS</b> é especialista em{" "}
          <b>
            aquecimento de piscinas, residências e demais empreendimentos
            comerciais
          </b>
          , oferecendo soluções completas para quem busca conforto, economia e
          eficiência.
        </p>

        <p
          className="textos mb-4"
          style={{ width: "100%", textAlign: "left", marginInline: "auto" }}
        >
          Trabalhamos com a{" "}
          <b>
            venda de equipamentos e acessórios de alta performance e
            durabilidade
          </b>
          . Além disso, desenvolvemos{" "}
          <b>projetos personalizados de dimensionamento e instalação</b>, com
          atendimento técnico qualificado e garantia de satisfação.
        </p>
        <p
          className="subtitulos mb-2"
          style={{
            width: "100%",
            textAlign: "left",
            marginInline: "auto",
            borderBottom: "2px solid rgb(204, 204, 204)",
          }}
        >
          Nosso compromisso é entregar sempre o melhor:
        </p>
        <p
          className="textos mb-4"
          style={{ width: "100%", textAlign: "left", marginInline: "auto" }}
        >
          <ul className="ps-2">
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Atendimento transparente
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Equipamentos de ponta
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Instalação segura e eficiente
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Suporte especializado
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Soluções sob medida para residências, condomínios, clubes e
              empreendimentos
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Frete grátis dentro do Município do Rio de Janeiro
            </li>
          </ul>
        </p>

        <p
          className="subtitulos mb-2"
          style={{
            width: "100%",
            textAlign: "left",
            marginInline: "auto",
            borderBottom: "2px solid rgb(204, 204, 204)",
          }}
        >
          Nossos serviços:
        </p>
        <p
          className="textos mb-4"
          style={{ width: "100%", textAlign: "left", marginInline: "auto" }}
        >
          <ul className="ps-2">
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Venda de equipamentos e acessórios
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Projetos personalizados de tratamento térmico
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Instalação técnica especializada
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Suporte e pós-venda
            </li>
          </ul>
        </p>

        <p
          className="subtitulos mb-2"
          style={{
            width: "100%",
            textAlign: "left",
            marginInline: "auto",
            borderBottom: "2px solid rgb(204, 204, 204)",
          }}
        >
          Por que escolher a MBS?
        </p>
        <p
          className="textos mb-4"
          style={{ width: "100%", textAlign: "left", marginInline: "auto" }}
        >
          <ul className="ps-2">
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Atendimento profissional e transparente
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Equipamentos de alto desempenho
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Instalação segura e eficiente
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Projetos sob medida
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="green"
                style={{
                  minWidth: "20px",
                  minHeight: "20px",
                  flexShrink: 0, // evita que ele encolha dentro de flex
                }}
              >
                <path d="M7.629 13.314l-3.657-3.657 1.414-1.414L7.63 10.486l6.586-6.586 1.414 1.414z" />
              </svg>
              Garantia de satisfação
            </li>
          </ul>
        </p>
        <p
          className="subtitulos mb-2"
          style={{
            width: "100%",
            textAlign: "left",
            marginInline: "auto",
            borderBottom: "2px solid rgb(204, 204, 204)",
          }}
        >
          Precisa de um projeto de aquecimento?
        </p>
        <p
          className="textos mb-4"
          style={{ width: "100%", textAlign: "left", marginInline: "auto" }}
        >
          <ul className="ps-2">
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              Desenvolvemos soluções completas para residências, condomínios,
              clubes e empreendimentos comerciais
            </li>
          </ul>
        </p>
        <p
          className="subtitulos mb-2"
          style={{
            width: "100%",
            textAlign: "left",
            marginInline: "auto",
            borderBottom: "2px solid rgb(204, 204, 204)",
          }}
        >
          Conforto térmico começa com a MBS
        </p>
        <p
          className="textos mb-4"
          style={{ width: "100%", textAlign: "left", marginInline: "auto" }}
        >
          <ul className="ps-2">
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              Fale com a gente e descubra como podemos transformar sua
              experiência com tratamento térmico, garantindo uma nova forma de
              viver os melhores momentos
            </li>
          </ul>
        </p>
      </Row>
    </div>
  );
}

export default InformacoesPage;
