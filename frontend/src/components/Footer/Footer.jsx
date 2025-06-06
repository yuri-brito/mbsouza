import { Col, Row } from "react-bootstrap";
import "./Footer.css";
const Footer = (props) => {
  return (
    <div
      className="footerWrap row m-0 d-flex align-items-center"
      style={{
        // position: "fixed",
        width: "100%",
        backgroundColor: "var(--bs-body-color)",
        color: "var(--bs-body-bg)",
        fontSize: 11,
        paddingBlock: 2,
        height: 40,
      }}
    >
      <Row className="d-flex m-0  justify-content-center">
        <Col xs="auto" className="mx-4 meioRedes">
          {" "}
          <i className="bi bi-instagram"></i> Instagram
        </Col>
        <Col xs="auto" className="mx-4 meioRedes">
          {" "}
          <i className="bi bi-tiktok"></i> Tik Tok
        </Col>
        <Col xs="auto" className="mx-4 meioRedes">
          <i className="bi bi-twitter-x"></i> Twitter-x
        </Col>
      </Row>
      <Row className="d-flex m-0 justify-content-center mt-1">
        <Col>
          {" "}
          Copyright <i className="bi bi-c-circle"></i> MBSOUZA Tratamento
          Térmico
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
