import { useContext, useEffect, useState, useRef } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { AuthContext } from "../../contexts/authContext";
import { format, parseISO } from "date-fns";
import { FileUploader } from "react-drag-drop-files";
import ProfilePicture from "./ProfilePicture";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CustomToast from "../../components/CustomToast";
import api from "../../api/api";
import { SpinnerDotted } from "spinners-react";
import CountdownTimer from "./CountdownTimer";

function calcularDigitoVerificadorCPF(cpf) {
  // Remove qualquer caractere que não seja número
  cpf = cpf.replace(/\D/g, "");

  // Verifica se o CPF tem 9 dígitos
  if (cpf.length !== 9) {
    throw new Error("CPF deve conter 9 dígitos.");
  }

  // Função para calcular cada dígito verificador
  const calcularDigito = (baseCPF, pesoInicial) => {
    let soma = 0;
    for (let i = 0; i < baseCPF.length; i++) {
      soma += parseInt(baseCPF[i]) * (pesoInicial - i);
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  // Calcula o primeiro dígito verificador
  const primeiroDigito = calcularDigito(cpf, 10);

  // Adiciona o primeiro dígito ao CPF
  cpf += primeiroDigito;

  // Calcula o segundo dígito verificador
  const segundoDigito = calcularDigito(cpf, 11);

  // Retorna os dígitos verificadores
  return `${primeiroDigito}${segundoDigito}`;
}
function formatCPF(cpf) {
  // Remove qualquer caractere que não seja número
  cpf = cpf.replace(/\D/g, "");

  // Aplica a máscara de CPF: 999.999.999-99
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  return cpf;
}
function formatCel(number) {
  // Remove qualquer caractere que não seja número
  number = number.replace(/\D/g, "");

  // Aplica a máscara de celular: (DD)XXXXX-XXXX
  number = number.replace(/(\d{2})(\d)/, "($1)$2");
  number = number.replace(/(\d{5})(\d{4})$/, "$1-$2");

  return number;
}
function formatCep(number) {
  // Remove qualquer caractere que não seja número
  number = number.replace(/\D/g, "");

  number = number.replace(/(\d{5})(\d{3})$/, "$1-$2");

  return number;
}
const ProfilePage = () => {
  const [animationClass, setAnimationClass] = useState("");
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  // const [userData, setUserData] = useState({});
  const [reload, setReload] = useState(false);
  const [show, setShow] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [urlProfileImg, setUrlProfileImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [msgDrop, setMsgDrop] = useState(
    "Carregue ou arraste e largue o arquivo."
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [positionBd, setPositionBd] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState(100);
  const [imageSizeBd, setImageSizeBd] = useState(100);
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    celular: "",
    endereco: {
      logradouro: "",
      complemento: "",
      numero: "",
      cidade: "",
      estado: "",
      pais: "",
      cep: "",
    },
  });

  const [cepEncontrado, setCepEncontrado] = useState();
  const navigate = useNavigate();
  const emailSpinnerRef = useRef(null);
  const nomeSpinnerRef = useRef(null);
  const cpfSpinnerRef = useRef(null);
  const celularSpinnerRef = useRef(null);
  const cepSpinnerRef = useRef(null);
  const logradouroSpinnerRef = useRef(null);
  const numeroSpinnerRef = useRef(null);
  const complementoSpinnerRef = useRef(null);
  const bairroSpinnerRef = useRef(null);
  const cidadeSpinnerRef = useRef(null);
  const estadoSpinnerRef = useRef(null);
  const emailIconRef = useRef(null);

  const formMirrorRef = useRef({
    nome: true,
    cpf: true,
    email: true,
    celular: true,
    endereco: {
      logradouro: true,
      complemento: true,
      numero: true,
      cidade: true,
      estado: true,
      cep: true,
    },
  });

  //criar uma variável espelho do form, que só será alterada quando efetivamente enviar a mudança para o backend, assim quando o nome for alterado e o celular não o setForm verifica se form.nome é igual ao espelho, se for altera. Mas o form.celular ainda não será igual ao espelho, daí não altera o form

  useEffect(() => {
    async function fetchingUser() {
      try {
        if (
          loggedUser &&
          loggedUser.userData &&
          loggedUser.userData.endereco &&
          loggedUser.userData.endereco.cep
        ) {
          const res = await fetch(
            `https://viacep.com.br/ws/${loggedUser.userData.endereco.cep}/json/`,
            {
              method: "GET",
            }
          );
          const data = await res.json();
          if (
            loggedUser.userData.endereco.logradouro === data.logradouro &&
            loggedUser.userData.endereco.bairro === data.bairro &&
            loggedUser.userData.endereco.cidade === data.localidade &&
            loggedUser.userData.endereco.estado === data.estado
          ) {
            setCepEncontrado(true);
          } else {
            setCepEncontrado(false);
          }
        } else {
          setCepEncontrado(false);
        }

        setForm({
          nome:
            loggedUser.userData.nome &&
            loggedUser.userData.nome !== form.nome &&
            formMirrorRef.current.nome
              ? loggedUser.userData.nome
              : formMirrorRef.current.nome
              ? loggedUser.userData.nome
              : form.nome,
          cpf:
            loggedUser.userData.cpf &&
            loggedUser.userData.cpf !== form.cpf &&
            formMirrorRef.current.cpf
              ? loggedUser.userData.cpf
              : formMirrorRef.current.cpf
              ? loggedUser.userData.cpf
              : form.cpf,
          email:
            loggedUser.userData.email &&
            loggedUser.userData.email !== form.email &&
            formMirrorRef.current.email
              ? loggedUser.userData.email
              : formMirrorRef.current.email
              ? loggedUser.userData.email
              : form.email,
          celular:
            loggedUser.userData.celular &&
            loggedUser.userData.celular !== form.celular &&
            formMirrorRef.current.celular
              ? loggedUser.userData.celular
              : formMirrorRef.current.celular
              ? loggedUser.userData.celular
              : form.celular,
          endereco: {
            cep:
              loggedUser.userData.endereco &&
              loggedUser.userData.endereco.cep !== form.endereco.cep &&
              formMirrorRef.current.endereco.cep
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.cep
                : formMirrorRef.current.endereco.cep
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.cep
                : form.endereco.cep,
            logradouro:
              loggedUser.userData.endereco &&
              loggedUser.userData.endereco.logradouro !==
                form.endereco.logradouro &&
              formMirrorRef.current.endereco.logradouro
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.logradouro
                : formMirrorRef.current.endereco.logradouro
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.logradouro
                : form.endereco.logradouro,
            numero:
              loggedUser.userData.endereco &&
              loggedUser.userData.endereco.numero !== form.endereco.numero &&
              formMirrorRef.current.endereco.numero
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.numero
                : formMirrorRef.current.endereco.numero
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.numero
                : form.endereco.numero,
            complemento:
              loggedUser.userData.endereco &&
              loggedUser.userData.endereco.complemento !==
                form.endereco.complemento &&
              formMirrorRef.current.endereco.complemento
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.complemento
                : formMirrorRef.current.endereco.complemento
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.complemento
                : form.endereco.complemento,
            bairro:
              loggedUser.userData.endereco &&
              loggedUser.userData.endereco.bairro !== form.endereco.bairro &&
              formMirrorRef.current.endereco.bairro
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.bairro
                : formMirrorRef.current.endereco.bairro
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.bairro
                : form.endereco.bairro,
            cidade:
              loggedUser.userData.endereco &&
              loggedUser.userData.endereco.cidade !== form.endereco.cidade &&
              formMirrorRef.current.endereco.cidade
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.cidade
                : formMirrorRef.current.endereco.cidade
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.cidade
                : form.endereco.cidade,
            estado:
              loggedUser.userData.endereco &&
              loggedUser.userData.endereco.estado !== form.endereco.estado &&
              formMirrorRef.current.endereco.estado
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.estado
                : formMirrorRef.current.endereco.estado
                ? loggedUser.userData.endereco &&
                  loggedUser.userData.endereco.estado
                : form.endereco.estado,
          },
        });
      } catch (error) {
        console.log(error);
        toast.error(
          (t) => (
            <CustomToast t={t} message={"Erro na aplicação."} duration={5000} />
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
    fetchingUser();
  }, [navigate, reload, loggedUser]);

  useEffect(() => {
    async function fetchingUser() {
      try {
        setIsLoading(true);
        if (loggedUser.userData.profileImg) {
          setUrlProfileImg(
            loggedUser.userData.profileImg.url === ""
              ? null
              : loggedUser.userData.profileImg.url
          );
          setPreview(
            loggedUser.userData.profileImg.url === ""
              ? null
              : loggedUser.userData.profileImg.url
          );
          setPositionBd({
            x: loggedUser.userData.profileImg.position.x,
            y: loggedUser.userData.profileImg.position.y,
          });
          setPosition({
            x: loggedUser.userData.profileImg.position.x,
            y: loggedUser.userData.profileImg.position.y,
          });
          setImageSize(loggedUser.userData.profileImg.imageSize);
          setImageSizeBd(loggedUser.userData.profileImg.imageSize);
          // setUserData(loggedUser.userData);
        }
        setIsLoading(false);
        loggedUser.token !== "" &&
          localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      } catch (error) {
        console.log(error);
        toast.error(
          (t) => (
            <CustomToast t={t} message={"Erro na aplicação."} duration={5000} />
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
    fetchingUser();
  }, [navigate, reload, loggedUser]);

  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [type, setType] = useState("");

  const onChange = (file) => {
    if (file.size > 1024 * 1024 * 2) {
      toast.error(
        (t) => (
          <CustomToast
            t={t}
            message={"Tamanho máximo suportado é 2MB."}
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

      return;
    }
    setFile(file);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const srcData = fileReader.result;
      setPreview(srcData);
    };
    fileReader.readAsDataURL(file);
    setFilename(file.name);
    setType(file.type);
    setMsgDrop("Carregue ou arraste e largue o arquivo.");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!preview) {
      toast.error(
        (t) => (
          <CustomToast t={t} message={"Selecione uma foto"} duration={5000} />
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
      return;
    }
    const formData = new FormData();
    if (!file) {
      formData.append(
        "position",
        JSON.stringify({ x: position.x, y: position.y })
      );
      formData.append("imageSize", imageSize);
      formData.append("userId", loggedUser.userData._id);
    } else {
      formData.append("filename", filename);
      formData.append("contentType", type);
      formData.append("userId", loggedUser.userData._id);
      formData.append("image", file);
      formData.append(
        "position",
        JSON.stringify({ x: position.x, y: position.y })
      );
      formData.append("imageSize", imageSize);
    }

    try {
      setIsLoadingModal(true);
      const res = await api.post("/profileImg/upload", formData);

      setUrlProfileImg(preview ? preview : null);
      setFile(null);
      setFilename("");
      setType("");
      setPositionBd({
        x: position.x,
        y: position.y,
      });
      setImageSizeBd(imageSize);
      setIsLoadingModal(false);
      setShow(false);

      setLoggedUser({ ...loggedUser, userData: res.data });
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
        setLoggedUser(null);
        localStorage.clear();
        navigate("/");
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

  const handleClose = () => {
    setShow(false);
    setPreview(urlProfileImg ? urlProfileImg : null);
    setFile(null);
    setFilename("");
    setType("");
    setPosition(positionBd);
    setImageSize(imageSizeBd);
  };

  const [nomeValid, setNomeValid] = useState();
  const [nomeDisabled, setNomeDisabled] = useState(true);
  const [cpfValid, setCpfValid] = useState();
  const [cpfInvalidMsg, setCpfInvalidMsg] = useState("");
  const [cpfDisabled, setCpfDisabled] = useState(true);
  const [emailValid, setEmailValid] = useState();
  const [emailInvalidMsg, setEmailInvalidMsg] = useState("");
  const [emailDisabled, setEmailDisabled] = useState(true);
  const [celularValid, setCelularValid] = useState();
  const [celularInvalidMsg, setCelularInvalidMsg] = useState("");
  const [celularDisabled, setCelularDisabled] = useState(true);
  const [cepValid, setCepValid] = useState();
  const [cepInvalidMsg, setCepInvalidMsg] = useState("");
  const [cepDisabled, setCepDisabled] = useState(true);
  const [logradouroValid, setLogradouroValid] = useState();
  const [logradouroInvalidMsg, setLogradouroInvalidMsg] = useState("");
  const [logradouroDisabled, setLogradouroDisabled] = useState(true);
  const [numeroValid, setNumeroValid] = useState();
  const [numeroInvalidMsg, setNumeroInvalidMsg] = useState("");
  const [numeroDisabled, setNumeroDisabled] = useState(true);
  const [complementoValid, setComplementoValid] = useState();
  const [complementoInvalidMsg, setComplementoInvalidMsg] = useState("");
  const [complementoDisabled, setComplementoDisabled] = useState(true);
  const [bairroValid, setBairroValid] = useState();
  const [bairroInvalidMsg, setBairroInvalidMsg] = useState("");
  const [bairroDisabled, setBairroDisabled] = useState(true);
  const [cidadeValid, setCidadeValid] = useState();
  const [cidadeInvalidMsg, setCidadeInvalidMsg] = useState("");
  const [cidadeDisabled, setCidadeDisabled] = useState(true);
  const [estadoValid, setEstadoValid] = useState();
  const [estadoInvalidMsg, setEstadoInvalidMsg] = useState("");
  const [estadoDisabled, setEstadoDisabled] = useState(true);
  const handleChange = (e) => {
    if (e.target.name === "nome") {
      setForm({ ...form, [e.target.name]: e.target.value });
      if (e.target.value === "") {
        setNomeValid(false);
      } else {
        if (nomeValid === false) {
          setNomeValid(true);
        }
      }
    }
    if (e.target.name === "cpf") {
      setForm({ ...form, [e.target.name]: e.target.value.replace(/\D/g, "") });
      if (e.target.value === "") {
        setCpfValid(false);
      } else {
        if (!e.target.value.replace(/\D/g, "").match(/([0-9]){11}/)) {
          setCpfValid(false);
          setCpfInvalidMsg("Insira os 11 dígitos do seu CPF");
          return;
        } else {
          const dv = calcularDigitoVerificadorCPF(
            e.target.value.replace(/\D/g, "").slice(0, 9)
          );
          if (dv === e.target.value.replace(/\D/g, "").slice(-2)) {
            setCpfValid(true);
          } else {
            setCpfValid(false);
            setCpfInvalidMsg("Digite um CPF válido.");
          }
        }
      }
    }
    if (e.target.name === "email") {
      setForm({ ...form, [e.target.name]: e.target.value });
      if (e.target.value === "") {
        setEmailValid(false);
      } else {
        if (
          !e.target.value.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm)
        ) {
          setEmailValid(false);
          setEmailInvalidMsg("Insira um e-mail válido.");
          return;
        } else {
          setEmailValid(true);
        }
      }
    }
    if (e.target.name === "celular") {
      setForm({ ...form, [e.target.name]: e.target.value.replace(/\D/g, "") });
      if (e.target.value === "") {
        setCelularValid(false);
      } else {
        if (!e.target.value.replace(/\D/g, "").match(/([0-9]){11}/)) {
          setCelularValid(false);
          setCelularInvalidMsg("Insira um celular válido.");
          return;
        } else {
          setCelularValid(true);
        }
      }
    }
    if (e.target.name === "cep") {
      setForm({
        ...form,
        endereco: {
          ...form.endereco,
          [e.target.name]: e.target.value.replace(/\D/g, ""),
        },
      });
      if (e.target.value === "") {
        setCepValid(false);
      } else {
        if (!e.target.value.replace(/\D/g, "").match(/([0-9]){8}/)) {
          setCepValid(false);
          setCepInvalidMsg("Insira os 8 dígitos do seu CEP");
          return;
        } else {
          setCepValid(true);
        }
      }
    }
    if (e.target.name === "logradouro") {
      setForm({
        ...form,
        endereco: {
          ...form.endereco,
          [e.target.name]: e.target.value,
        },
      });

      if (e.target.value === "") {
        setLogradouroValid(false);
        setLogradouroInvalidMsg("Insira um logradouro");
      } else {
        setLogradouroValid(true);
      }
    }
    if (e.target.name === "numero") {
      setForm({
        ...form,
        endereco: {
          ...form.endereco,
          [e.target.name]: e.target.value,
        },
      });
    }
    if (e.target.name === "complemento") {
      setForm({
        ...form,
        endereco: {
          ...form.endereco,
          [e.target.name]: e.target.value,
        },
      });
    }
    if (e.target.name === "bairro") {
      setForm({
        ...form,
        endereco: {
          ...form.endereco,
          [e.target.name]: e.target.value,
        },
      });
    }
    if (e.target.name === "cidade") {
      setForm({
        ...form,
        endereco: {
          ...form.endereco,
          [e.target.name]: e.target.value,
        },
      });
    }
    if (e.target.name === "estado") {
      setForm({
        ...form,
        endereco: {
          ...form.endereco,
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  const [codigoBackend, setCodigoBackend] = useState();
  const [codigoFrontend, setCodigoFrontend] = useState();
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const alterouRef = useRef(null);
  const timeoutRef = useRef(null);
  const onSubmitProfileChange = async (e) => {
    e.preventDefault();

    if (e.target.name === "emailChangeSubmit") {
      if (codigoBackend === +codigoFrontend) {
        alterouRef.current = true;
        try {
          const res = await api.put("/usuario/alterarEmail", {
            user: loggedUser.userData._id,
            novoEmail: form.email,
            codigo: codigoFrontend,
          });
        } catch (error) {
          if (
            error.response.data.msg ===
            "Sua sessão expirou, realize novo login."
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
            setLoggedUser(null);
            localStorage.clear();
            navigate("/");
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
        handleCloseEmailChange();
      } else {
        setShowErrorMsg(true);
      }
    }
  };

  const handleCloseEmailChange = async () => {
    clearTimeout(timeoutRef.current);
    if (alterouRef.current) {
      setTimeout(() => {
        setLoggedUser({
          ...loggedUser,
          userData: {
            ...loggedUser.userData,
            email: form.email,
          },
        });
        formMirrorRef.current = {
          nome: false,
          cpf: false,
          email: true,
          celular: false,
          endereco: {
            logradouro: false,
            complemento: false,
            numero: false,
            bairro: false,
            cidade: false,
            estado: false,
            cep: false,
          },
        };
        setAnimationClass("animate__fadeIn");
      }, 500);
      emailIconRef.className =
        "bi bi-cloud-upload animate__animated animate__fadeOut";
      setTimeout(() => {
        emailIconRef.className =
          "bi bi-pencil-square animate__animated animate__fadeIn";
        setEmailDisabled(!emailDisabled);
        setEmailValid();
      }, 500);
    } else {
      setForm({
        ...form,
        email: loggedUser.userData.email,
      });
      emailIconRef.className =
        "bi bi-cloud-upload animate__animated animate__fadeOut";
      setTimeout(() => {
        emailIconRef.className =
          "bi bi-pencil-square animate__animated animate__fadeIn";
        setEmailDisabled(!emailDisabled);
        setEmailValid();
      }, 500);
      try {
        const res = await api.put("/usuario/alterarEmail", {
          user: loggedUser.userData._id,
        });
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
          setLoggedUser(null);
          localStorage.clear();
          navigate("/");
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
    }
    alterouRef.current = null;
    setCodigoFrontend("");
    setShowEmailChange(false);
    setShowErrorMsg(false);
  };

  const handleChangeModal = (e) => {
    if (e.target.name === "codigo") {
      setCodigoFrontend(e.target.value);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        // size="md"
        className="modalMedio"
      >
        <Modal.Header closeButton style={{ backgroundColor: "#e9ecef" }}>
          <h6>Escolha sua foto de perfil</h6>
        </Modal.Header>
        {isLoadingModal ? (
          <Row className="d-flex justify-content-center m-0 my-4">
            <SpinnerDotted
              size={67}
              thickness={106}
              speed={141}
              color="#36ad47"
            />
          </Row>
        ) : (
          <Modal.Body>
            <Row className="d-flex justify-content-evenly align-items-center">
              <Col
                xs="auto"
                className="d-flex justify-content-center align-items-center mb-3"
              >
                <div
                  className="manipulaFileUploader"
                  style={{
                    width: "95%",
                    marginInline: "auto",
                    marginBlock: 0,
                  }}
                >
                  <FileUploader
                    onTypeError={(e) => {
                      if (e === "File type is not supported") {
                        setMsgDrop(
                          "Somente .png e .jpg são suportados! Carregue outro arquivo."
                        );
                        setFilename("");
                      }
                    }}
                    handleChange={onChange}
                    hoverTitle="Largue aqui"
                    name="file"
                    types={["png", "jpg", "jpeg"]}
                  >
                    <Col
                      style={{
                        border: "1.5px dashed rgb(153, 153, 169)",
                        borderRadius: 8,
                        width: "100%",
                        cursor: "pointer",
                      }}
                    >
                      <Row
                        className="d-flex align-items-center justify-content-center my-3"
                        style={{ height: 30 }}
                      >
                        <i className="bi bi-cloud-upload-fill p-0"></i>
                      </Row>
                      <Row
                        className="d-flex justify-content-center mb-2 mx-0 "
                        style={{
                          color:
                            msgDrop ===
                            "Somente .png e .jpg são suportados! Carregue outro arquivo."
                              ? "red"
                              : "rgb(153, 153, 169)",
                          textDecoration:
                            msgDrop ===
                              "Carregue ou arraste e largue o arquivo." &&
                            "underline",
                          marginInline: "auto",
                          paddingInline: "auto",
                        }}
                      >
                        {msgDrop}
                      </Row>
                      <Row
                        className="d-flex justify-content-center mb-2 "
                        style={{
                          color: "rgb(153, 153, 169)",
                          marginInline: "auto",
                          fontSize: 12,
                        }}
                      >
                        {file && "Arquivo carregado:"} {filename}
                      </Row>
                    </Col>
                  </FileUploader>
                </div>
              </Col>
              <Col
                xs="auto"
                className="d-flex  justify-content-center align-items-center mb-3"
              >
                <ProfilePicture
                  urlProfileImg={urlProfileImg}
                  loggedUser={loggedUser}
                  preview={preview}
                  position={position}
                  setPosition={setPosition}
                  imageSize={imageSize}
                  setImageSize={setImageSize}
                  alt="Imagem perfil"
                />
              </Col>
            </Row>
          </Modal.Body>
        )}
        <Modal.Footer style={{ backgroundColor: "#e9ecef" }}>
          <Container className="">
            <Row className="d-flex justify-content-evenly align-items-center ">
              <Col
                xs="auto"
                className="d-flex justify-content-center align-items mb-2"
                style={{ fontSize: 11 }}
              >
                * Selecione fotos que você esteja no centro
              </Col>
              <Col>
                <Row className="d-flex justify-content-evenly align-items-center flex-nowrap">
                  <Col
                    xs="auto"
                    className="d-flex justify-content-center align-items-center"
                  >
                    <Button
                      variant="success"
                      disabled={
                        (urlProfileImg === preview &&
                          positionBd.x === position.x &&
                          positionBd.y === position.y &&
                          imageSizeBd === imageSize) ||
                        isLoading
                      }
                      onClick={onSubmit}
                      size="sm"
                      style={{ fontSize: 12 }}
                    >
                      Salvar
                    </Button>
                  </Col>
                  {urlProfileImg && (
                    <Col
                      xs="auto"
                      className="d-flex justify-content-center align-items-center"
                    >
                      <Button
                        variant="danger"
                        onClick={async (e) => {
                          e.preventDefault();
                          setIsLoadingModal(true);
                          const res = await api.delete(
                            `/profileImg/excluir/${loggedUser.userData._id}`
                          );
                          setIsLoadingModal(false);
                          setShow(false);
                          setUrlProfileImg(null);
                          setPreview(null);
                          setFile(null);
                          setFilename("");
                          setType("");
                          setPositionBd({ x: 0, y: 0 });
                          setPosition({ x: 0, y: 0 });
                          setImageSize(100);
                          setImageSizeBd(100);
                          // setReload(!reload);
                          setLoggedUser({
                            ...loggedUser,
                            userData: {
                              ...loggedUser.userData,
                              profileImg: {
                                url: "",
                                imageSize: 100,
                                position: { x: 0, y: 0 },
                              },
                            },
                          });
                        }}
                        size="sm"
                        style={{ fontSize: 12 }}
                      >
                        Excluir
                      </Button>
                    </Col>
                  )}
                  <Col
                    xs="auto"
                    className="d-flex justify-content-center align-items-center"
                  >
                    <Button
                      variant="secondary"
                      onClick={(e) => {
                        handleClose();
                      }}
                      size="sm"
                      style={{ fontSize: 12 }}
                    >
                      Cancelar
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showEmailChange}
        onHide={handleCloseEmailChange}
        backdrop="static"
        keyboard={false}
        // size="md"
      >
        <Modal.Header closeButton style={{ backgroundColor: "#e9ecef" }}>
          <h6>Verificação</h6>
        </Modal.Header>
        {isLoadingModal ? (
          <Row className="d-flex justify-content-center m-0 my-4">
            <SpinnerDotted
              size={67}
              thickness={106}
              speed={141}
              color="#36ad47"
            />
          </Row>
        ) : (
          <Modal.Body>
            <Row
              className="d-flex justify-content-evenly align-items-center mb-3"
              style={{ fontSize: 12 }}
            >
              Insira o código de verificação enviado para o seu novo email.
            </Row>
            <Row className="d-flex justify-content-evenly align-items-center">
              <Container>
                <FloatingLabel
                  label="Código"
                  className="mb-3 labelCriarConta"
                  style={{ fontSize: 12 }}
                >
                  <Form.Control
                    required
                    type="text"
                    placeholder=""
                    name="codigo"
                    value={codigoFrontend}
                    style={{
                      height: 30,
                      fontSize: 13,
                      minHeight: 35,
                    }}
                    onChange={handleChangeModal}
                  />
                </FloatingLabel>
              </Container>
            </Row>
            <Row className="d-flex justify-content-evenly align-items-center">
              <CountdownTimer initialSeconds={120} />
            </Row>
            {showErrorMsg && (
              <Row
                as={"p"}
                className="d-flex justify-content-center align-items-center animate__animated animate__fadeIn m-0 p-0"
                style={{ marginInline: "auto" }}
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 130.2 130.2"
                  style={{ width: 50, height: 50 }}
                >
                  <circle
                    class="path circle"
                    fill="none"
                    stroke="var(--bs-form-invalid-color)"
                    stroke-width="10"
                    stroke-miterlimit="10"
                    cx="65.1"
                    cy="65.1"
                    r="60.1"
                  />
                  <line
                    class="path line"
                    fill="none"
                    stroke="var(--bs-form-invalid-color)"
                    stroke-width="10"
                    stroke-linecap="round"
                    stroke-miterlimit="10"
                    x1="34.4"
                    y1="37.9"
                    x2="95.8"
                    y2="92.3"
                  />
                  <line
                    class="path line"
                    fill="none"
                    stroke="var(--bs-form-invalid-color)"
                    stroke-width="10"
                    stroke-linecap="round"
                    stroke-miterlimit="10"
                    x1="95.8"
                    y1="38"
                    x2="34.4"
                    y2="92.2"
                  />
                </svg>{" "}
                <b
                  style={{
                    fontSize: 12,
                    paddingInline: 0,
                    color: "var(--bs-form-invalid-color)",
                    textAlign: "center",
                  }}
                >
                  "Código incorreto"
                </b>
              </Row>
            )}
          </Modal.Body>
        )}
        <Modal.Footer style={{ backgroundColor: "#e9ecef" }}>
          <Container className="">
            <Row className="d-flex justify-content-evenly align-items-center ">
              <Col>
                <Row className="d-flex justify-content-evenly align-items-center flex-nowrap">
                  <Col
                    xs="auto"
                    className="d-flex justify-content-center align-items-center"
                  >
                    <Button
                      name="emailChangeSubmit"
                      variant="success"
                      onClick={onSubmitProfileChange}
                      size="sm"
                      style={{ fontSize: 12 }}
                      disabled={codigoFrontend === ""}
                    >
                      Verificar
                    </Button>
                  </Col>
                  <Col
                    xs="auto"
                    className="d-flex justify-content-center align-items-center"
                  >
                    <Button
                      variant="secondary"
                      onClick={(e) => {
                        handleCloseEmailChange();
                      }}
                      size="sm"
                      style={{ fontSize: 12 }}
                    >
                      Cancelar
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
      <Row
        className="rowProfile"
        style={{
          width: "100%",

          marginInline: "auto",
          marginTop: 100,
          marginBottom: 60,
        }}
      >
        <Card
          style={{
            width: "80%",
            marginInline: "auto",
            paddingInline: 0,
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            animation: "fadein 1.5s",
          }}
        >
          <Card.Header>
            <Row className="flex-nowrap">
              <Col
                xs="auto"
                className="d-flex align-items-center justify-content-center "
              >
                {urlProfileImg ? (
                  <Col
                    xs="auto"
                    className=" m-0 d-flex flex-column align-items-end justify-content-center"
                    style={{ position: "relative" }}
                  >
                    <div
                      className="d-flex justify-content-center align-items-center "
                      style={{
                        width: 50,
                        height: 50,
                        position: "relative",
                        borderRadius: "50%",
                        overflow: "hidden",
                        boxShadow:
                          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                      }}
                    >
                      <img
                        src={urlProfileImg}
                        alt="imagem de perfil"
                        style={{
                          position: "absolute",
                          width: imageSizeBd * 0.5,
                          // height: urlProfileImg ? 150 : 100,

                          objectFit: "cover",

                          transform: `translate(${positionBd.x * 0.5}px, ${
                            positionBd.y * 0.5
                          }px)`,
                        }}
                      />
                    </div>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip style={{ position: "absolute", fontSize: 12 }}>
                          Alterar foto de perfil
                        </Tooltip>
                      }
                    >
                      <i
                        className="bi bi-pencil-square"
                        style={{
                          cursor: "pointer",
                          position: "absolute",
                          right: -4,
                          bottom: -4,
                          fontSize: 10,
                        }}
                        onClick={(e) => {
                          setShow(true);
                        }}
                      ></i>
                    </OverlayTrigger>
                  </Col>
                ) : (
                  <>
                    <Col
                      xs="auto"
                      className="p-0  profilePageImg d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: "var(--bs-body-bg)",
                        marginRight: 2,
                        color: "var(--bs-text-color)",
                        position: "relative",
                      }}
                    >
                      {loggedUser.userData.nome &&
                        loggedUser.userData.nome[0].toUpperCase() +
                          loggedUser.userData.nome
                            .split(" ")
                            .slice(-1)[0][0]
                            .toUpperCase()}
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip
                            style={{ position: "absolute", fontSize: 10 }}
                          >
                            Alterar foto de perfil
                          </Tooltip>
                        }
                      >
                        <i
                          className="bi bi-pencil-square"
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            right: -4,
                            bottom: -4,
                            fontSize: 10,
                          }}
                          onClick={(e) => {
                            setShow(true);
                          }}
                        ></i>
                      </OverlayTrigger>
                    </Col>
                  </>
                )}
              </Col>
              <Col
                xs="auto"
                className="ps-0 nomeTruncado"
                style={{ width: "85%" }}
              >
                <Row
                  className="d-flex h-100 m-0 align-items-center"
                  // style={{
                  //   fontSize: 12,
                  //   textAlign: "left",
                  //   whiteSpace: "nowrap",
                  //   overflow: "hidden",
                  //   textOverflow: "ellipsis",
                  //   width: 50,
                  // }}
                >
                  <div
                    className={`nomeProfile p-0 animate__animated ${animationClass}`}
                    onAnimationEnd={() => setAnimationClass("")}
                    style={{
                      fontSize: 12,
                      marginBottom: -20,
                      textAlign: "left",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                    }}
                  >
                    {loggedUser.userData.nome && loggedUser.userData.nome}
                  </div>
                  <Row className="d-flex p-0 m-0 ">
                    <i
                      className=" criadoProfile "
                      style={{
                        textAlign: "left",
                        fontSize: 9,
                        paddingInline: 6,
                      }}
                    >
                      Desde{" "}
                      {loggedUser.userData.createdAt &&
                        format(
                          parseISO(loggedUser.userData.createdAt),
                          "dd/MM/yyyy"
                        )}
                    </i>
                  </Row>
                </Row>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="cardBodyProfile">
            <Row className="mx-0 mb-0" style={{ paddingTop: 5 }}>
              <Accordion
                // defaultActiveKey="0"
                className="d-flex flex-column p-0"
                style={{
                  animation: "fadein 1.5s",
                  backgroundColor: "transparent",
                  borderWidth: 0,
                }}
              >
                <Accordion.Item
                  eventKey="0"
                  style={{
                    // boxShadow:
                    //   "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                    animation: "fadein 1.5s",
                    marginBottom: 10,
                    borderWidth: 0,
                    // borderBottomColor: "red",
                    // borderBottomStyle: "solid",
                    // borderBottomWidth: 5,
                  }}
                >
                  <Accordion.Header
                    className="profileAcordionHeader"
                    style={{
                      borderBottomColor: "var(--bs-accordion-border-color)",
                      borderBottomStyle: "solid",
                      borderBottomWidth: 1,
                    }}
                  >
                    Dados pessoais
                  </Accordion.Header>
                  <Accordion.Body
                    className="acordionBody pb-0"
                    style={{
                      backgroundColor: "var(--bs-body-bg)",
                      color: "var(--bs-body-color)",
                    }}
                  >
                    <Container>
                      <Form.Group className="mb-3" style={{ marginLeft: -15 }}>
                        <FloatingLabel
                          label="Nome completo"
                          className="mb-3 labelCriarConta disabledSemEstilo"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            required
                            type="text"
                            placeholder=""
                            name="nome"
                            value={form.nome}
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            onChange={handleChange}
                            disabled={nomeDisabled}
                            isValid={nomeValid}
                            isInvalid={nomeValid === false}
                          />
                          <Form.Control.Feedback type="invalid">
                            Insira o seu nome.
                          </Form.Control.Feedback>
                          <div ref={nomeSpinnerRef} style={{ display: "none" }}>
                            <SpinnerDotted
                              size={15}
                              thickness={200}
                              speed={141}
                              color="#36ad47"
                              style={{
                                position: "absolute",
                                top: 20,
                                right: -18,
                              }}
                            />
                          </div>
                          {nomeSpinnerRef.current &&
                            nomeSpinnerRef.current.style.display === "none" &&
                            (nomeDisabled ? (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Alterar nome
                                  </Tooltip>
                                }
                              >
                                <i
                                  className={`bi bi-pencil-square animate__animated animate__fadeIn`}
                                  onAnimationEnd={() => setAnimationClass("")}
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.target.className =
                                      "bi bi-pencil-square animate__animated animate__fadeOut";
                                    setTimeout(() => {
                                      setNomeDisabled(!nomeDisabled);
                                      e.target.className =
                                        "bi bi-pencil-square animate__animated animate__fadeIn";
                                    }, 500);
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Salvar nome
                                  </Tooltip>
                                }
                              >
                                <i
                                  className="bi bi-cloud-upload animate__animated animate__fadeIn"
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={async (e) => {
                                    if (
                                      form.nome === loggedUser.userData.nome ||
                                      nomeValid === false
                                    ) {
                                      setForm({
                                        ...form,
                                        nome: loggedUser.userData.nome,
                                      });
                                      e.target.className =
                                        "bi bi-cloud-upload animate__animated animate__fadeOut";
                                      setTimeout(() => {
                                        e.target.className =
                                          "bi bi-pencil-square animate__animated animate__fadeIn";
                                        setNomeDisabled(!nomeDisabled);
                                        setNomeValid();
                                      }, 500);
                                      return;
                                    } else {
                                      setAnimationClass("animate__fadeOut");

                                      nomeSpinnerRef.current.style.display =
                                        "block";
                                      try {
                                        const res = await api.put(
                                          "/usuario/edit",
                                          {
                                            nome: form.nome,
                                          }
                                        );
                                        nomeSpinnerRef.current.style.display =
                                          "none";
                                        setTimeout(() => {
                                          setLoggedUser({
                                            ...loggedUser,
                                            userData: {
                                              ...loggedUser.userData,
                                              nome: form.nome,
                                            },
                                          });
                                          formMirrorRef.current = {
                                            nome: true,
                                            cpf: false,
                                            email: false,
                                            celular: false,
                                            endereco: {
                                              logradouro: false,
                                              complemento: false,
                                              numero: false,
                                              bairro: false,
                                              cidade: false,
                                              estado: false,
                                              cep: false,
                                            },
                                          };

                                          setAnimationClass("animate__fadeIn");
                                        }, 500);

                                        e.target.className =
                                          "bi bi-cloud-upload animate__animated animate__fadeOut";
                                        setTimeout(() => {
                                          e.target.className =
                                            "bi bi-pencil-square animate__animated animate__fadeIn";
                                          setNomeDisabled(!nomeDisabled);
                                          setNomeValid();
                                        }, 500);
                                      } catch (error) {
                                        console.log(error);
                                        if (
                                          error.response.data.msg ===
                                          "Sua sessão expirou, realize novo login."
                                        ) {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                          setLoggedUser(null);
                                          localStorage.clear();
                                          navigate("/");
                                        } else {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                    }
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ))}
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group className="mb-3" style={{ marginLeft: -15 }}>
                        <FloatingLabel
                          label="CPF"
                          className="mb-3 labelCriarConta disabledSemEstilo"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            required
                            type="text"
                            placeholder=""
                            name="cpf"
                            maxLength={14}
                            value={form.cpf && formatCPF(form.cpf)}
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            onChange={handleChange}
                            disabled={cpfDisabled}
                            isValid={cpfValid}
                            isInvalid={cpfValid === false}
                          />
                          <Form.Control.Feedback type="invalid">
                            {cpfInvalidMsg}
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="valid">
                            CPF válido.
                          </Form.Control.Feedback>
                          <div ref={cpfSpinnerRef} style={{ display: "none" }}>
                            <SpinnerDotted
                              size={15}
                              thickness={200}
                              speed={141}
                              color="#36ad47"
                              style={{
                                position: "absolute",
                                top: 20,
                                right: -18,
                              }}
                            />
                          </div>
                          {cpfSpinnerRef.current &&
                            cpfSpinnerRef.current.style.display === "none" &&
                            (cpfDisabled ? (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Alterar CPF
                                  </Tooltip>
                                }
                              >
                                <i
                                  className={`bi bi-pencil-square animate__animated animate__fadeIn`}
                                  onAnimationEnd={() => setAnimationClass("")}
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.target.className =
                                      "bi bi-pencil-square animate__animated animate__fadeOut";
                                    setTimeout(() => {
                                      setCpfDisabled(!cpfDisabled);
                                      e.target.className =
                                        "bi bi-pencil-square animate__animated animate__fadeIn";
                                    }, 500);
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Salvar CPF
                                  </Tooltip>
                                }
                              >
                                <i
                                  className="bi bi-cloud-upload animate__animated animate__fadeIn"
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={async (e) => {
                                    if (
                                      form.cpf === loggedUser.userData.cpf ||
                                      cpfValid === false
                                    ) {
                                      setForm({
                                        ...form,
                                        cpf: loggedUser.userData.cpf,
                                      });
                                      e.target.className =
                                        "bi bi-cloud-upload animate__animated animate__fadeOut";
                                      setTimeout(() => {
                                        e.target.className =
                                          "bi bi-pencil-square animate__animated animate__fadeIn";
                                        setCpfDisabled(!cpfDisabled);
                                        setCpfValid();
                                      }, 500);
                                      return;
                                    } else {
                                      setAnimationClass("animate__fadeOut");
                                      cpfSpinnerRef.current.style.display =
                                        "block";
                                      try {
                                        const res = await api.put(
                                          "/usuario/edit",
                                          {
                                            cpf: form.cpf,
                                          }
                                        );
                                        cpfSpinnerRef.current.style.display =
                                          "none";
                                        setTimeout(() => {
                                          setLoggedUser({
                                            ...loggedUser,
                                            userData: {
                                              ...loggedUser.userData,
                                              cpf: form.cpf,
                                            },
                                          });
                                          formMirrorRef.current = {
                                            nome: false,
                                            cpf: true,
                                            email: false,
                                            celular: false,
                                            endereco: {
                                              logradouro: false,
                                              complemento: false,
                                              numero: false,
                                              bairro: false,
                                              cidade: false,
                                              estado: false,
                                              cep: false,
                                            },
                                          };
                                          setAnimationClass("animate__fadeIn");
                                        }, 500);
                                        e.target.className =
                                          "bi bi-cloud-upload animate__animated animate__fadeOut";
                                        setTimeout(() => {
                                          e.target.className =
                                            "bi bi-pencil-square animate__animated animate__fadeIn";
                                          setCpfDisabled(!cpfDisabled);
                                          setCpfValid();
                                        }, 500);
                                      } catch (error) {
                                        console.log(error);
                                        if (
                                          error.response.data.msg ===
                                          "Sua sessão expirou, realize novo login."
                                        ) {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                          setLoggedUser(null);
                                          localStorage.clear();
                                          navigate("/");
                                        } else {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                    }
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ))}
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group className="mb-3" style={{ marginLeft: -15 }}>
                        <FloatingLabel
                          label="Endereço de email"
                          className="mb-3 labelCriarConta disabledSemEstilo"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            required
                            type="email"
                            placeholder=""
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            disabled={emailDisabled}
                            isValid={emailValid}
                            isInvalid={emailValid === false}
                          />
                          <Form.Control.Feedback type="invalid">
                            {emailInvalidMsg}
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="valid">
                            E-mail válido.
                          </Form.Control.Feedback>
                          <div
                            ref={emailSpinnerRef}
                            style={{ display: "none" }}
                          >
                            <SpinnerDotted
                              size={15}
                              thickness={200}
                              speed={141}
                              color="#36ad47"
                              style={{
                                position: "absolute",
                                top: 20,
                                right: -18,
                              }}
                            />
                          </div>
                          {emailSpinnerRef.current &&
                            emailSpinnerRef.current.style.display === "none" &&
                            (emailDisabled ? (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Alterar Email
                                  </Tooltip>
                                }
                              >
                                <i
                                  className={`bi bi-pencil-square animate__animated animate__fadeIn`}
                                  onAnimationEnd={() => setAnimationClass("")}
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.target.className =
                                      "bi bi-pencil-square animate__animated animate__fadeOut";
                                    setTimeout(() => {
                                      setEmailDisabled(!emailDisabled);
                                      e.target.className =
                                        "bi bi-pencil-square animate__animated animate__fadeIn";
                                    }, 500);
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Salvar email
                                  </Tooltip>
                                }
                              >
                                <i
                                  ref={emailIconRef}
                                  className="bi bi-cloud-upload animate__animated animate__fadeIn"
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={async (e) => {
                                    if (
                                      form.email ===
                                        loggedUser.userData.email ||
                                      emailValid === false
                                    ) {
                                      setForm({
                                        ...form,
                                        email: loggedUser.userData.email,
                                      });
                                      e.target.className =
                                        "bi bi-cloud-upload animate__animated animate__fadeOut";
                                      setTimeout(() => {
                                        e.target.className =
                                          "bi bi-pencil-square animate__animated animate__fadeIn";
                                        setEmailDisabled(!emailDisabled);
                                        setEmailValid();
                                      }, 500);
                                      return;
                                    } else {
                                      setAnimationClass("animate__fadeOut");

                                      emailSpinnerRef.current.style.display =
                                        "block";
                                      try {
                                        const res = await api.put(
                                          "/usuario/alterarEmail",
                                          {
                                            novoEmail: form.email,
                                            user: loggedUser.userData._id,
                                          }
                                        );

                                        setCodigoBackend(res.data.msg);
                                      } catch (error) {
                                        console.log(error);
                                        if (
                                          error.response.data.msg ===
                                          "Sua sessão expirou, realize novo login."
                                        ) {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                          setLoggedUser(null);
                                          localStorage.clear();
                                          navigate("/");
                                        } else {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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

                                      emailSpinnerRef.current.style.display =
                                        "none";

                                      setShowEmailChange(true);
                                      timeoutRef.current = setTimeout(() => {
                                        handleCloseEmailChange();
                                      }, 131000);
                                      //mostrar o modal para inclusão do código de verificação
                                      //incluir o codigo abaixo no onclick de enviar o código somente se receber a resposta ok do backend
                                      //se não verificar ou perder o tempo, deve incluir o mesmo código quando o usuário não altera o email no input
                                      // setTimeout(() => {
                                      //   setLoggedUser({
                                      //     ...loggedUser,
                                      //     userData: {
                                      //       ...loggedUser.userData,
                                      //       email: form.email,
                                      //     },
                                      //   });
                                      //   setAnimationClass("animate__fadeIn");
                                      // }, 500);
                                    }
                                    // e.target.className =
                                    //   "bi bi-cloud-upload animate__animated animate__fadeOut";
                                    // setTimeout(() => {
                                    //   e.target.className =
                                    //     "bi bi-pencil-square animate__animated animate__fadeIn";
                                    //   setEmailDisabled(!emailDisabled);
                                    //   setEmailValid();
                                    // }, 500);
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ))}
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group className="mb-3" style={{ marginLeft: -15 }}>
                        <FloatingLabel
                          label="Celular"
                          className="mb-3 labelCriarConta disabledSemEstilo"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            required
                            type="celular"
                            placeholder=""
                            name="celular"
                            maxLength={14}
                            value={form.celular && formatCel(form.celular)}
                            onChange={handleChange}
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            disabled={celularDisabled}
                            isValid={celularValid}
                            isInvalid={celularValid === false}
                          />
                          <Form.Control.Feedback type="invalid">
                            {celularInvalidMsg}
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="valid">
                            E-mail válido.
                          </Form.Control.Feedback>
                          <div
                            ref={celularSpinnerRef}
                            style={{ display: "none" }}
                          >
                            <SpinnerDotted
                              size={15}
                              thickness={200}
                              speed={141}
                              color="#36ad47"
                              style={{
                                position: "absolute",
                                top: 20,
                                right: -18,
                              }}
                            />
                          </div>
                          {celularSpinnerRef.current &&
                            celularSpinnerRef.current.style.display ===
                              "none" &&
                            (celularDisabled ? (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Alterar cel
                                  </Tooltip>
                                }
                              >
                                <i
                                  className={`bi bi-pencil-square animate__animated animate__fadeIn`}
                                  onAnimationEnd={() => setAnimationClass("")}
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.target.className =
                                      "bi bi-pencil-square animate__animated animate__fadeOut";
                                    setTimeout(() => {
                                      setCelularDisabled(!celularDisabled);
                                      e.target.className =
                                        "bi bi-pencil-square animate__animated animate__fadeIn";
                                    }, 500);
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Salvar cel
                                  </Tooltip>
                                }
                              >
                                <i
                                  className="bi bi-cloud-upload animate__animated animate__fadeIn"
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={async (e) => {
                                    if (
                                      form.celular ===
                                        loggedUser.userData.celular ||
                                      celularValid === false
                                    ) {
                                      setForm({
                                        ...form,
                                        celular: loggedUser.userData.celular,
                                      });
                                      e.target.className =
                                        "bi bi-cloud-upload animate__animated animate__fadeOut";
                                      setTimeout(() => {
                                        e.target.className =
                                          "bi bi-pencil-square animate__animated animate__fadeIn";
                                        setCelularDisabled(!celularDisabled);
                                        setCelularValid();
                                      }, 500);
                                      return;
                                    } else {
                                      setAnimationClass("animate__fadeOut");

                                      celularSpinnerRef.current.style.display =
                                        "block";
                                      try {
                                        const res = await api.put(
                                          "/usuario/edit",
                                          {
                                            celular: form.celular,
                                          }
                                        );
                                        celularSpinnerRef.current.style.display =
                                          "none";
                                        setTimeout(() => {
                                          setLoggedUser({
                                            ...loggedUser,
                                            userData: {
                                              ...loggedUser.userData,
                                              celular: form.celular,
                                            },
                                          });
                                          formMirrorRef.current = {
                                            nome: false,
                                            cpf: false,
                                            email: false,
                                            celular: true,
                                            endereco: {
                                              logradouro: false,
                                              complemento: false,
                                              numero: false,
                                              bairro: false,
                                              cidade: false,
                                              estado: false,
                                              cep: false,
                                            },
                                          };
                                          setAnimationClass("animate__fadeIn");
                                        }, 500);
                                        e.target.className =
                                          "bi bi-cloud-upload animate__animated animate__fadeOut";
                                        setTimeout(() => {
                                          e.target.className =
                                            "bi bi-pencil-square animate__animated animate__fadeIn";
                                          setCelularDisabled(!celularDisabled);
                                          setCelularValid();
                                        }, 500);
                                      } catch (error) {
                                        console.log(error);
                                        if (
                                          error.response.data.msg ===
                                          "Sua sessão expirou, realize novo login."
                                        ) {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                          setLoggedUser(null);
                                          localStorage.clear();
                                          navigate("/");
                                        } else {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                    }
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ))}
                        </FloatingLabel>
                      </Form.Group>
                    </Container>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
            <Row className="mx-0 mb-3" style={{}}>
              <Accordion
                // defaultActiveKey="0"
                className="d-flex flex-column p-0"
                style={{
                  animation: "fadein 1.5s",
                  backgroundColor: "transparent",
                  borderWidth: 0,
                }}
              >
                <Accordion.Item
                  eventKey="0"
                  style={{
                    // boxShadow:
                    //   "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                    animation: "fadein 1.5s",

                    borderWidth: 0,
                  }}
                >
                  <Accordion.Header
                    className="profileAcordionHeader"
                    style={{
                      borderBottomColor: "var(--bs-accordion-border-color)",
                      borderBottomStyle: "solid",
                      borderBottomWidth: 1,
                    }}
                  >
                    Endereço
                  </Accordion.Header>

                  <Accordion.Body
                    className="acordionBody pb-0"
                    style={{
                      backgroundColor: "var(--bs-body-bg)",
                      color: "var(--bs-body-color)",
                    }}
                  >
                    <Container>
                      <Form.Group className="mb-3" style={{ marginLeft: -15 }}>
                        <FloatingLabel
                          label="CEP"
                          className="mb-3 labelCriarConta disabledSemEstilo"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            required
                            type="text"
                            placeholder=""
                            name="cep"
                            maxLength={9}
                            value={
                              form.endereco &&
                              form.endereco.cep &&
                              formatCep(form.endereco.cep)
                            }
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            onChange={handleChange}
                            disabled={cepDisabled}
                            isValid={cepValid}
                            isInvalid={cepValid === false}
                          />
                          <Form.Control.Feedback type="invalid">
                            {cepInvalidMsg}
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="valid">
                            CEP válido.
                          </Form.Control.Feedback>
                          <div ref={cepSpinnerRef} style={{ display: "none" }}>
                            <SpinnerDotted
                              size={15}
                              thickness={200}
                              speed={141}
                              color="#36ad47"
                              style={{
                                position: "absolute",
                                top: 20,
                                right: -18,
                              }}
                            />
                          </div>
                          {cepSpinnerRef.current &&
                            cepSpinnerRef.current.style.display === "none" &&
                            (cepDisabled ? (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Alterar CEP
                                  </Tooltip>
                                }
                              >
                                <i
                                  className={`bi bi-pencil-square animate__animated animate__fadeIn`}
                                  onAnimationEnd={() => setAnimationClass("")}
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.target.className =
                                      "bi bi-pencil-square animate__animated animate__fadeOut";
                                    setTimeout(() => {
                                      setCepDisabled(!cepDisabled);
                                      e.target.className =
                                        "bi bi-pencil-square animate__animated animate__fadeIn";
                                    }, 500);
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Salvar CEP
                                  </Tooltip>
                                }
                              >
                                <i
                                  className="bi bi-cloud-upload animate__animated animate__fadeIn"
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={async (e) => {
                                    if (
                                      form.endereco.cep ===
                                        loggedUser.userData.endereco.cep ||
                                      cepValid === false
                                    ) {
                                      setForm({
                                        ...form,
                                        endereco: {
                                          ...form.endereco,
                                          cep: loggedUser.userData.endereco.cep,
                                        },
                                      });
                                      e.target.className =
                                        "bi bi-cloud-upload animate__animated animate__fadeOut";
                                      setTimeout(() => {
                                        e.target.className =
                                          "bi bi-pencil-square animate__animated animate__fadeIn";
                                        setCepDisabled(!cepDisabled);
                                        setCepValid();
                                      }, 500);
                                      return;
                                    } else {
                                      setAnimationClass("animate__fadeOut");
                                      cepSpinnerRef.current.style.display =
                                        "block";
                                      const res = await fetch(
                                        `https://viacep.com.br/ws/${form.endereco.cep}/json/`,
                                        {
                                          method: "GET",
                                        }
                                      );
                                      const data = await res.json();
                                      if (data.logradouro) {
                                        try {
                                          const res = await api.put(
                                            "/usuario/edit",
                                            {
                                              endereco: {
                                                ...form.endereco,
                                                logradouro: data.logradouro
                                                  ? data.logradouro
                                                  : "",
                                                bairro: data.bairro
                                                  ? data.bairro
                                                  : "",
                                                cidade: data.localidade
                                                  ? data.localidade
                                                  : "",
                                                estado: data.estado
                                                  ? data.estado
                                                  : "",
                                              },
                                            }
                                          );
                                          cepSpinnerRef.current.style.display =
                                            "none";
                                          setTimeout(() => {
                                            setLoggedUser({
                                              ...loggedUser,
                                              userData: {
                                                ...loggedUser.userData,
                                                endereco: {
                                                  ...form.endereco,
                                                  logradouro: data.logradouro
                                                    ? data.logradouro
                                                    : "",
                                                  bairro: data.bairro
                                                    ? data.bairro
                                                    : "",
                                                  cidade: data.localidade
                                                    ? data.localidade
                                                    : "",
                                                  estado: data.estado
                                                    ? data.estado
                                                    : "",
                                                },
                                              },
                                            });

                                            setAnimationClass(
                                              "animate__fadeIn"
                                            );
                                          }, 500);

                                          e.target.className =
                                            "bi bi-cloud-upload animate__animated animate__fadeOut";
                                          setTimeout(() => {
                                            e.target.className =
                                              "bi bi-pencil-square animate__animated animate__fadeIn";
                                            setCepDisabled(!cepDisabled);
                                            setCepValid();
                                          }, 500);
                                        } catch (error) {
                                          console.log(error);
                                          if (
                                            error.response.data.msg ===
                                            "Sua sessão expirou, realize novo login."
                                          ) {
                                            toast.error(
                                              (t) => (
                                                <CustomToast
                                                  t={t}
                                                  message={
                                                    error.response.data.msg
                                                  }
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
                                            setLoggedUser(null);
                                            localStorage.clear();
                                            navigate("/");
                                          } else {
                                            toast.error(
                                              (t) => (
                                                <CustomToast
                                                  t={t}
                                                  message={
                                                    error.response.data.msg
                                                  }
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

                                        setForm({
                                          ...form,
                                          endereco: {
                                            ...form.endereco,
                                            logradouro: data.logradouro
                                              ? data.logradouro
                                              : "",
                                            bairro: data.bairro
                                              ? data.bairro
                                              : "",
                                            cidade: data.localidade
                                              ? data.localidade
                                              : "",
                                            estado: data.estado
                                              ? data.estado
                                              : "",
                                          },
                                        });
                                        setCepEncontrado(true);
                                        setBairroDisabled(true);
                                        setLogradouroDisabled(true);
                                        setCidadeDisabled(true);
                                        setEstadoDisabled(true);

                                        // setTimeout(() => {
                                        //   setLoggedUser({
                                        //     ...loggedUser,
                                        //     userData: {
                                        //       ...loggedUser.userData,
                                        //       endereco: {
                                        //         ...form.endereco,
                                        //         logradouro: data.logradouro
                                        //           ? data.logradouro
                                        //           : "",
                                        //         bairro: data.bairro
                                        //           ? data.bairro
                                        //           : "",
                                        //         cidade: data.localidade
                                        //           ? data.localidade
                                        //           : "",
                                        //         estado: data.estado
                                        //           ? data.estado
                                        //           : "",
                                        //       },
                                        //     },
                                        //   });
                                        //   setAnimationClass("animate__fadeIn");
                                        // }, 500);
                                      } else {
                                        setCepEncontrado(false);

                                        try {
                                          const res = await api.put(
                                            "/usuario/edit",
                                            {
                                              endereco: {
                                                ...form.endereco,
                                                logradouro: "",
                                                bairro: "",
                                                cidade: "",
                                                estado: "",
                                              },
                                            }
                                          );
                                          cepSpinnerRef.current.style.display =
                                            "none";
                                          setTimeout(() => {
                                            setLoggedUser({
                                              ...loggedUser,
                                              userData: {
                                                ...loggedUser.userData,
                                                endereco: {
                                                  cep: form.endereco.cep,
                                                  numero: form.endereco.numero,
                                                  complemento:
                                                    form.endereco.complemento,
                                                  logradouro: "",
                                                  bairro: "",
                                                  cidade: "",
                                                  estado: "",
                                                },
                                              },
                                            });
                                            formMirrorRef.current = {
                                              nome: false,
                                              cpf: false,
                                              email: false,
                                              celular: false,
                                              endereco: {
                                                logradouro: false,
                                                complemento: false,
                                                numero: false,
                                                bairro: false,
                                                cidade: false,
                                                estado: false,
                                                cep: true,
                                              },
                                            };
                                            setAnimationClass(
                                              "animate__fadeIn"
                                            );
                                          }, 500);

                                          e.target.className =
                                            "bi bi-cloud-upload animate__animated animate__fadeOut";
                                          setTimeout(() => {
                                            e.target.className =
                                              "bi bi-pencil-square animate__animated animate__fadeIn";
                                            setCepDisabled(!cepDisabled);
                                            setCepValid();
                                          }, 500);
                                        } catch (error) {
                                          console.log(error);
                                          if (
                                            error.response.data.msg ===
                                            "Sua sessão expirou, realize novo login."
                                          ) {
                                            toast.error(
                                              (t) => (
                                                <CustomToast
                                                  t={t}
                                                  message={
                                                    error.response.data.msg
                                                  }
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
                                            setLoggedUser(null);
                                            localStorage.clear();
                                            navigate("/");
                                          } else {
                                            toast.error(
                                              (t) => (
                                                <CustomToast
                                                  t={t}
                                                  message={
                                                    error.response.data.msg
                                                  }
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

                                        setForm({
                                          ...form,
                                          endereco: {
                                            ...form.endereco,
                                            logradouro: "",
                                            bairro: "",
                                            cidade: "",
                                            estado: "",
                                          },
                                        });
                                        // setTimeout(() => {
                                        //   setLoggedUser({
                                        //     ...loggedUser,
                                        //     userData: {
                                        //       ...loggedUser.userData,
                                        //       endereco: {
                                        //         cep: form.endereco.cep,
                                        //         numero: form.endereco.numero,
                                        //         complemento:
                                        //           form.endereco.complemento,
                                        //         logradouro: "",
                                        //         bairro: "",
                                        //         cidade: "",
                                        //         estado: "",
                                        //       },
                                        //     },
                                        //   });
                                        //   setAnimationClass("animate__fadeIn");
                                        // }, 500);
                                      }
                                      setCepValid();
                                      setBairroValid();
                                      setLogradouroValid();
                                      setCidadeValid();
                                      setEstadoValid();
                                    }
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ))}
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group className="mb-3" style={{ marginLeft: -15 }}>
                        <FloatingLabel
                          label="Logradouro"
                          className="mb-3 labelCriarConta disabledSemEstilo"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            required
                            type="text"
                            placeholder=""
                            name="logradouro"
                            value={
                              form.endereco &&
                              form.endereco.logradouro &&
                              form.endereco.logradouro
                            }
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            onChange={handleChange}
                            disabled={logradouroDisabled}
                            isValid={logradouroValid}
                            isInvalid={logradouroValid === false}
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            {logradouroInvalidMsg}
                          </Form.Control.Feedback> */}
                          <div
                            ref={logradouroSpinnerRef}
                            style={{ display: "none" }}
                          >
                            <SpinnerDotted
                              size={15}
                              thickness={200}
                              speed={141}
                              color="#36ad47"
                              style={{
                                position: "absolute",
                                top: 20,
                                right: -18,
                              }}
                            />
                          </div>
                          {!cepEncontrado &&
                            logradouroSpinnerRef.current &&
                            logradouroSpinnerRef.current.style.display ===
                              "none" &&
                            (logradouroDisabled ? (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Alterar logr.
                                  </Tooltip>
                                }
                              >
                                <i
                                  className={`bi bi-pencil-square animate__animated animate__fadeIn`}
                                  onAnimationEnd={() => setAnimationClass("")}
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.target.className =
                                      "bi bi-pencil-square animate__animated animate__fadeOut";
                                    setTimeout(() => {
                                      setLogradouroDisabled(
                                        !logradouroDisabled
                                      );
                                      e.target.className =
                                        "bi bi-pencil-square animate__animated animate__fadeIn";
                                    }, 500);
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Salvar logr.
                                  </Tooltip>
                                }
                              >
                                <i
                                  className="bi bi-cloud-upload animate__animated animate__fadeIn"
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={async (e) => {
                                    if (
                                      form.endereco.logradouro ===
                                        loggedUser.userData.endereco
                                          .logradouro ||
                                      logradouroValid === false
                                    ) {
                                      setForm({
                                        ...form,
                                        endereco: loggedUser.userData.endereco,
                                      });
                                      e.target.className =
                                        "bi bi-cloud-upload animate__animated animate__fadeOut";
                                      setTimeout(() => {
                                        e.target.className =
                                          "bi bi-pencil-square animate__animated animate__fadeIn";
                                        setLogradouroDisabled(
                                          !logradouroDisabled
                                        );
                                        setLogradouroValid();
                                      }, 500);
                                      return;
                                    } else {
                                      setAnimationClass("animate__fadeOut");

                                      logradouroSpinnerRef.current.style.display =
                                        "block";
                                      try {
                                        const res = await api.put(
                                          "/usuario/edit",
                                          {
                                            endereco: {
                                              ...loggedUser.userData.endereco,
                                              logradouro:
                                                form.endereco.logradouro,
                                            },
                                          }
                                        );
                                        logradouroSpinnerRef.current.style.display =
                                          "none";
                                        setTimeout(() => {
                                          setLoggedUser({
                                            ...loggedUser,
                                            userData: {
                                              ...loggedUser.userData,
                                              endereco: {
                                                ...loggedUser.userData.endereco,
                                                logradouro:
                                                  form.endereco.logradouro,
                                              },
                                            },
                                          });
                                          formMirrorRef.current = {
                                            nome: false,
                                            cpf: false,
                                            email: false,
                                            celular: false,
                                            endereco: {
                                              logradouro: true,
                                              complemento: false,
                                              numero: false,
                                              bairro: false,
                                              cidade: false,
                                              estado: false,
                                              cep: false,
                                            },
                                          };
                                          setAnimationClass("animate__fadeIn");
                                        }, 500);

                                        e.target.className =
                                          "bi bi-cloud-upload animate__animated animate__fadeOut";
                                        setTimeout(() => {
                                          e.target.className =
                                            "bi bi-pencil-square animate__animated animate__fadeIn";
                                          setLogradouroDisabled(
                                            !logradouroDisabled
                                          );
                                          setLogradouroValid();
                                        }, 500);
                                      } catch (error) {
                                        console.log(error);
                                        if (
                                          error.response.data.msg ===
                                          "Sua sessão expirou, realize novo login."
                                        ) {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                          setLoggedUser(null);
                                          localStorage.clear();
                                          navigate("/");
                                        } else {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                    }
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ))}
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group className="mb-3" style={{ marginLeft: -15 }}>
                        <FloatingLabel
                          label="Número"
                          className="mb-3 labelCriarConta disabledSemEstilo"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            required
                            type="number"
                            placeholder=""
                            name="numero"
                            maxLength={14}
                            value={
                              form.endereco &&
                              form.endereco.numero &&
                              form.endereco.numero
                            }
                            onChange={handleChange}
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            disabled={numeroDisabled}
                            isValid={numeroValid}
                            isInvalid={numeroValid === false}
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            {celularInvalidMsg}
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="valid">
                            E-mail válido.
                          </Form.Control.Feedback> */}
                          <div
                            ref={numeroSpinnerRef}
                            style={{ display: "none" }}
                          >
                            <SpinnerDotted
                              size={15}
                              thickness={200}
                              speed={141}
                              color="#36ad47"
                              style={{
                                position: "absolute",
                                top: 20,
                                right: -18,
                              }}
                            />
                          </div>
                          {numeroSpinnerRef.current &&
                            numeroSpinnerRef.current.style.display === "none" &&
                            (numeroDisabled ? (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Alterar Nº
                                  </Tooltip>
                                }
                              >
                                <i
                                  className={`bi bi-pencil-square animate__animated animate__fadeIn`}
                                  onAnimationEnd={() => setAnimationClass("")}
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.target.className =
                                      "bi bi-pencil-square animate__animated animate__fadeOut";
                                    setTimeout(() => {
                                      setNumeroDisabled(!numeroDisabled);
                                      e.target.className =
                                        "bi bi-pencil-square animate__animated animate__fadeIn";
                                    }, 500);
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Salvar Nº
                                  </Tooltip>
                                }
                              >
                                <i
                                  className="bi bi-cloud-upload animate__animated animate__fadeIn"
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={async (e) => {
                                    if (
                                      form.endereco.numero ===
                                        loggedUser.userData.endereco.numero ||
                                      numeroValid === false
                                    ) {
                                      setForm({
                                        ...form,
                                        endereco: {
                                          ...form.endereco,
                                          numero:
                                            loggedUser.userData.endereco.numero,
                                        },
                                      });
                                      e.target.className =
                                        "bi bi-cloud-upload animate__animated animate__fadeOut";
                                      setTimeout(() => {
                                        e.target.className =
                                          "bi bi-pencil-square animate__animated animate__fadeIn";
                                        setNumeroDisabled(!numeroDisabled);
                                        setNumeroValid();
                                      }, 500);
                                      return;
                                    } else {
                                      setAnimationClass("animate__fadeOut");

                                      numeroSpinnerRef.current.style.display =
                                        "block";
                                      try {
                                        const res = await api.put(
                                          "/usuario/edit",
                                          {
                                            endereco: {
                                              ...loggedUser.userData.endereco,
                                              numero: form.endereco.numero,
                                            },
                                          }
                                        );
                                        numeroSpinnerRef.current.style.display =
                                          "none";
                                        setTimeout(() => {
                                          setLoggedUser({
                                            ...loggedUser,
                                            userData: {
                                              ...loggedUser.userData,
                                              endereco: {
                                                ...loggedUser.userData.endereco,
                                                numero: form.endereco.numero,
                                              },
                                            },
                                          });
                                          formMirrorRef.current = {
                                            nome: false,
                                            cpf: false,
                                            email: false,
                                            celular: false,
                                            endereco: {
                                              logradouro: false,
                                              complemento: false,
                                              numero: true,
                                              bairro: false,
                                              cidade: false,
                                              estado: false,
                                              cep: false,
                                            },
                                          };
                                          setAnimationClass("animate__fadeIn");
                                        }, 500);

                                        e.target.className =
                                          "bi bi-cloud-upload animate__animated animate__fadeOut";
                                        setTimeout(() => {
                                          e.target.className =
                                            "bi bi-pencil-square animate__animated animate__fadeIn";
                                          setNumeroDisabled(!numeroDisabled);
                                          setNumeroValid();
                                        }, 500);
                                      } catch (error) {
                                        console.log(error);
                                        if (
                                          error.response.data.msg ===
                                          "Sua sessão expirou, realize novo login."
                                        ) {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                          setLoggedUser(null);
                                          localStorage.clear();
                                          navigate("/");
                                        } else {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                    }
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ))}
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group className="mb-3" style={{ marginLeft: -15 }}>
                        <FloatingLabel
                          label="Complemento"
                          className="mb-3 labelCriarConta disabledSemEstilo"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            required
                            type="text"
                            placeholder=""
                            name="complemento"
                            value={
                              form.endereco &&
                              form.endereco.complemento &&
                              form.endereco.complemento
                            }
                            onChange={handleChange}
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            disabled={complementoDisabled}
                            isValid={complementoValid}
                            isInvalid={complementoValid === false}
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            {celularInvalidMsg}
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="valid">
                            E-mail válido.
                          </Form.Control.Feedback> */}
                          <div
                            ref={complementoSpinnerRef}
                            style={{ display: "none" }}
                          >
                            <SpinnerDotted
                              size={15}
                              thickness={200}
                              speed={141}
                              color="#36ad47"
                              style={{
                                position: "absolute",
                                top: 20,
                                right: -18,
                              }}
                            />
                          </div>
                          {complementoSpinnerRef.current &&
                            complementoSpinnerRef.current.style.display ===
                              "none" &&
                            (complementoDisabled ? (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Alterar compl.
                                  </Tooltip>
                                }
                              >
                                <i
                                  className={`bi bi-pencil-square animate__animated animate__fadeIn`}
                                  onAnimationEnd={() => setAnimationClass("")}
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.target.className =
                                      "bi bi-pencil-square animate__animated animate__fadeOut";
                                    setTimeout(() => {
                                      setComplementoDisabled(
                                        !complementoDisabled
                                      );
                                      e.target.className =
                                        "bi bi-pencil-square animate__animated animate__fadeIn";
                                    }, 500);
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Salvar compl.
                                  </Tooltip>
                                }
                              >
                                <i
                                  className="bi bi-cloud-upload animate__animated animate__fadeIn"
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={async (e) => {
                                    if (
                                      form.endereco.complemento ===
                                        loggedUser.userData.endereco
                                          .complemento ||
                                      complementoValid === false
                                    ) {
                                      setForm({
                                        ...form,
                                        endereco: {
                                          ...form.endereco,
                                          complemento:
                                            loggedUser.userData.endereco
                                              .complemento,
                                        },
                                      });
                                      e.target.className =
                                        "bi bi-cloud-upload animate__animated animate__fadeOut";
                                      setTimeout(() => {
                                        e.target.className =
                                          "bi bi-pencil-square animate__animated animate__fadeIn";
                                        setComplementoDisabled(
                                          !complementoDisabled
                                        );
                                        setComplementoValid();
                                      }, 500);
                                      return;
                                    } else {
                                      setAnimationClass("animate__fadeOut");

                                      complementoSpinnerRef.current.style.display =
                                        "block";
                                      try {
                                        const res = await api.put(
                                          "/usuario/edit",
                                          {
                                            endereco: {
                                              ...loggedUser.userData.endereco,
                                              complemento:
                                                form.endereco.complemento,
                                            },
                                          }
                                        );
                                        complementoSpinnerRef.current.style.display =
                                          "none";
                                        setTimeout(() => {
                                          setLoggedUser({
                                            ...loggedUser,
                                            userData: {
                                              ...loggedUser.userData,
                                              endereco: {
                                                ...loggedUser.userData.endereco,
                                                complemento:
                                                  form.endereco.complemento,
                                              },
                                            },
                                          });
                                          formMirrorRef.current = {
                                            nome: false,
                                            cpf: false,
                                            email: false,
                                            celular: false,
                                            endereco: {
                                              logradouro: false,
                                              complemento: true,
                                              numero: false,
                                              bairro: false,
                                              cidade: false,
                                              estado: false,
                                              cep: false,
                                            },
                                          };
                                          setAnimationClass("animate__fadeIn");
                                        }, 500);

                                        e.target.className =
                                          "bi bi-cloud-upload animate__animated animate__fadeOut";
                                        setTimeout(() => {
                                          e.target.className =
                                            "bi bi-pencil-square animate__animated animate__fadeIn";
                                          setComplementoDisabled(
                                            !complementoDisabled
                                          );
                                          setComplementoValid();
                                        }, 500);
                                      } catch (error) {
                                        console.log(error);
                                        if (
                                          error.response.data.msg ===
                                          "Sua sessão expirou, realize novo login."
                                        ) {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                          setLoggedUser(null);
                                          localStorage.clear();
                                          navigate("/");
                                        } else {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                    }
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ))}
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group className="mb-3" style={{ marginLeft: -15 }}>
                        <FloatingLabel
                          label="Bairro"
                          className="mb-3 labelCriarConta disabledSemEstilo"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            required
                            type="text"
                            placeholder=""
                            name="bairro"
                            value={
                              form.endereco &&
                              form.endereco.bairro &&
                              form.endereco.bairro
                            }
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            onChange={handleChange}
                            disabled={bairroDisabled}
                            isValid={bairroValid}
                            isInvalid={bairroValid === false}
                          />
                          <Form.Control.Feedback type="invalid">
                            {bairroInvalidMsg}
                          </Form.Control.Feedback>
                          <div
                            ref={bairroSpinnerRef}
                            style={{ display: "none" }}
                          >
                            <SpinnerDotted
                              size={15}
                              thickness={200}
                              speed={141}
                              color="#36ad47"
                              style={{
                                position: "absolute",
                                top: 20,
                                right: -18,
                              }}
                            />
                          </div>
                          {!cepEncontrado &&
                            bairroSpinnerRef.current &&
                            bairroSpinnerRef.current.style.display === "none" &&
                            (bairroDisabled ? (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Alterar Bairro
                                  </Tooltip>
                                }
                              >
                                <i
                                  className={`bi bi-pencil-square animate__animated animate__fadeIn`}
                                  onAnimationEnd={() => setAnimationClass("")}
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.target.className =
                                      "bi bi-pencil-square animate__animated animate__fadeOut";
                                    setTimeout(() => {
                                      setBairroDisabled(!bairroDisabled);
                                      e.target.className =
                                        "bi bi-pencil-square animate__animated animate__fadeIn";
                                    }, 500);
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Salvar Bairro
                                  </Tooltip>
                                }
                              >
                                <i
                                  className="bi bi-cloud-upload animate__animated animate__fadeIn"
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={async (e) => {
                                    if (
                                      form.endereco.bairro ===
                                        loggedUser.userData.endereco.bairro ||
                                      bairroValid === false
                                    ) {
                                      setForm({
                                        ...form,
                                        endereco: loggedUser.userData.endereco,
                                      });
                                      e.target.className =
                                        "bi bi-cloud-upload animate__animated animate__fadeOut";
                                      setTimeout(() => {
                                        e.target.className =
                                          "bi bi-pencil-square animate__animated animate__fadeIn";
                                        setBairroDisabled(!bairroDisabled);
                                        setBairroValid();
                                      }, 500);
                                      return;
                                    } else {
                                      setAnimationClass("animate__fadeOut");

                                      bairroSpinnerRef.current.style.display =
                                        "block";
                                      try {
                                        const res = await api.put(
                                          "/usuario/edit",
                                          {
                                            endereco: {
                                              ...loggedUser.userData.endereco,
                                              bairro: form.endereco.bairro,
                                            },
                                          }
                                        );
                                        bairroSpinnerRef.current.style.display =
                                          "none";
                                        setTimeout(() => {
                                          setLoggedUser({
                                            ...loggedUser,
                                            userData: {
                                              ...loggedUser.userData,
                                              endereco: {
                                                ...loggedUser.userData.endereco,
                                                bairro: form.endereco.bairro,
                                              },
                                            },
                                          });
                                          formMirrorRef.current = {
                                            nome: false,
                                            cpf: false,
                                            email: false,
                                            celular: false,
                                            endereco: {
                                              logradouro: false,
                                              complemento: false,
                                              numero: false,
                                              cidade: false,
                                              estado: false,
                                              bairro: true,
                                              cep: false,
                                            },
                                          };
                                          setAnimationClass("animate__fadeIn");
                                        }, 500);

                                        e.target.className =
                                          "bi bi-cloud-upload animate__animated animate__fadeOut";
                                        setTimeout(() => {
                                          e.target.className =
                                            "bi bi-pencil-square animate__animated animate__fadeIn";
                                          setBairroDisabled(!bairroDisabled);
                                          setBairroValid();
                                        }, 500);
                                      } catch (error) {
                                        console.log(error);
                                        if (
                                          error.response.data.msg ===
                                          "Sua sessão expirou, realize novo login."
                                        ) {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                          setLoggedUser(null);
                                          localStorage.clear();
                                          navigate("/");
                                        } else {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                    }
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ))}
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group className="mb-3" style={{ marginLeft: -15 }}>
                        <FloatingLabel
                          label="Cidade"
                          className="mb-3 labelCriarConta disabledSemEstilo"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            required
                            type="text"
                            placeholder=""
                            name="cidade"
                            value={
                              form.endereco &&
                              form.endereco.cidade &&
                              form.endereco.cidade
                            }
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            onChange={handleChange}
                            disabled={cidadeDisabled}
                            isValid={cidadeValid}
                            isInvalid={cidadeValid === false}
                          />
                          <Form.Control.Feedback type="invalid">
                            {cidadeInvalidMsg}
                          </Form.Control.Feedback>
                          <div
                            ref={cidadeSpinnerRef}
                            style={{ display: "none" }}
                          >
                            <SpinnerDotted
                              size={15}
                              thickness={200}
                              speed={141}
                              color="#36ad47"
                              style={{
                                position: "absolute",
                                top: 20,
                                right: -18,
                              }}
                            />
                          </div>
                          {!cepEncontrado &&
                            cidadeSpinnerRef.current &&
                            cidadeSpinnerRef.current.style.display === "none" &&
                            (cidadeDisabled ? (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Alterar Cidade
                                  </Tooltip>
                                }
                              >
                                <i
                                  className={`bi bi-pencil-square animate__animated animate__fadeIn`}
                                  onAnimationEnd={() => setAnimationClass("")}
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.target.className =
                                      "bi bi-pencil-square animate__animated animate__fadeOut";
                                    setTimeout(() => {
                                      setCidadeDisabled(!cidadeDisabled);
                                      e.target.className =
                                        "bi bi-pencil-square animate__animated animate__fadeIn";
                                    }, 500);
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Salvar Cidade
                                  </Tooltip>
                                }
                              >
                                <i
                                  className="bi bi-cloud-upload animate__animated animate__fadeIn"
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={async (e) => {
                                    if (
                                      form.endereco.cidade ===
                                        loggedUser.userData.endereco.cidade ||
                                      cidadeValid === false
                                    ) {
                                      setForm({
                                        ...form,
                                        endereco: loggedUser.userData.endereco,
                                      });
                                      e.target.className =
                                        "bi bi-cloud-upload animate__animated animate__fadeOut";
                                      setTimeout(() => {
                                        e.target.className =
                                          "bi bi-pencil-square animate__animated animate__fadeIn";
                                        setCidadeDisabled(!cidadeDisabled);
                                        setCidadeValid();
                                      }, 500);
                                      return;
                                    } else {
                                      setAnimationClass("animate__fadeOut");

                                      cidadeSpinnerRef.current.style.display =
                                        "block";
                                      try {
                                        const res = await api.put(
                                          "/usuario/edit",
                                          {
                                            endereco: {
                                              ...loggedUser.userData.endereco,
                                              cidade: form.endereco.cidade,
                                            },
                                          }
                                        );
                                        cidadeSpinnerRef.current.style.display =
                                          "none";
                                        setTimeout(() => {
                                          setLoggedUser({
                                            ...loggedUser,
                                            userData: {
                                              ...loggedUser.userData,
                                              endereco: {
                                                ...loggedUser.userData.endereco,
                                                cidade: form.endereco.cidade,
                                              },
                                            },
                                          });
                                          formMirrorRef.current = {
                                            nome: false,
                                            cpf: false,
                                            email: false,
                                            celular: false,
                                            endereco: {
                                              logradouro: false,
                                              complemento: false,
                                              numero: false,
                                              cidade: true,
                                              estado: false,
                                              bairro: false,
                                              cep: false,
                                            },
                                          };
                                          setAnimationClass("animate__fadeIn");
                                        }, 500);

                                        e.target.className =
                                          "bi bi-cloud-upload animate__animated animate__fadeOut";
                                        setTimeout(() => {
                                          e.target.className =
                                            "bi bi-pencil-square animate__animated animate__fadeIn";
                                          setCidadeDisabled(!cidadeDisabled);
                                          setCidadeValid();
                                        }, 500);
                                      } catch (error) {
                                        console.log(error);
                                        if (
                                          error.response.data.msg ===
                                          "Sua sessão expirou, realize novo login."
                                        ) {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                          setLoggedUser(null);
                                          localStorage.clear();
                                          navigate("/");
                                        } else {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                    }
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ))}
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group className="mb-3" style={{ marginLeft: -15 }}>
                        <FloatingLabel
                          label="Estado"
                          className="mb-3 labelCriarConta disabledSemEstilo"
                          style={{ fontSize: 12 }}
                        >
                          <Form.Control
                            required
                            type="text"
                            placeholder=""
                            name="estado"
                            value={
                              form.endereco &&
                              form.endereco.estado &&
                              form.endereco.estado
                            }
                            style={{
                              height: 30,
                              fontSize: 13,
                              minHeight: 35,
                            }}
                            onChange={handleChange}
                            disabled={estadoDisabled}
                            isValid={estadoValid}
                            isInvalid={estadoValid === false}
                          />
                          <Form.Control.Feedback type="invalid">
                            {estadoInvalidMsg}
                          </Form.Control.Feedback>
                          <div
                            ref={estadoSpinnerRef}
                            style={{ display: "none" }}
                          >
                            <SpinnerDotted
                              size={15}
                              thickness={200}
                              speed={141}
                              color="#36ad47"
                              style={{
                                position: "absolute",
                                top: 20,
                                right: -18,
                              }}
                            />
                          </div>
                          {!cepEncontrado &&
                            estadoSpinnerRef.current &&
                            estadoSpinnerRef.current.style.display === "none" &&
                            (estadoDisabled ? (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Alterar Estado
                                  </Tooltip>
                                }
                              >
                                <i
                                  className={`bi bi-pencil-square animate__animated animate__fadeIn`}
                                  onAnimationEnd={() => setAnimationClass("")}
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.target.className =
                                      "bi bi-pencil-square animate__animated animate__fadeOut";
                                    setTimeout(() => {
                                      setEstadoDisabled(!estadoDisabled);
                                      e.target.className =
                                        "bi bi-pencil-square animate__animated animate__fadeIn";
                                    }, 500);
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ) : (
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                  <Tooltip
                                    style={{
                                      position: "absolute",
                                      fontSize: 8,
                                    }}
                                  >
                                    Salvar Estado
                                  </Tooltip>
                                }
                              >
                                <i
                                  className="bi bi-cloud-upload animate__animated animate__fadeIn"
                                  style={{
                                    position: "absolute",
                                    top: 20,
                                    right: -15,
                                    fontSize: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={async (e) => {
                                    e.target.className =
                                      "bi bi-cloud-upload animate__animated animate__fadeOut";
                                    setTimeout(() => {
                                      e.target.className =
                                        "bi bi-pencil-square animate__animated animate__fadeIn";
                                      setEstadoDisabled(!estadoDisabled);
                                      setEstadoValid();
                                    }, 500);
                                    if (
                                      form.endereco.estado ===
                                        loggedUser.userData.endereco.estado ||
                                      estadoValid === false
                                    ) {
                                      setForm({
                                        ...form,
                                        endereco: loggedUser.userData.endereco,
                                      });
                                      e.target.className =
                                        "bi bi-cloud-upload animate__animated animate__fadeOut";
                                      setTimeout(() => {
                                        e.target.className =
                                          "bi bi-pencil-square animate__animated animate__fadeIn";
                                        setEstadoDisabled(!estadoDisabled);
                                        setEstadoValid();
                                      }, 500);
                                      return;
                                    } else {
                                      setAnimationClass("animate__fadeOut");

                                      estadoSpinnerRef.current.style.display =
                                        "block";
                                      try {
                                        const res = await api.put(
                                          "/usuario/edit",
                                          {
                                            endereco: {
                                              ...loggedUser.userData.endereco,
                                              estado: form.endereco.estado,
                                            },
                                          }
                                        );
                                        estadoSpinnerRef.current.style.display =
                                          "none";
                                        setTimeout(() => {
                                          setLoggedUser({
                                            ...loggedUser,
                                            userData: {
                                              ...loggedUser.userData,
                                              endereco: {
                                                ...loggedUser.userData.endereco,
                                                estado: form.endereco.estado,
                                              },
                                            },
                                          });
                                          formMirrorRef.current = {
                                            nome: false,
                                            cpf: false,
                                            email: false,
                                            celular: false,
                                            endereco: {
                                              logradouro: false,
                                              complemento: false,
                                              numero: false,
                                              cidade: false,
                                              estado: true,
                                              bairro: false,
                                              cep: false,
                                            },
                                          };
                                          setAnimationClass("animate__fadeIn");
                                        }, 500);

                                        e.target.className =
                                          "bi bi-cloud-upload animate__animated animate__fadeOut";
                                        setTimeout(() => {
                                          e.target.className =
                                            "bi bi-pencil-square animate__animated animate__fadeIn";
                                          setEstadoDisabled(!estadoDisabled);
                                          setEstadoValid();
                                        }, 500);
                                      } catch (error) {
                                        console.log(error);
                                        if (
                                          error.response.data.msg ===
                                          "Sua sessão expirou, realize novo login."
                                        ) {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                          setLoggedUser(null);
                                          localStorage.clear();
                                          navigate("/");
                                        } else {
                                          toast.error(
                                            (t) => (
                                              <CustomToast
                                                t={t}
                                                message={
                                                  error.response.data.msg
                                                }
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
                                    }
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ))}
                        </FloatingLabel>
                      </Form.Group>
                    </Container>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
          </Card.Body>
          <Card.Footer></Card.Footer>
        </Card>
      </Row>
    </>
  );
};

export default ProfilePage;
