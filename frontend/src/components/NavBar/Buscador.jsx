import { useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
function Buscador(props) {
  const [termo, setTermo] = useState("");
  const handleChange = (e) => {
    setTermo(e.target.value);
  };
  return (
    <FloatingLabel
      label="Pesquisar Produtos"
      className="pesquisaNavbar"
      style={{ fontSize: 12, width: "50vw" }}
    >
      <Form.Control
        type="text"
        name="termo"
        placeholder="..."
        style={{}}
        onChange={handleChange}
      />
      <span
        className="separadorTraco"
        style={{
          position: "absolute",
          top: 5,
          right: 26,
          color: "#737373",
          fontSize: 15,
        }}
      >
        |
      </span>
      <span
        className="lupaPesquisa"
        style={{
          position: "absolute",
          top: 7.5,
          right: 8,
          color: "#737373",
          fontSize: 14,
        }}
      >
        <i className="bi bi-search"></i>
      </span>
    </FloatingLabel>
  );
}

export default Buscador;
