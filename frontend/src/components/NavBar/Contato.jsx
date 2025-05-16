import { useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import api from "../../api/api";
import { SpinnerDotted } from "spinners-react";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";

function Contato(props) {
  const navigate = useNavigate();
  return (
    <>
      <Button
        size="sm"
        className="menuHorizontalButton"
        variant="success"
        onClick={() => navigate("/Contato")}
        onMouseDown={(e) => {
          e.target.style.boxShadow = "none";
        }}
        onMouseUp={(e) => {
          e.target.style.boxShadow =
            " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
        }}
        style={{
          fontSize: 11,
          backgroundColor: "transparent",
          color: "var(--bs-text-color)",
          boxShadow:
            " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
      >
        <i className="bi bi-people me-1"></i> Contato
      </Button>
    </>
  );
}

export default Contato;
