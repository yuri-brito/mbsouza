import { Toaster } from "react-hot-toast";
import { AuthContextComponent } from "./contexts/authContext";
import { Routes, Route } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  FormCheck,
  Row,
} from "react-bootstrap";
import "./App.css";
import Pagamento from "./components/Pagamento";
import Home from "./pages/Home/Home";
import Activate from "./pages/Activate";
import Rescue from "./pages/Rescue";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";
import NavBar from "./components/NavBar/NavBar";
import SubNav from "./components/SubNav/SubNav";
import Footer from "./components/Footer/Footer";
import EmpresaPage from "./pages/Empresa/EmpresaPage";
import NossosProdutos from "./components/NossosProdutos/NossosProdutos";
import InformacoesPage from "./pages/Informacoes/InformacoesPage";
import ContatoPage from "./pages/Contato/ContatoPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

function App() {
  const [theme, setTheme] = useState("");
  return (
    <div className="App">
      <Toaster />
      <AuthContextComponent>
        <NavBar theme={theme} setTheme={setTheme} />
        <SubNav />
        <NossosProdutos theme={theme} />
        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route
            path="/Empresa"
            element={<EmpresaPage theme={theme} />}
          ></Route>
          <Route
            path="/Informacoes"
            element={<InformacoesPage theme={theme} />}
          ></Route>
          <Route
            path="/Contato"
            element={<ContatoPage theme={theme} />}
          ></Route>
          <Route
            path="/activate/:activationToken/:userId"
            element={<Activate />}
          ></Route>
          <Route
            path="/rescue/:activationToken/:userId"
            element={<Rescue />}
          ></Route>
          <Route
            path="/ProfilePage"
            element={<ProtectedRoute Component={ProfilePage} />}
          ></Route>
          <Route path="/pagamento" element={<Pagamento />} />
        </Routes>
        <Footer />
      </AuthContextComponent>
    </div>
  );
}

export default App;
