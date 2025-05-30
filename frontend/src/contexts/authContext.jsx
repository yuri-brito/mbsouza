import { createContext, useEffect, useState } from "react";
const AuthContext = createContext();

function AuthContextComponent(props) {
  const [loggedUser, setLoggedUser] = useState({ token: "", userData: {} });
  const [theme, setTheme] = useState("");
  useEffect(() => {
    const storeUser = localStorage.getItem("loggedUser");
    const storedUserParse = JSON.parse(storeUser || '""');
    if (storedUserParse.token) {
      setLoggedUser(storedUserParse);
    } else {
      setLoggedUser(null);
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{ loggedUser, setLoggedUser, theme, setTheme }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
export { AuthContextComponent, AuthContext };
