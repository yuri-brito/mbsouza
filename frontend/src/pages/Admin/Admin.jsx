import { useEffect, useRef, useState } from "react";
import CarrosselHome from "../../components/CarrosselHome/CarrosselHome";
import NavBar from "../../components/NavBar/NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import api from "../../api/api";
import toast from "react-hot-toast";
import CustomToast from "../../components/CustomToast";
import ReactSelect, { components } from "react-select";
import MyUploader from "./MyUploader";
const { ValueContainer, Placeholder } = components;
const NoOptionsMessage = (props) => {
  return (
    <components.NoOptionsMessage {...props}>
      <span className="custom-css-class">Sem opções &#x1F615;</span>
    </components.NoOptionsMessage>
  );
};
const CustomValueContainer = ({ children, ...props }) => {
  return (
    <ValueContainer {...props}>
      <Placeholder {...props}>{props.selectProps.placeholder}</Placeholder>
      {React.Children.map(children, (child) =>
        child && child.type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};
const colourStyles = {
  noOptionsMessage: (base) => ({ ...base, textAlign: "left", fontSize: 10 }),
  control: (styles, state) => ({
    ...styles,
    backgroundColor: "white",
    textAlign: "left",
    fontSize: 10,
    width: 170,
    borderColor: state.selectProps.menuIsOpen
      ? "rgba(134, 183, 254,1)"
      : "#ced4da",
    boxShadow:
      state.selectProps.menuIsOpen &&
      "0px 0px 0px 4px rgba(134, 183, 254, 0.5)",
    minHeight: !state.hasValue && !state.selectProps.inputValue && "30px",
    height: !state.hasValue && !state.selectProps.inputValue && "30px",
    borderRadius: 5,
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected, is }) => {
    return {
      ...styles,
      backgroundColor: "white",
      color: "black",
      cursor: "pointer",
      textAlign: "left",
      fontSize: 10,
      borderRadius: 8,
      paddingBlock: 2,
    };
  },
  placeholder: (provided, state) => {
    return {
      ...provided,
      textAlign: "left",
      position: "absolute",
      color:
        state.hasValue || state.selectProps.inputValue ? "#9da3a8" : "#6c757d",
      top: state.hasValue || state.selectProps.inputValue ? -11 : 5,
      transition: "top 0.2s, font-size 0.2s",
      fontSize: state.hasValue || state.selectProps.inputValue ? 8.5 : 10,
      fontWeight: (state.hasValue || state.selectProps.inputValue) && 400,
    };
  },
  container: (provided, state) => ({
    ...provided,
    maxHeight: 50,
    zIndex: 1,
    marginTop: 0,
  }),
  menu: (provided, state) => {
    return {
      ...provided,
      position: "relative",
      top: 0,
    };
  },
  valueContainer: (provided, state) => ({
    ...provided,
    overflow: "visible",

    marginTop: (state.hasValue || state.selectProps.inputValue) && 10,
    fontSize: (state.hasValue || state.selectProps.inputValue) && 9,
    height: !state.hasValue && !state.selectProps.inputValue && "30px",
    paddingTop: state.hasValue || (state.selectProps.inputValue && 2),
    alignItems: (state.hasValue || state.selectProps.inputValue) && "start",
  }),

  multiValueLabel: (styles, { data, isFocused }) => ({
    ...styles,

    backgroundColor: "#00246aff",
    color: "white",
    borderRadius: 3,
    fontSize: 9,
    display: "flex",
    alignItems: "center",
    padding: "1px",
    height: "13px",
    marginTop: "1px",

    // ":hover": {
    //   backgroundColor: "rgba(2, 70, 175, 255)",
    // },
  }),
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: "white",
    height: "13px",
    margin: "1px",
    alignItems: "start",
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    backgroundColor: "white",
    width: "10px",
    padding: "0px",
    ":hover": {
      color: "red",
    },
  }),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    width: 15,
    padding: (state.hasValue || state.selectProps.inputValue) && 1,
    height: !state.hasValue && !state.selectProps.inputValue && "20px",
  }),
  clearIndicator: (styles, state) => ({
    ...styles,
    width: 15,
    padding: 1,
    height: !state.hasValue && !state.selectProps.inputValue && "30px",
  }),
  indicatorSeparator: (styles, state) => ({
    ...styles,
    height: !state.hasValue && !state.selectProps.inputValue && "15px",
  }),
};
function Admin() {
  const { loggedUser, theme } = useContext(AuthContext);

  const navigate = useNavigate();
  if (loggedUser.userData.papel !== "admin") {
    navigate("/");
  }
  const [reload, setRelod] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [menuOpen, setMenuOpen] = useState(undefined);
  useEffect(() => {
    const fetching = async () => {
      try {
        const res = await api.get("/categoria/all");
        const ressub = await api.get("/subcategoria/all");
        const resprod = await api.get("/produto/all");
        setCategorias(res.data);
        setSubcategorias(ressub.data);
        setProdutos(resprod.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetching();
  }, [reload]);
  //configurações react-select
  const onMenuOpen = () => {
    if (menuOpen !== undefined) setMenuOpen(undefined);
  };
  const colourStyles = {
    noOptionsMessage: (base) => ({ ...base, textAlign: "left", fontSize: 10 }),
    control: (styles, state) => ({
      ...styles,
      backgroundColor: theme === "dark" ? "rgb(33, 37, 41)" : "white",
      textAlign: "left",
      fontSize: 10,
      width: 200,
      borderColor: state.selectProps.menuIsOpen
        ? "rgba(134, 183, 254,1)"
        : "#ced4da",
      boxShadow:
        state.selectProps.menuIsOpen &&
        "0px 0px 0px 4px rgba(134, 183, 254, 0.5)",
      minHeight: !state.hasValue && !state.selectProps.inputValue && "30px",
      height: !state.hasValue && !state.selectProps.inputValue && "30px",
      borderRadius: 5,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected, is }) => {
      return {
        ...styles,
        backgroundColor: theme === "dark" ? "rgb(33, 37, 41)" : "white",
        // backgroundColor: "white",
        color: theme === "dark" ? "white" : "black",
        cursor: "pointer",
        textAlign: "left",
        fontSize: 12,
        borderRadius: 8,
        paddingBlock: 2,
        ":hover": {
          backgroundColor: "rgba(2, 70, 175, 255)",
        },
      };
    },
    placeholder: (provided, state) => {
      return {
        ...provided,
        textAlign: "left",
        position: "absolute",
        color:
          state.hasValue || state.selectProps.inputValue
            ? "#9da3a8"
            : "#6c757d",
        top: state.hasValue || state.selectProps.inputValue ? -11 : 5,
        transition: "top 0.2s, font-size 0.2s",
        fontSize: state.hasValue || state.selectProps.inputValue ? 9.5 : 12,
        fontWeight: (state.hasValue || state.selectProps.inputValue) && 400,
      };
    },
    container: (provided, state) => ({
      ...provided,
      maxHeight: 50,
      zIndex: 1,
      marginTop: 0,
      width: 200,
    }),
    menu: (provided, state) => {
      return {
        ...provided,
        position: "relative",
        top: 0,
        backgroundColor: theme === "dark" ? "rgb(33, 37, 41)" : "white",
      };
    },
    valueContainer: (provided, state) => ({
      ...provided,
      overflow: "visible",
      marginTop: (state.hasValue || state.selectProps.inputValue) && 10,
      fontSize: (state.hasValue || state.selectProps.inputValue) && 9,
      height: !state.hasValue && !state.selectProps.inputValue && "30px",
      paddingTop: state.hasValue || (state.selectProps.inputValue && 2),
      alignItems: (state.hasValue || state.selectProps.inputValue) && "start",
    }),

    multiValueLabel: (styles, { data, isFocused }) => ({
      ...styles,

      backgroundColor: "#00246aff",
      color: "white",
      borderRadius: 3,
      fontSize: 9,
      display: "flex",
      alignItems: "center",
      padding: "1px",
      height: "13px",
      marginTop: "1px",

      // ":hover": {
      //   backgroundColor: "rgba(2, 70, 175, 255)",
      // },
    }),
    singleValue: (styles, { data }) => ({
      ...styles,
      backgroundColor: theme === "dark" ? "rgb(33, 37, 41)" : "white",
      color: theme === "dark" ? "white" : "black",
      fontSize: "12px",
      height: "15px",
      margin: "3px",
      alignItems: "start",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      backgroundColor: "white",
      width: "10px",
      padding: "0px",
      ":hover": {
        color: "red",
      },
    }),
    dropdownIndicator: (styles, state) => ({
      ...styles,
      width: 15,
      padding: (state.hasValue || state.selectProps.inputValue) && 1,
      height: !state.hasValue && !state.selectProps.inputValue && "20px",
    }),
    clearIndicator: (styles, state) => ({
      ...styles,
      width: 15,
      padding: 1,
      height: !state.hasValue && !state.selectProps.inputValue && "30px",
    }),
    indicatorSeparator: (styles, state) => ({
      ...styles,
      height: !state.hasValue && !state.selectProps.inputValue && "15px",
    }),
  };

  function handleSelect(e, selector) {
    if (selector.name === "categoria") {
      setFormSubcategoria({
        ...formSubcategoria,
        categoria: e,
      });
    }
    if (selector.name === "subcategoria") {
      setFormProduto({
        ...formProduto,
        subcategoria: e,
      });
    }
  }

  //inserir e editar Categoria
  const [formCategoria, setFormCategoria] = useState({
    nome: "",
  });
  const [categoriaChosen, setCategoriaChosen] = useState(null);

  const [showCategoria, setShowCategoria] = useState(false);
  const handleshowCategoria = (e, c) => {
    if (c) {
      setFormCategoria({ nome: c.nome });
      setCategoriaChosen(c);
    }

    setShowCategoria(true);
  };
  const handleCloseCategoria = () => {
    setFormCategoria({ nome: "" });
    setCategoriaChosen(null);
    setShowCategoria(false);
  };
  const handleChangeCategoria = (e) => {
    setFormCategoria({
      ...formCategoria,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmitCategoria = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (categoriaChosen) {
        await api.put(`/categoria/edit/${categoriaChosen._id}`, formCategoria);
      } else {
        await api.post("/categoria/create", formCategoria);
      }
      setRelod(!reload);
      handleCloseCategoria();
      navigate("/Admin");
    } catch (error) {
      if (
        error.response.data.msg === "Sua sessão expirou, realize novo login."
      ) {
        toast.error(
          (t) => (
            <CustomToast
              t={t}
              message={error.response.data.msg}
              duration={5000}
            />
          ),
          {
            style: {
              borderRadius: "10px",
              border: "1px solid #ff4c4cff",
              color: "black",
              fontWeight: "400",
            },
          }
        );
      } else {
        toast.error(
          (t) => (
            <CustomToast
              t={t}
              message={error.response.data.msg}
              duration={5000}
            />
          ),
          {
            style: {
              borderRadius: "10px",
              border: "1px solid #ff4c4cff",
              color: "black",
              fontWeight: "400",
            },
          }
        );
      }
    }
  };
  const handleExcluirCategoria = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.delete(
        `/categoria/delete/${categoriaChosen._id}`,
        formCategoria
      );

      setRelod(!reload);
      handleCloseCategoria();
      navigate("/Admin");
    } catch (error) {
      if (
        error.response.data.msg === "Sua sessão expirou, realize novo login."
      ) {
        toast.error(
          (t) => (
            <CustomToast
              t={t}
              message={error.response.data.msg}
              duration={5000}
            />
          ),
          {
            style: {
              borderRadius: "10px",
              border: "1px solid #ff4c4cff",
              color: "black",
              fontWeight: "400",
            },
          }
        );
      } else {
        toast.error(
          (t) => (
            <CustomToast
              t={t}
              message={error.response.data.msg}
              duration={5000}
            />
          ),
          {
            style: {
              borderRadius: "10px",
              border: "1px solid #ff4c4cff",
              color: "black",
              fontWeight: "400",
            },
          }
        );
      }
    }
  };

  //inserir e editar Subcategoria
  const [formSubcategoria, setFormSubcategoria] = useState({
    nome: "",
    categoria: null,
  });

  const [subcategoriaChosen, setSubcategoriaChosen] = useState(null);

  const [showSubcategoria, setShowSubcategoria] = useState(false);
  const handleshowSubcategoria = (e, c) => {
    if (c) {
      setFormSubcategoria({ nome: c.nome, categoria: c.categoria });
      setSubcategoriaChosen(c);
    }

    setShowSubcategoria(true);
  };
  const handleCloseSubcategoria = () => {
    setFormSubcategoria({ nome: "" });
    setSubcategoriaChosen(null);
    setShowSubcategoria(false);
  };
  const handleChangeSubcategoria = (e) => {
    setFormSubcategoria({
      ...formSubcategoria,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmitSubcategoria = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (subcategoriaChosen) {
        await api.put(`/subcategoria/edit/${subcategoriaChosen._id}`, {
          ...formSubcategoria,
          categoria: formSubcategoria.categoria._id,
        });
      } else {
        await api.post("/subcategoria/create", {
          ...formSubcategoria,
          categoria: formSubcategoria.categoria._id,
        });
      }
      setRelod(!reload);
      handleCloseSubcategoria();
      navigate("/Admin");
    } catch (error) {
      console.log(error);
      if (
        error.response.data.msg === "Sua sessão expirou, realize novo login."
      ) {
        toast.error(
          (t) => (
            <CustomToast
              t={t}
              message={error.response.data.msg}
              duration={5000}
            />
          ),
          {
            style: {
              borderRadius: "10px",
              border: "1px solid #ff4c4cff",
              color: "black",
              fontWeight: "400",
            },
          }
        );
      } else {
        toast.error(
          (t) => (
            <CustomToast
              t={t}
              message={error.response.data.msg}
              duration={5000}
            />
          ),
          {
            style: {
              borderRadius: "10px",
              border: "1px solid #ff4c4cff",
              color: "black",
              fontWeight: "400",
            },
          }
        );
      }
    }
  };
  const handleExcluirSubcategoria = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.delete(
        `/subcategoria/delete/${subcategoriaChosen._id}`,
        formSubcategoria
      );

      setRelod(!reload);
      handleCloseSubcategoria();
      navigate("/Admin");
    } catch (error) {
      if (
        error.response.data.msg === "Sua sessão expirou, realize novo login."
      ) {
        toast.error(
          (t) => (
            <CustomToast
              t={t}
              message={error.response.data.msg}
              duration={5000}
            />
          ),
          {
            style: {
              borderRadius: "10px",
              border: "1px solid #ff4c4cff",
              color: "black",
              fontWeight: "400",
            },
          }
        );
      } else {
        toast.error(
          (t) => (
            <CustomToast
              t={t}
              message={error.response.data.msg}
              duration={5000}
            />
          ),
          {
            style: {
              borderRadius: "10px",
              border: "1px solid #ff4c4cff",
              color: "black",
              fontWeight: "400",
            },
          }
        );
      }
    }
  };
  //inserir e editar produto
  const [formProduto, setFormProduto] = useState({
    nome: "",
    subcategoria: null,
    descricao: "",
    codigo: "",
    valor: 0,
    destaque: "0",
    produtoImgs: [],
    espTec: [],
  });

  const [produtoChosen, setProdutoChosen] = useState(null);

  const [showProduto, setShowProduto] = useState(false);
  const handleshowProduto = (e, c) => {
    if (c) {
      setFormProduto(c);
      setProdutoChosen(c);
    }

    setShowProduto(true);
  };
  const handleCloseProduto = () => {
    setFormProduto({
      nome: "",
      subcategoria: null,
      descricao: "",
      codigo: "",
      valor: 0,
      destaque: "0",
      produtoImgs: [],
      espTec: [],
    });
    setFiles([]); // limpa as imagens
    setDeletedFiles([]);
    setProdutoChosen(null);
    setShowProduto(false);
  };
  const handleChangeProduto = (e) => {
    setFormProduto({
      ...formProduto,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmitProduto = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      let produto;
      if (produtoChosen) {
        const res = await api.put(`/produto/edit/${produtoChosen._id}`, {
          ...formProduto,
          subcategoria: formProduto.subcategoria._id,
          espTec: especificacoes,
        });
        produto = res.data;

        // Envia novas imagens (adicionadas manualmente)
        const newImages = files.filter((f) => !f.fromServer);
        if (newImages.length > 0) {
          const formData = new FormData();
          newImages.forEach((file) => {
            formData.append("images", file);
          });

          await api.post(`/produtoImg/upload/${produto._id}`, formData);
        }
        for (const file of deletedFiles) {
          try {
            await api.delete(`/produtoImg/remover/${produto._id}/${file.name}`);
          } catch (err) {
            console.error("Erro ao excluir imagem marcada", err);
          }
        }
      } else {
        const res = await api.post("/produto/create", {
          ...formProduto,
          subcategoria: formProduto.subcategoria._id,
          espTec: especificacoes,
        });
        produto = res.data;

        if (files.length > 0) {
          const formData = new FormData();
          files.forEach((file) => {
            formData.append("images", file);
          });

          await api.post(`/produtoImg/upload/${produto._id}`, formData);
        }
      }

      setRelod(!reload);
      handleCloseProduto();
      navigate("/Admin");
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.msg || "Erro ao salvar produto";
      toast.error((t) => <CustomToast t={t} message={msg} duration={5000} />, {
        style: {
          borderRadius: "10px",
          border: "1px solid #ff4c4cff",
          color: "black",
          fontWeight: "400",
        },
      });
      if (msg === "Sua sessão expirou, realize novo login.") {
        setLoggedUser(null);
        localStorage.clear();
        navigate("/");
      }
    }
  };
  const handleExcluirProduto = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.delete(`/produtoImg/remover-todas/${produtoChosen._id}`);
      await api.delete(
        `/produto/delete/${produtoChosen._id}`,
        formSubcategoria
      );

      setRelod(!reload);
      handleCloseProduto();
      navigate("/Admin");
    } catch (error) {
      if (
        error.response.data.msg === "Sua sessão expirou, realize novo login."
      ) {
        toast.error(
          (t) => (
            <CustomToast
              t={t}
              message={error.response.data.msg}
              duration={5000}
            />
          ),
          {
            style: {
              borderRadius: "10px",
              border: "1px solid #ff4c4cff",
              color: "black",
              fontWeight: "400",
            },
          }
        );
      } else {
        toast.error(
          (t) => (
            <CustomToast
              t={t}
              message={error.response.data.msg}
              duration={5000}
            />
          ),
          {
            style: {
              borderRadius: "10px",
              border: "1px solid #ff4c4cff",
              color: "black",
              fontWeight: "400",
            },
          }
        );
      }
    }
  };

  //especificação técnica
  const [formEsp, setFormEsp] = useState({ nome: "", valor: "" });
  const [especificacoes, setEspecificacoes] = useState([]);
  const handleChangeEsp = (e) => {
    setFormEsp({
      ...formEsp,
      [e.target.name]: e.target.value,
    });
  };

  //Arquivos dos produtos
  const [files, setFiles] = useState([]);

  const [deletedFiles, setDeletedFiles] = useState([]);
  useEffect(() => {
    if (produtoChosen) {
      const imagensConvertidas = produtoChosen.imagens.map((img) => {
        return {
          preview: img.url,
          name: img.filename,
          fromServer: true, // flag para distinguir
        };
      });
      setFiles(imagensConvertidas);
      //   setInitialFiles(imagensConvertidas);
    } else {
      setFiles([]);
      //   setInitialFiles([]);
    }
  }, [produtoChosen]);
  console.log(formProduto);
  return (
    <div
      style={{
        position: "relative",
        animation: "fadein 1.5s",
        marginBottom: 100,
      }}
    >
      <Modal
        show={showCategoria}
        onHide={handleCloseCategoria}
        backdrop="static"
      >
        <Modal.Header
          className="headerModalCadastro"
          closeButton={true}
          style={{ fontSize: 14 }}
        >
          {categoriaChosen ? (
            <>Editar categoria</>
          ) : (
            <>Insira o nome da nova categoria</>
          )}
        </Modal.Header>

        <Form>
          <>
            <Modal.Body>
              <Container>
                <Form.Group className="mb-3">
                  <FloatingLabel
                    label="Nome da categoria"
                    className="mb-3 labelCriarConta"
                    style={{ fontSize: 12 }}
                  >
                    <Form.Control
                      required
                      type="text"
                      placeholder=""
                      name="nome"
                      value={formCategoria.nome}
                      style={{
                        height: 30,
                        fontSize: 13,
                        minHeight: 35,
                      }}
                      onChange={handleChangeCategoria}
                    />
                    <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Container>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: "center" }}>
              <Row className="d-flex justify-content-evenly w-100 ">
                <Col xs="auto" className="mb-2">
                  <Button
                    className="cadastroButtons"
                    variant="success"
                    size="sm"
                    type="submit"
                    style={{ fontSize: 11 }}
                    onClick={handleSubmitCategoria}
                    disabled={formCategoria.nome === ""}
                  >
                    <i className="bi bi-floppy"></i> Salvar
                  </Button>
                </Col>
                <Col xs="auto" className="mb-2">
                  <Button
                    className="cadastroButtons"
                    variant="secondary"
                    size="sm"
                    type="submit"
                    style={{ fontSize: 11 }}
                    onClick={handleCloseCategoria}
                  >
                    <i className="bi bi-x-circle"></i> Cancelar
                  </Button>
                </Col>
                <Col xs="auto" className="mb-2">
                  <Button
                    className="cadastroButtons"
                    variant="danger"
                    size="sm"
                    type="submit"
                    style={{ fontSize: 11 }}
                    onClick={handleExcluirCategoria}
                  >
                    <i className="bi bi-trash"></i> Excluir
                  </Button>
                </Col>
              </Row>
            </Modal.Footer>
          </>
        </Form>
        {/* )} */}
      </Modal>
      <Modal
        show={showSubcategoria}
        onHide={handleCloseSubcategoria}
        backdrop="static"
      >
        <Modal.Header
          className="headerModalCadastro"
          closeButton={true}
          style={{ fontSize: 14 }}
        >
          {subcategoriaChosen ? (
            <>Editar subcategoria</>
          ) : (
            <>Insira a nova subcategoria</>
          )}
        </Modal.Header>

        <Form>
          <>
            <Modal.Body>
              <Container>
                <Form.Group className="mb-3">
                  <FloatingLabel
                    label="Nome da subcategoria"
                    className="mb-3 labelCriarConta"
                    style={{ fontSize: 12 }}
                  >
                    <Form.Control
                      required
                      type="text"
                      placeholder=""
                      name="nome"
                      value={formSubcategoria.nome}
                      style={{
                        height: 30,
                        fontSize: 13,
                        minHeight: 35,
                      }}
                      onChange={handleChangeSubcategoria}
                    />
                    <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                  </FloatingLabel>
                  <ReactSelect
                    name="categoria"
                    placeholder="Escolha a categoria"
                    components={{
                      ValueContainer: CustomValueContainer,
                      NoOptionsMessage,
                    }}
                    menuIsOpen={menuOpen}
                    onMenuOpen={onMenuOpen}
                    className=""
                    closeMenuOnSelect={false}
                    options={categorias}
                    value={formSubcategoria.categoria}
                    isSearchable
                    isClearable
                    styles={colourStyles}
                    getOptionValue={(option) => `${option.nome}`}
                    getOptionLabel={(option) => {
                      return <div>{option.nome}</div>;
                    }}
                    onChange={(e, selector) => handleSelect(e, selector)}
                  />
                </Form.Group>
              </Container>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: "center" }}>
              <Row className="d-flex justify-content-evenly w-100 ">
                <Col xs="auto" className="mb-2">
                  <Button
                    className="cadastroButtons"
                    variant="success"
                    size="sm"
                    type="submit"
                    style={{ fontSize: 11 }}
                    onClick={handleSubmitSubcategoria}
                    disabled={
                      formSubcategoria.nome === "" ||
                      formSubcategoria.categoria === null
                    }
                  >
                    <i className="bi bi-floppy"></i> Salvar
                  </Button>
                </Col>
                <Col xs="auto" className="mb-2">
                  <Button
                    className="cadastroButtons"
                    variant="secondary"
                    size="sm"
                    type="submit"
                    style={{ fontSize: 11 }}
                    onClick={handleCloseSubcategoria}
                  >
                    <i className="bi bi-x-circle"></i> Cancelar
                  </Button>
                </Col>
                <Col xs="auto" className="mb-2">
                  <Button
                    className="cadastroButtons"
                    variant="danger"
                    size="sm"
                    type="submit"
                    style={{ fontSize: 11 }}
                    onClick={handleExcluirSubcategoria}
                  >
                    <i className="bi bi-trash"></i> Excluir
                  </Button>
                </Col>
              </Row>
            </Modal.Footer>
          </>
        </Form>
        {/* )} */}
      </Modal>
      <Modal
        dialogClassName="mb-5"
        show={showProduto}
        onHide={handleCloseProduto}
        backdrop="static"
      >
        <Modal.Header
          className="headerModalCadastro"
          closeButton={true}
          style={{ fontSize: 14 }}
        >
          {produtoChosen ? <>Editar produto</> : <>Insira o novo produto</>}
        </Modal.Header>

        <Form>
          <>
            <Modal.Body>
              <Container>
                <Form.Group className="mb-3">
                  <FloatingLabel
                    label="Nome do produto"
                    className="mb-3 labelCriarConta"
                    style={{ fontSize: 12 }}
                  >
                    <Form.Control
                      required
                      type="text"
                      placeholder=""
                      name="nome"
                      value={formProduto.nome}
                      style={{
                        height: 30,
                        fontSize: 13,
                        minHeight: 35,
                      }}
                      onChange={handleChangeProduto}
                    />
                    <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                  </FloatingLabel>
                  <FloatingLabel
                    label="Código do produto"
                    className="mb-3 labelCriarConta"
                    style={{ fontSize: 12 }}
                  >
                    <Form.Control
                      required
                      type="text"
                      placeholder=""
                      name="codigo"
                      value={formProduto.codigo}
                      style={{
                        height: 30,
                        fontSize: 13,
                        minHeight: 35,
                      }}
                      onChange={handleChangeProduto}
                    />
                    <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                  </FloatingLabel>
                  <FloatingLabel
                    label="Descrição do produto"
                    className="mb-3 labelCriarConta"
                    style={{ fontSize: 12 }}
                  >
                    <Form.Control
                      required
                      type="text"
                      placeholder=""
                      name="descricao"
                      value={formProduto.descricao}
                      style={{
                        height: 30,
                        fontSize: 13,
                        minHeight: 35,
                      }}
                      onChange={handleChangeProduto}
                    />
                    <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                  </FloatingLabel>
                  <FloatingLabel
                    label="Valor do produto"
                    className="mb-3 labelCriarConta"
                    style={{ fontSize: 12 }}
                  >
                    <Form.Control
                      required
                      type="number"
                      placeholder=""
                      name="valor"
                      value={formProduto.valor}
                      style={{
                        height: 30,
                        fontSize: 13,
                        minHeight: 35,
                      }}
                      onChange={handleChangeProduto}
                    />
                    <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                  </FloatingLabel>
                  <ReactSelect
                    name="subcategoria"
                    placeholder="Escolha a subcategoria"
                    components={{
                      ValueContainer: CustomValueContainer,
                      NoOptionsMessage,
                    }}
                    menuIsOpen={menuOpen}
                    onMenuOpen={onMenuOpen}
                    className=""
                    closeMenuOnSelect={false}
                    options={subcategorias}
                    value={formProduto.subcategoria}
                    isSearchable
                    isClearable
                    styles={colourStyles}
                    getOptionValue={(option) => `${option.nome}`}
                    getOptionLabel={(option) => {
                      return <div>{option.nome}</div>;
                    }}
                    onChange={(e, selector) => handleSelect(e, selector)}
                  />
                  <Form.Check className="my-3 d-flex align-items-center gap-2">
                    <Form.Check.Input
                      checked={formProduto.destaque === "2"}
                      style={{
                        cursor: "pointer",

                        width: 13,
                        height: 13,
                      }}
                      onChange={(e) => {
                        e.target.checked
                          ? setFormProduto({ ...formProduto, destaque: "2" })
                          : setFormProduto({ ...formProduto, destaque: "0" });
                      }}
                    />
                    <Form.Check.Label
                      style={{
                        fontSize: 13,
                        fontWeight: "normal",
                        textAlign: "left",
                        marginBottom: -5,
                      }}
                    >
                      Super destaque
                    </Form.Check.Label>
                  </Form.Check>
                  <Form.Check className="my-3 d-flex align-items-center gap-2">
                    <Form.Check.Input
                      checked={formProduto.destaque === "1"}
                      style={{
                        cursor: "pointer",

                        width: 13,
                        height: 13,
                      }}
                      onChange={(e) => {
                        e.target.checked
                          ? setFormProduto({ ...formProduto, destaque: "1" })
                          : setFormProduto({ ...formProduto, destaque: "0" });
                      }}
                    />
                    <Form.Check.Label
                      style={{
                        fontSize: 13,
                        fontWeight: "normal",
                        textAlign: "left",
                        marginBottom: -5,
                      }}
                    >
                      Destaque
                    </Form.Check.Label>
                  </Form.Check>
                  <Row className="my-3 subtitulos">
                    <div
                      style={{
                        borderBottom: "1px solid rgb(206, 212, 218)",
                        marginBottom: 10,
                      }}
                    >
                      Especificações técnicas
                    </div>
                    <div className="textos">
                      {formProduto.espTec.length === 0 ? (
                        <>Sem especificações &#x1F615; </>
                      ) : (
                        <>
                          {formProduto.espTec.map((esp) => {
                            return (
                              <Row
                                className="d-flex  align-items-center"
                                style={{
                                  border: "1px solid rgb(206, 212, 218)",
                                  borderRadius: 6,
                                  position: "relative",
                                }}
                              >
                                {/* <div style={{ position: "absolute", left: 0 }}> */}
                                <Button
                                  variant="danger"
                                  size="sm"
                                  className=" py-0"
                                  style={{
                                    fontSize: 10,
                                    position: "absolute",
                                    width: 30,
                                    right: 0,
                                    bottom: 0,
                                  }}
                                  onClick={(e) => {
                                    setEspecificacoes(
                                      especificacoes
                                        .filter((e) => e.index !== esp.index)
                                        .map((e, i) => {
                                          return { ...e, index: i };
                                        })
                                    );
                                    setFormProduto({
                                      ...formProduto,
                                      espTec: especificacoes
                                        .filter((e) => e.index !== esp.index)
                                        .map((e, i) => {
                                          return { ...e, index: i };
                                        }),
                                    });
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                                {/* </div> */}
                                <Col
                                  className=" col-4 textos d-flex flex-wrap"
                                  style={{
                                    borderRight: "1px solid rgb(206, 212, 218)",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                  }}
                                >
                                  {esp.nome}
                                </Col>
                                <Col
                                  className=" col-7  textos d-flex flex-wrap"
                                  style={{
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                  }}
                                >
                                  {esp.valor}
                                </Col>
                              </Row>
                            );
                          })}
                        </>
                      )}
                    </div>

                    <div
                      style={{
                        border: "1px solid rgb(206, 212, 218)",
                        borderRadius: 6,
                        fontSize: 12,
                        position: "relative",
                        paddingBlock: 20,
                        marginBlock: 30,
                      }}
                    >
                      <p
                        className="m-0 py-0"
                        style={{
                          position: "absolute",
                          top: -10,
                          left: 10,
                          paddingInline: 5,
                          backgroundColor:
                            theme === "dark" ? "rgb(33, 37, 41)" : "white",
                        }}
                      >
                        Incluir nova especificação
                      </p>
                      <Col>
                        <Button
                          variant="success"
                          disabled={formEsp.nome === "" || formEsp.valor === ""}
                          size="sm"
                          className="mb-3 py-0"
                          style={{ fontSize: 12 }}
                          onClick={(e) => {
                            setFormEsp({ nome: "", valor: "" });
                            setEspecificacoes(
                              [...especificacoes, formEsp].map((e, i) => {
                                return { ...e, index: i };
                              })
                            );
                            setFormProduto({
                              ...formProduto,
                              espTec: [...especificacoes, formEsp].map(
                                (e, i) => {
                                  return { ...e, index: i };
                                }
                              ),
                            });
                          }}
                        >
                          + Incluir
                        </Button>
                        <FloatingLabel
                          label="Nome da especificação"
                          className="mb-3 labelCriarConta"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            type="text"
                            placeholder=""
                            name="nome"
                            value={formEsp.nome}
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            onChange={handleChangeEsp}
                          />
                          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                        </FloatingLabel>
                        <FloatingLabel
                          label="Valor da especificação"
                          className="mb-3 labelCriarConta"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            type="text"
                            placeholder=""
                            name="valor"
                            value={formEsp.valor}
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            onChange={handleChangeEsp}
                          />
                          <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                    </div>
                  </Row>
                  <MyUploader
                    files={files}
                    setFiles={setFiles}
                    setDeletedFiles={setDeletedFiles}
                  />
                </Form.Group>
              </Container>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: "center" }}>
              <Row className="d-flex justify-content-evenly w-100 ">
                <Col xs="auto" className="mb-2">
                  <Button
                    className="cadastroButtons"
                    variant="success"
                    size="sm"
                    type="submit"
                    style={{ fontSize: 11 }}
                    onClick={handleSubmitProduto}
                    disabled={
                      formProduto.nome === "" ||
                      formProduto.subcategoria === null ||
                      formProduto.codigo === "" ||
                      formProduto.descricao === "" ||
                      formProduto.valor === ""
                    }
                  >
                    <i className="bi bi-floppy"></i> Salvar
                  </Button>
                </Col>
                <Col xs="auto" className="mb-2">
                  <Button
                    className="cadastroButtons"
                    variant="secondary"
                    size="sm"
                    type="submit"
                    style={{ fontSize: 11 }}
                    onClick={handleCloseProduto}
                  >
                    <i className="bi bi-x-circle"></i> Cancelar
                  </Button>
                </Col>
                <Col xs="auto" className="mb-2">
                  <Button
                    className="cadastroButtons"
                    variant="danger"
                    size="sm"
                    type="submit"
                    style={{ fontSize: 11 }}
                    onClick={handleExcluirProduto}
                  >
                    <i className="bi bi-trash"></i> Excluir
                  </Button>
                </Col>
              </Row>
            </Modal.Footer>
          </>
        </Form>
        {/* )} */}
      </Modal>
      <Row
        className="d-flex justify-content-center mx-0 p-0"
        style={{
          backgroundColor:
            theme === "dark" ? "rgb(0, 63, 106)" : "rgb(247, 113, 34)",
          height: "auto",

          marginInline: 0,
          color: "white",
          marginBottom: 50,
        }}
      >
        <h2 className="my-4 titulos">ADMINISTRAÇÃO</h2>
      </Row>
      <Row className="d-flex justify-content-start mx-0 p-0 ">
        <Container>
          <Row className=" mb-4 g-3">
            <Col xs={12} md={6}>
              <Card>
                <Card.Header className="titulos">Categorias</Card.Header>
                <Card.Body>
                  {categorias.length === 0 ? (
                    <Row className="m-3">
                      <Card
                        style={{
                          fontSize: 13,
                          paddingBlock: 10,
                          width: "50vw",
                          marginLeft: "auto",
                          marginRight: "auto",
                          boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                          animation: "fadein 1.5s",
                        }}
                      >
                        Você ainda não cadastrou categorias &#x1F615;{" "}
                      </Card>
                    </Row>
                  ) : (
                    <Col className="d-flex flex-wrap justify-content-center gap-2 ">
                      {categorias.map((c, i) => {
                        return (
                          <Button
                            key={i}
                            size="sm"
                            style={{
                              width: "30%",
                              maxWidth: 120,
                              fontSize: 12,
                              backgroundColor: "transparent",
                              fontWeight: 600,
                              color:
                                theme === "dark"
                                  ? "var(--bs-btn-bg)"
                                  : "var(--bs-btn-bg)",
                              padding: 2,
                              boxShadow:
                                " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                            }}
                            onMouseDown={(e) => {
                              e.target.style.boxShadow = "none";
                            }}
                            onMouseUp={(e) => {
                              e.target.style.boxShadow =
                                " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
                            }}
                            variant="danger"
                            onClick={(e) => {
                              handleshowCategoria(e, c);
                            }}
                          >
                            {c.nome}
                          </Button>
                        );
                      })}
                    </Col>
                  )}
                </Card.Body>
                <Card.Footer>
                  <Button
                    size="sm"
                    style={{
                      width: "30%",
                      maxWidth: 120,
                      //   fontSize: 12,
                      padding: 2,
                      boxShadow:
                        " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                    }}
                    onMouseDown={(e) => {
                      e.target.style.boxShadow = "none";
                    }}
                    onMouseUp={(e) => {
                      e.target.style.boxShadow =
                        " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
                    }}
                    variant="success"
                    className="textos"
                    onClick={() => handleshowCategoria()}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Incluir
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Card.Header className="titulos">Subcategorias</Card.Header>
                <Card.Body>
                  {subcategorias.length === 0 ? (
                    <Row className="m-3">
                      <Card
                        style={{
                          fontSize: 13,
                          paddingBlock: 10,
                          width: "50vw",
                          marginLeft: "auto",
                          marginRight: "auto",
                          boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                          animation: "fadein 1.5s",
                        }}
                      >
                        Você ainda não cadastrou subcategorias &#x1F615;{" "}
                      </Card>
                    </Row>
                  ) : (
                    <Col className="d-flex flex-wrap justify-content-center gap-2 ">
                      {subcategorias.map((c, i) => {
                        return (
                          <Button
                            key={i}
                            size="sm"
                            style={{
                              width: "30%",
                              maxWidth: 120,
                              fontSize: 12,
                              padding: 2,
                              backgroundColor: "transparent",
                              fontWeight: 600,
                              color:
                                theme === "dark"
                                  ? "var(--bs-btn-bg)"
                                  : "var(--bs-btn-bg)",
                              boxShadow:
                                " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                            }}
                            onMouseDown={(e) => {
                              e.target.style.boxShadow = "none";
                            }}
                            onMouseUp={(e) => {
                              e.target.style.boxShadow =
                                " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
                            }}
                            variant="primary"
                            onClick={(e) => {
                              handleshowSubcategoria(e, c);
                            }}
                          >
                            {c.nome}
                          </Button>
                        );
                      })}
                    </Col>
                  )}
                </Card.Body>
                <Card.Footer>
                  <Button
                    size="sm"
                    style={{
                      width: "30%",
                      maxWidth: 120,
                      //   fontSize: 12,
                      padding: 2,
                      boxShadow:
                        " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                    }}
                    onMouseDown={(e) => {
                      e.target.style.boxShadow = "none";
                    }}
                    onMouseUp={(e) => {
                      e.target.style.boxShadow =
                        " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
                    }}
                    variant="success"
                    className="textos"
                    onClick={() => handleshowSubcategoria()}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Incluir
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
          <Row className=" d-flex justify-content-start m-0 p-0">
            <Card className="p-0">
              <Card.Header className="titulos">Produtos</Card.Header>
              <Card.Body>
                {produtos.length === 0 ? (
                  <Row className="m-3">
                    <Card
                      style={{
                        fontSize: 13,
                        paddingBlock: 10,
                        width: "50vw",
                        marginLeft: "auto",
                        marginRight: "auto",
                        boxShadow:
                          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                        animation: "fadein 1.5s",
                      }}
                    >
                      Você ainda não cadastrou produtos &#x1F615;{" "}
                    </Card>
                  </Row>
                ) : (
                  <Col className="d-flex flex-wrap justify-content-center gap-2 ">
                    {produtos.map((c, i) => {
                      return (
                        <Button
                          key={i}
                          size="sm"
                          style={{
                            width: "30%",
                            maxWidth: 120,
                            fontSize: 12,
                            backgroundColor: "transparent",
                            fontWeight: 600,
                            color:
                              theme === "dark"
                                ? "var(--bs-btn-bg)"
                                : "var(--bs-btn-bg)",
                            padding: 2,
                            boxShadow:
                              " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                          }}
                          onMouseDown={(e) => {
                            e.target.style.boxShadow = "none";
                          }}
                          onMouseUp={(e) => {
                            e.target.style.boxShadow =
                              " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
                          }}
                          variant="info"
                          onClick={(e) => {
                            handleshowProduto(e, c);
                          }}
                        >
                          {c.codigo} - {c.nome}
                        </Button>
                      );
                    })}
                  </Col>
                )}
              </Card.Body>
              <Card.Footer>
                <Button
                  size="sm"
                  style={{
                    width: "30%",
                    maxWidth: 120,
                    //   fontSize: 12,
                    padding: 2,
                    boxShadow:
                      " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                  }}
                  onMouseDown={(e) => {
                    e.target.style.boxShadow = "none";
                  }}
                  onMouseUp={(e) => {
                    e.target.style.boxShadow =
                      " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
                  }}
                  variant="success"
                  className="textos"
                  onClick={() => handleshowProduto()}
                >
                  <i className="bi bi-plus-circle me-2"></i>Incluir
                </Button>
              </Card.Footer>
            </Card>
          </Row>
        </Container>
      </Row>
    </div>
  );
}

export default Admin;
