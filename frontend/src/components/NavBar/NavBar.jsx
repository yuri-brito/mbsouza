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
import MyLogo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
function NavBar() {
  const [theme, setTheme] = useState("");
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
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
      className="col-md-auto"
      id="navBarPincipal"
      style={{
        background:
          theme === "dark"
            ? " linear-gradient(165deg, rgba(102,131,166,1) 0%, rgba(118,150,94,1) 100%)"
            : " linear-gradient(165deg, rgba(102,131,166,1) 0%, rgba(118,150,94,1) 100%)",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        animation: "fadein 1.5s",
        position: "fixed",
        top: 0,
        width: "100%",
        height: 85,

        zIndex: 999,
        color: "var(--bs-text-color)",
      }}
    >
      <Col className="navBarConteudo" style={{}}>
        <Row className="d-flex justify-content-evenly align-items-center m-0 mb-1">
          <Col xs="auto" className="col p-0">
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
                src={MyLogo}
                alt="logo"
                style={{
                  filter: theme === "dark" ? "invert(1)" : "",
                  width: "10vw",
                  // height: 50,
                  // maxWidth: 100,
                  minWidth: 60,
                }}
              ></Image>
            </Link>
          </Col>
          <Col xs="auto" className="col-md-auto">
            <Buscador />
          </Col>
          <Col xs="auto" className="col-md-auto ">
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
                xs="auto"
                className="d-flex col-md-auto align-items-center justify-content-center px-1"
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
                      minWidth: 10,
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
                    minWidth: 8,
                  }}
                ></Image>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="d-flex align-items-center m-0">
          <Col>
            <Menu />
          </Col>
          {loggedUser ? (
            <Col>
              <Row className="d-flex align-items-center justify-content-end m-0">
                <Col xs="auto" className="px-1">
                  <Perfil
                    animationClass={animationClass}
                    setAnimationClass={setAnimationClass}
                  />
                </Col>
              </Row>
            </Col>
          ) : (
            <Col>
              <Row className="d-flex align-items-center justify-content-end m-0">
                <Col xs="auto" className="px-1">
                  <CriarConta />
                </Col>
                <Col xs="auto" className="px-1">
                  <Login />
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Col>
    </Navbar>
  );
}

export default NavBar;
