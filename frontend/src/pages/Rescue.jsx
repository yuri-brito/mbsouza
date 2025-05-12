import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Rescue(props) {
  const { activationToken, userId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fecthingActivate = async () => {
      navigate("/", {
        state: {
          origin: "Rescue",
          activationToken: activationToken,
          user: userId,
        },
      });
    };
    fecthingActivate();
  }, []);
  return <div></div>;
}

export default Rescue;
