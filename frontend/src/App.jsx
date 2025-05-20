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
import Admin from "./pages/Admin/Admin";

function App() {
  return (
    <div className="App">
      <Toaster />
      <AuthContextComponent>
        <NavBar />
        <SubNav />
        <NossosProdutos />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Empresa" element={<EmpresaPage />}></Route>
          <Route path="/Informacoes" element={<InformacoesPage />}></Route>
          <Route path="/Contato" element={<ContatoPage />}></Route>
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
          <Route
            path="/Admin"
            element={<ProtectedRoute Component={Admin} />}
          ></Route>
          <Route path="/pagamento" element={<Pagamento />} />
        </Routes>
        <Footer />
      </AuthContextComponent>
    </div>
  );
}

export default App;
