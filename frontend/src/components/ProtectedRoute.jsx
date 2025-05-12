import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

function ProtectedRoute({ Component }) {
  const { loggedUser } = useContext(AuthContext);

  if (loggedUser) {
    return <Component />;
  } else {
    return <Navigate to={"/"} state={"usuario não logado"} />;
  }
}
export default ProtectedRoute;
