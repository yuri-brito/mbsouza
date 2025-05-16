import { Row } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import "./CarrosselHome.css";
import { useEffect } from "react";
import { useState } from "react";
function CarrosselHome() {
  const [controlsVis, setControlsVis] = useState(false);

  //fazer chamada puxando os produtos em superdestaque

  return (
    <Carousel
      className="carrosselHome"
      id="carrosselHome"
      style={{
        width: "100%",
        marginInline: "auto",
        // marginTop: 400,
      }}
      controls={controlsVis}
      onMouseEnter={(e) => {
        setControlsVis(true);
      }}
      onMouseLeave={(e) => {
        setControlsVis(false);
      }}
      indicators={controlsVis}
    >
      <Carousel.Item>
        <Row className="d-flex justify-content-center m-0 " style={{}}>
          <img
            className="d-block p-0"
            src="https://http2.mlstatic.com/D_NQ_987215-MLA77434348834_072024-OO.webp"
            alt="Second slide"
          />
        </Row>
      </Carousel.Item>
      <Carousel.Item>
        <Row className="d-flex justify-content-center m-0" style={{}}>
          <img
            className="d-block p-0"
            src="https://http2.mlstatic.com/D_NQ_985070-MLA77657343625_072024-OO.webp"
            alt="Second slide"
          />
        </Row>
      </Carousel.Item>
      <Carousel.Item>
        <Row className="d-flex justify-content-center m-0" style={{}}>
          <img
            className="d-block p-0"
            src="https://http2.mlstatic.com/D_NQ_748411-MLA77413407552_072024-OO.webp"
            alt="Second slide"
          />
        </Row>
      </Carousel.Item>
      <Carousel.Item>
        <Row className="d-flex justify-content-center m-0" style={{}}>
          <img
            className="d-block p-0"
            src="https://http2.mlstatic.com/D_NQ_701062-MLA77411272444_072024-OO.webp"
            alt="Second slide"
          />
        </Row>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarrosselHome;
