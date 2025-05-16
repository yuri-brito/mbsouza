import { useContext, useEffect } from "react";
import {
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Row,
  Col,
} from "react-bootstrap";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import { useRef, useState } from "react";

function Menu() {
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const [showDrop, setShowDrop] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dropDownRef = useRef(null);

  useEffect(() => {
    const element = dropDownRef.current;

    // Cria um MutationObserver para observar mudanças nas classes
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          // console.log("As classes foram alteradas:", element.classList);
          setShowDrop(Array.from(element.classList).includes("show"));
        }
      }
    });

    // Configura o observer para observar mudanças no atributo 'class'
    observer.observe(element, { attributes: true });

    // Limpeza: desconecta o observer quando o componente é desmontado
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <DropdownButton
      // as={"button"}
      ref={dropDownRef}
      className="dropdownMenu"
      onMouseDown={(e) => {
        dropDownRef.current.style.boxShadow = "none";
      }}
      onMouseUp={(e) => {
        dropDownRef.current.style.boxShadow =
          " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
      }}
      style={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
      variant="success"
      title={
        <Row className="m-0">
          <Col
            className="col-md-auto p-0  d-flex flex-column align-items-end justify-content-center"
            style={{ position: "relative" }}
          >
            <div
              className="d-flex profileImgButton justify-content-center align-items-center "
              style={{
                // width: 50,
                // height: 50,
                position: "relative",
                borderRadius: "50%",
                overflow: "hidden",
                color: "var(--bs-text-color)",
                fontSize: 12,
              }}
            >
              {showDrop ? (
                <i
                  className="bi bi-x-lg animate__animated "
                  style={{ animation: "fadein 1.5s" }}
                ></i>
              ) : (
                <p
                  style={{ fontSize: 14, animation: "fadein 1.5s" }}
                  className="bi bi-list animate__animated  p-0 m-0"
                ></p>
              )}
            </div>
          </Col>

          <Col
            className={`p-0`}
            style={{
              marginLeft: 2,
              color: "var(--bs-text-color)",
              fontWeight: 500,
              boxShadow: "none",
            }}
          >
            Menu
          </Col>
        </Row>
      }
      size="sm"
      align="middle"
    >
      <Dropdown.Item
        eventKey="0"
        style={{ paddingInline: 12 }}
        onClick={(e) => navigate("/")}
      >
        <i className="bi bi-house-door"></i> Home
      </Dropdown.Item>

      <Dropdown.Item
        eventKey="1"
        style={{ paddingInline: 12 }}
        onClick={(e) => navigate("/Empresa")}
      >
        <i className="bi bi-building"></i> Empresa
      </Dropdown.Item>
      <Dropdown.Item
        eventKey="2"
        style={{ paddingInline: 12 }}
        onClick={(e) => navigate("/Informacoes")}
      >
        <i className="bi bi-info-circle"></i> Informações
      </Dropdown.Item>
      <Dropdown.Item
        eventKey="3"
        style={{ paddingInline: 12 }}
        onClick={(e) => navigate("/Contato")}
      >
        <i className="bi bi-people"></i> Contato
      </Dropdown.Item>
      {/* <Dropdown.Item eventKey="3" style={{ paddingInline: 12 }}>
        <i className="bi bi-coin"></i> Minhas ofertas
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item eventKey="4" style={{ paddingInline: 12 }}>
        <i className="bi bi-x-circle"></i> Sair
      </Dropdown.Item> */}
    </DropdownButton>
  );
}

export default Menu;
