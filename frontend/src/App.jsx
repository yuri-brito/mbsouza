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
import api from "./api/api";
import { useEffect } from "react";
import CategoriaPage from "./pages/Produtos/CategoriaPage";
import ProdutoPage from "./pages/Produtos/ProdutoPage";
function App() {
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

  return (
    <div className="App">
      <Toaster />
      <AuthContextComponent>
        <NavBar produtos={produtos} />
        <SubNav />
        <NossosProdutos
          produtos={produtos}
          categorias={categorias}
          subcategorias={subcategorias}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                produtos={produtos}
                categorias={categorias}
                subcategorias={subcategorias}
              />
            }
          />
          <Route path="/Empresa" element={<EmpresaPage />}></Route>
          <Route path="/Informacoes" element={<InformacoesPage />}></Route>
          <Route path="/Contato" element={<ContatoPage />}></Route>
          <Route
            path="/CategoriaPage/:id"
            element={
              <CategoriaPage
                produtos={produtos}
                subcategorias={subcategorias}
              />
            }
          ></Route>
          <Route
            path="/ProdutoPage/:id"
            element={
              <ProdutoPage produtos={produtos} subcategorias={subcategorias} />
            }
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
