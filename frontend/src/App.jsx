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
import Home from "./pages/Home";
import Activate from "./pages/Activate";
import Rescue from "./pages/Rescue";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";
import NavBar from "./components/NavBar/NavBar";

function App() {
  return (
    <div className="App">
      <Toaster />
      <AuthContextComponent>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
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
            element={<ProtectedRoute Component={Home} />}
          ></Route>
          <Route path="/pagamento" element={<Pagamento />} />
        </Routes>
      </AuthContextComponent>
    </div>
  );
}

export default App;
