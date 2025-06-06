import { Row } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import "./EmpresaPage.css";
function EmpresaPage() {
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
        <h2 className="my-4 titulos">EMPRESA</h2>
      </Row>
      <Row
        className="d-flex justify-content-center my-0 p-0 larguraCustom"
        style={{
          color:
            theme === "dark" ? "var(--bs-body-color)" : "rgb(101, 101, 101)",
          marginInline: "auto",
        }}
      >
        <h5
          className="titulos mb-4"
          style={{
            color: "var(--bs-body-color)",
            width: "100%",
            textAlign: "center",
            fontWeight: "bolder",
            borderBottom: "2px solid rgb(204, 204, 204)",
            paddingBottom: 20,
          }}
        >
          MBS - COMÉRCIO E SERVIÇO DE INSTALAÇÕES
        </h5>
        <p
          className="textos mb-4"
          style={{ width: "100%", textAlign: "left", marginInline: "auto" }}
        >
          Com quase duas décadas de atuação no mercado, a{" "}
          <b
            style={
              {
                // color: "red",
              }
            }
          >
            {" "}
            MBS Comércio e Serviços de Instalações
          </b>
          , se consolidou como referência no segmento de
          <b> aquecimento de piscinas e residências</b>.
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
          Experiência no mercado
        </p>
        <p
          className="textos mb-4"
          style={{ width: "100%", textAlign: "left", marginInline: "auto" }}
        >
          Nossa experiência e compromisso com a excelência nos permitem oferecer
          soluções completas, seguras e eficientes para o conforto térmico de
          nossos clientes.
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
          Qualidade e eficiência
        </p>
        <p
          className="textos mb-4"
          style={{ width: "100%", textAlign: "left", marginInline: "auto" }}
        >
          Trabalhamos com a{" "}
          <b
            style={
              {
                // color: "red",
              }
            }
          >
            venda de equipamentos e acessórios de alta qualidade
          </b>
          , sempre acompanhando as inovações do setor para garantir o melhor
          desempenho e durabilidade.
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
          Foco no cliente
        </p>
        <p
          className="textos mb-4"
          style={{ width: "100%", textAlign: "left", marginInline: "auto" }}
        >
          Além disso, oferecemos{" "}
          <b
            style={
              {
                // color: "red",
              }
            }
          >
            projetos personalizados de dimensionamento e instalação
          </b>
          , com atendimento técnico especializado e foco total na{" "}
          <b>satisfação do cliente</b>.
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
          Missão e valores
        </p>
        <p
          className="textos mb-4"
          style={{ width: "100%", textAlign: "left", marginInline: "auto" }}
        >
          Na MBS, cada projeto é tratado com seriedade, transparência e
          responsabilidade, garantindo não apenas conforto, mas também economia
          e eficiência energética. Nossa missão é proporcionar bem-estar e
          segurança, com serviços sob medida para residências, condomínios,
          clubes e empreendimentos comerciais.
        </p>
        <h5
          className="subtitulos wordart-gradient mb-5 mt-4"
          style={{
            color: "var(--bs-body-color)",
            width: "100%",
            textAlign: "center",
            fontWeight: "bolder",
            borderBlock: "2px solid rgb(204, 204, 204)",
            paddingBlock: 10,
          }}
        >
          MBS: QUASE 20 ANOS TRANSFORMANDO ENERGIA EM CONFORTO
        </h5>
      </Row>
    </div>
  );
}

export default EmpresaPage;
