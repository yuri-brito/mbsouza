import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Navbar,
  Row,
} from "react-bootstrap";
import "./NavBar.css";
import solNavbar from "../../assets/NavBar/sol_navbar.png";
import luaNavbar from "../../assets/NavBar/lua_navbar.png";
import logo from "../../assets/NavBar/logo.png";
import Buscador from "./Buscador";
import Menu from "./Menu";
import { AuthContext } from "../../contexts/authContext";
import { useContext } from "react";
import Perfil from "./Perfil";
import CriarConta from "./CriarConta";
import Login from "./Login";
import MyLogo from "../../../public/logo.png";
import MyLogow from "../../../public/logo.png";
import { Link, useNavigate } from "react-router-dom";
import SubNav from "../SubNav/SubNav";
import Home from "./Home";
import Empresa from "./Empresa";
import Informacoes from "./Informacoes";
import Contato from "./Contato";
import MenuPerfil from "./MenuPerfil";
function NavBar({ theme, setTheme }) {
  // const [theme, setTheme] = useState("");
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const divRef = useRef(null);
  const [animationClass, setAnimationClass] = useState("");
  useEffect(() => {
    const getTheme = () => {
      const browserTema = window.matchMedia("(prefers-color-scheme: dark)");
      if (browserTema.matches) {
        setTheme("dark");
        document.documentElement.setAttribute("data-bs-theme", "dark");
      } else if (new Date().getHours() > 18 && new Date().getHours() < 7) {
        setTheme("dark");
        document.documentElement.setAttribute("data-bs-theme", "dark");
      } else {
        setTheme("light");
        document.documentElement.setAttribute("data-bs-theme", "light");
      }
      const handleChange = (e) => {
        setTheme(e.matches ? "dark" : "light");
        document.documentElement.setAttribute(
          "data-bs-theme",
          e.matches ? "dark" : "light"
        );
      };

      browserTema.addEventListener("change", handleChange);

      return () => {
        browserTema.removeEventListener("change", handleChange);
      };
    };
    getTheme();
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-bs-theme", newTheme);
  };
  return (
    <Navbar
      ref={divRef}
      className="col-md-auto p-0"
      id="navBarPincipal"
      style={{
        background:
          theme === "dark"
            ? " linear-gradient(165deg, rgba(0, 105, 148, 1) 0%, rgba(0, 65, 106, 1) 100%)"
            : " linear-gradient(165deg, rgba(173, 216, 230, 1) 0%, rgba(0, 191, 255, 1) 100%)",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        animation: "fadein 1.5s",
        position: "fixed",
        top: 0,
        width: "100%",
        height: "9vw",
        minHeight: 90,

        zIndex: 999,
        color: "var(--bs-text-color)",
      }}
    >
      <Col className="navBarConteudo" style={{ height: "100%" }}>
        <Row
          className="d-flex justify-content-evenly align-items-center m-0"
          style={{ height: "100%" }}
        >
          <Col className="col-3 justify-content-center align-items-center p-0">
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: 16,
                whiteSpace: "nowrap",
              }}
              className=""
            >
              <Image
                src={theme === "dark" ? MyLogow : MyLogo}
                alt="logo"
                style={{
                  // filter: theme === "dark" ? "invert(20)" : "",
                  width: "9vw",
                  // height: 50,
                  maxWidth: 1000,
                  minWidth: 70,
                }}
              ></Image>
            </Link>
          </Col>
          <Col
            className="col-6 d-flex flex-column justify-content-evenly"
            style={{ height: "100%" }}
          >
            <Row
              className="d-flex justify-content-evenly align-items-center m-0"
              style={{ height: "100%" }}
            >
              <Col
                xs="auto"
                className="d-flex justify-content-center gap-2 menuGrande"
              >
                <Home />
                <Empresa />
                <Informacoes />
                <Contato />
              </Col>
              <Col
                xs="auto"
                className="d-flex justify-content-center menuPequeno w-100"
              >
                <Menu />
              </Col>
              <Col xs="auto" className="d-flex justify-content-center">
                <Buscador />
              </Col>
            </Row>
          </Col>
          <Col
            className="col-3 d-flex flex-column justify-content-evenly solLuaCol"
            style={{ height: "100%" }}
          >
            {/* <Row
                className="d-flex justify-content-evenly align-items-center m-0 "
                style={{ height: "100%" }}
              > */}
            {loggedUser ? (
              <>
                <Col className="col-md-auto d-flex justify-content-center gap-2 ">
                  <Row className="d-flex align-items-center justify-content-end m-0">
                    <Col xs="auto" className="px-1">
                      <Perfil
                        animationClass={animationClass}
                        setAnimationClass={setAnimationClass}
                      />
                    </Col>
                  </Row>
                </Col>
              </>
            ) : (
              <>
                <Col className="col-md-auto d-flex justify-content-center gap-2 menuPerfil">
                  <Row className="d-flex align-items-center justify-content-end m-0">
                    <Col xs="auto" className="px-1">
                      <CriarConta />
                    </Col>
                    <Col xs="auto" className="px-1">
                      <Login />
                    </Col>
                  </Row>
                </Col>
                <Col
                  xs="auto"
                  className="d-flex justify-content-center menuPerfilPequeno w-100"
                >
                  <MenuPerfil />
                </Col>
              </>
            )}

            <Col xs="auto" className="d-flex justify-content-center">
              {/* <Row className="d-flex justify-content-center">Saudação</Row> */}
              <Row className="d-flex justify-content-center align-items-center">
                <Col className="d-flex justify-content-end p-0 col">
                  <Image
                    src={solNavbar}
                    alt="sun_image"
                    style={{
                      filter: theme === "dark" ? "invert(1)" : "",
                      width: "1.4vw",
                      maxWidth: 15,
                      minWidth: 10,
                    }}
                  ></Image>
                </Col>
                <Col
                  xs="auto solLua"
                  className="d-flex col-md-auto align-items-center justify-content-center"
                >
                  <Form.Check
                    type="switch"
                    className="p-0"
                    style={{ width: "3vw", minWidth: 10 }}
                  >
                    <Form.Check.Input
                      isValid
                      style={{
                        cursor: "pointer",
                        width: "2vw",
                        maxWidth: 20,
                        minWidth: 12,
                        height: "1vw",
                        maxHeight: 9,
                        minHeight: 5,
                        marginTop: 10,
                        marginLeft: 0,
                      }}
                      checked={theme === "dark"}
                      onChange={toggleTheme}
                    />
                  </Form.Check>
                </Col>
                <Col className="d-flex justify-content-start p-0 col">
                  <Image
                    src={luaNavbar}
                    alt="sun_image"
                    style={{
                      filter: theme === "dark" ? "invert(1)" : "",
                      width: "1.4vw",
                      maxWidth: 18,
                      minWidth: 9,
                    }}
                  ></Image>
                </Col>
              </Row>
            </Col>
            {/* </Row> */}
          </Col>
        </Row>
      </Col>
    </Navbar>
  );
}

export default NavBar;
