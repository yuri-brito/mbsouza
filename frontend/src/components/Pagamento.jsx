import { useState } from "react";
import {
  Col,
  Container,
  Row,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import api from "../api/api";
function Pagamento(props) {
  const [formCartao, setFormCartao] = useState(0);
  const [cartao, setCartao] = useState(false);
  const [boleto, setBoleto] = useState(false);
  const [pix, setPix] = useState(false);
  const [qrCodeRef, setQrCodeRef] = useState("");

  const handleChange = (e) => {
    setFormCartao({ ...formCartao, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Container style={{ width: "90%", height: "90%", marginTop: 20 }}>
        <Row className="d-flex justify-content-center mb-2">
          Escolha a forma de pagamento
        </Row>
        <Row className="d-flex justify-content-center mb-5">
          <Col className="col-3">
            <Form.Check>
              <Form.Check.Input
                checked={cartao}
                onChange={(e) => {
                  setCartao(!cartao);
                  setBoleto(false);
                  setPix(false);
                }}
              />
              Cartão de Crédito
            </Form.Check>
          </Col>
          <Col className="col-2">
            <Form.Check>
              <Form.Check.Input
                checked={boleto}
                onChange={(e) => {
                  setBoleto(!boleto);
                  setCartao(false);
                  setPix(false);
                }}
                onClick={async (e) => {
                  e.preventDefault();
                  const response = await api.post("/usuario/create", {
                    forma: "boleto",
                  });
                  console.log(response.data);
                  window.open(response.data.charges[0].links[0].href, "_blank");
                }}
              />{" "}
              Boleto
            </Form.Check>
          </Col>
          <Col className="col-2">
            <Form.Check>
              <Form.Check.Input
                checked={pix}
                onChange={(e) => {
                  setPix(!pix);
                  setCartao(false);
                  setBoleto(false);
                }}
                onClick={async (e) => {
                  e.preventDefault();
                  const response = await api.post("/usuario/create", {
                    forma: "pix",
                  });
                  console.log(response.data.qr_codes[0].links[0].href);
                  setQrCodeRef(response.data.qr_codes[0].links[0].href);
                }}
              />{" "}
              Pix
            </Form.Check>
          </Col>
        </Row>
        <Row>
          {cartao && (
            <>
              <Form>
                <Form.Group className="w-100  my-3">
                  <Row className="mb-2">
                    <Col className="d-flex justify-content-center align-items-center">
                      <FloatingLabel
                        label="Número do cartão"
                        className="mb-0 labelComBug labelComBug1"
                        style={{ fontSize: 12 }}
                      >
                        <Form.Control
                          size="sm"
                          type="text"
                          name="numero"
                          style={{ fontSize: 12, height: 35, minHeight: 35 }}
                          value={formCartao.numero}
                          onChange={handleChange}
                          placeholder="..."
                        />
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col className="d-flex justify-content-center align-items-center">
                      <FloatingLabel
                        label="Nome do possuidor"
                        className="mb-0 labelComBug labelComBug1"
                        style={{ fontSize: 12 }}
                      >
                        <Form.Control
                          size="sm"
                          type="text"
                          name="nome"
                          style={{ fontSize: 12, height: 35, minHeight: 35 }}
                          value={formCartao.nome}
                          onChange={handleChange}
                          placeholder="..."
                        />
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col className="d-flex justify-content-center align-items-center">
                      <FloatingLabel
                        label="Data de validade"
                        className="mb-0 labelComBug labelComBug1"
                        style={{ fontSize: 12 }}
                      >
                        <Form.Control
                          size="sm"
                          type="text"
                          name="data"
                          style={{ fontSize: 12, height: 35, minHeight: 35 }}
                          value={formCartao.data}
                          onChange={handleChange}
                          placeholder="..."
                        />
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col className="d-flex justify-content-center align-items-center">
                      <FloatingLabel
                        label="Código de segurança"
                        className="mb-0 labelComBug labelComBug1"
                        style={{ fontSize: 12 }}
                      >
                        <Form.Control
                          size="sm"
                          type="text"
                          name="codigo"
                          style={{ fontSize: 12, height: 35, minHeight: 35 }}
                          value={formCartao.codigo}
                          onChange={handleChange}
                          placeholder="..."
                        />
                      </FloatingLabel>
                    </Col>
                  </Row>
                </Form.Group>
                <Button
                  variant="success"
                  onClick={async (e) => {
                    e.preventDefault();
                    console.log(formCartao.data.slice(0, 2));
                    console.log(formCartao.data.slice(3, 8));
                    const card = window.PagSeguro.encryptCard({
                      publicKey:
                        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E374nzx6NNBL5JosV0+SDINTlCG0cmigHuBOyWzYmjgca+mtQu4WczCaApNaSuVqgb8u7Bd9GCOL4YJotvV5+81frlSwQXralhwRzGhj/A57CGPgGKiuPT+AOGmykIGEZsSD9RKkyoKIoc0OS8CPIzdBOtTQCIwrLn2FxI83Clcg55W8gkFSOS6rWNbG5qFZWMll6yl02HtunalHmUlRUL66YeGXdMDC2PuRcmZbGO5a/2tbVppW6mfSWG3NPRpgwIDAQAB",
                      holder: formCartao.nome,
                      number: formCartao.numero,
                      expMonth: formCartao.data.slice(0, 2),
                      expYear: formCartao.data.slice(3, 8),
                      securityCode: formCartao.codigo,
                    });
                    console.log(cartao, "cartao");
                    const response = await api.post("/usuario/create", {
                      cartao: {
                        encrypt: card.encryptedCard,
                        nome: formCartao.nome,
                      },
                    });
                    console.log(response.data);
                  }}
                >
                  Pagar
                </Button>
              </Form>
            </>
          )}
          {boleto && <>boleto</>}
          {pix && (
            <div style={{ width: 200, marginInline: "auto" }}>
              <img src={qrCodeRef} alt="image" style={{ width: 200 }} />
            </div>
          )}
        </Row>
      </Container>
    </>
  );
}

export default Pagamento;
