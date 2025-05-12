import { useContext, useRef } from "react";
import {
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Row,
  Col,
} from "react-bootstrap";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";

function Perfil({ animationClass, setAnimationClass }) {
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dropDownRef = useRef(null);
  return (
    <DropdownButton
      // as={ButtonGroup}
      className="dropdownPerfil"
      variant="success"
      ref={dropDownRef}
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
      title={
        <Row className="m-0 d-flex align-items-end">
          {loggedUser.userData.profileImg &&
          loggedUser.userData.profileImg.url !== "" ? (
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
                  boxShadow:
                    "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                }}
              >
                <img
                  src={loggedUser.userData.profileImg.url}
                  alt="imagem de perfil"
                  style={{
                    position: "absolute",
                    width: loggedUser.userData.profileImg.imageSize * 0.18,
                    // height: urlProfileImg ? 150 : 100,

                    objectFit: "cover",

                    transform: `translate(${
                      loggedUser.userData.profileImg.position.x * 0.18
                    }px, ${
                      loggedUser.userData.profileImg.position.y * 0.18
                    }px)`,
                  }}
                />
              </div>
            </Col>
          ) : (
            <Col
              className="p-0  profileImgButton d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "var(--bs-body-bg)",
                marginRight: 2,
                color: "var(--bs-text-color)",
              }}
            >
              {loggedUser.userData.nome &&
                loggedUser.userData.nome[0].toUpperCase() +
                  loggedUser.userData.nome
                    .split(" ")
                    .slice(-1)[0][0]
                    .toUpperCase()}
            </Col>
          )}
          <Col
            className={`p-0 animate__animated ${animationClass}`}
            onAnimationEnd={() => setAnimationClass("")}
            style={{ marginLeft: 2, color: "var(--bs-text-color)" }}
          >
            {loggedUser.userData.nome && loggedUser.userData.nome.split(" ")[0]}
          </Col>
        </Row>
      }
      size="sm"
      align="end"
    >
      <Dropdown.Item
        eventKey="0"
        style={{ paddingInline: 12 }}
        onClick={(e) => {
          e.preventDefault;
          navigate("/");
        }}
        active={pathname === "/"}
      >
        <i className="bi bi-house-door"></i> Home
      </Dropdown.Item>

      <Dropdown.Item
        eventKey="1"
        style={{ paddingInline: 12 }}
        onClick={(e) => {
          e.preventDefault;
          navigate("/ProfilePage");
        }}
        active={pathname === "/ProfilePage"}
      >
        <i className="bi bi-person"></i> Perfil
      </Dropdown.Item>
      <Dropdown.Item eventKey="2" style={{ paddingInline: 12 }}>
        <i className="bi bi-bag-heart"></i> Lista de desejos
      </Dropdown.Item>
      <Dropdown.Item eventKey="3" style={{ paddingInline: 12 }}>
        <i className="bi bi-lightning-charge"></i> Categorias mais acessadas
      </Dropdown.Item>
      <Dropdown.Item eventKey="3" style={{ paddingInline: 12 }}>
        <i className="bi bi-coin"></i> Minhas ofertas
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item
        eventKey="4"
        onClick={(e) => {
          setLoggedUser(null);
          localStorage.clear();
          navigate("/");
        }}
        style={{ paddingInline: 12 }}
      >
        <i className="bi bi-x-circle"></i> Sair
      </Dropdown.Item>
    </DropdownButton>
  );
}

export default Perfil;
