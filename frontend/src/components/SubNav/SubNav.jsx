import { Col, Row } from "react-bootstrap";
import "./SubNav.css";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
const SubNav = ({ theme }) => {
  const navigate = useNavigate();
  return (
    <div
      className="footerWrap row  d-flex align-items-center"
      style={{
        width: "80%",
        backgroundColor: "var(--bs-body-bg)",
        color: "var(--bs-body-color)",
        fontSize: 16,
        paddingBlock: 2,
        height: 40,
        zIndex: 9999,
        // marginTop: "100vw",
        marginInline: "auto",
        borderTop: "1px solid var(--bs-body-color)",
      }}
    >
      <Row className="d-flex m-0  justify-content-evenly align-items-center wraper">
        <Col
          xs="auto"
          className="mx-4 meioRedes contatoEmail"
          onClick={() => navigate("/Contato")}
          style={{ cursor: "pointer" }}
        >
          {" "}
          <i
            className="bi bi-envelope-at icon"
            style={{ fontWeight: "bold" }}
          ></i>{" "}
          mbsouza@gmail.com....
        </Col>
        <Col xs="auto" className="mx-4 meioRedes">
          {" "}
          <a
            href="https://wa.me/5521969991819?text=Ol%C3%A1%2C%20estou%20interessado%20em%20seus%20produtos."
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <i
              className="bi bi-whatsapp icon"
              style={{ fontWeight: "bold" }}
            ></i>{" "}
            <i
              className="contatoZap"
              style={{
                fontStyle: "normal",
                fontWeight: 450,
              }}
            >
              {"(21) 96999-1819"}
            </i>
          </a>
        </Col>
        {/* <Col xs="auto" className="mx-4 meioRedes">
          <i className="bi bi-twitter-x"></i> Twitter-x
        </Col> */}
      </Row>
      {/* <Row className="d-flex m-0 justify-content-center mt-1">
        <Col>
          {" "}
          Copyright <i className="bi bi-c-circle"></i> MBSOUZA Tratamento
          Térmico
        </Col>
      </Row> */}
    </div>
  );
};

export default SubNav;
