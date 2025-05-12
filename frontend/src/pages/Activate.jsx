import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function Activate(props) {
  const { activationToken, userId } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    const fecthingActivate = async () => {
      try {
        const res = await api.get(
          `/usuario/activate-account/${activationToken}/${userId}`
        );
        if (res.status === 201) {
          navigate("/", {
            state: {
              origin: "Activate",
              status: "conta ativada",
              nome: res.data.nome,
            },
          });
        }
      } catch (error) {
        console.log(error);

        navigate("/", {
          state: {
            origin: "Activate",
            status: "Erro na ativação",
            nome: error.response.data.nome,
            msg: error.response.data.msg,
          },
        });
      }
    };
    fecthingActivate();
  }, []);
  return <div></div>;
}

export default Activate;
