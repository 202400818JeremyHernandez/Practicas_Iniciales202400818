import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Perfil from "./pages/Perfil";
import Cursos from "./pages/Cursos";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  return (
    <BrowserRouter>

      {auth && <Navbar setAuth={setAuth} />}

      <Routes>
        <Route path="/" element={<Login setAuth={setAuth} />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/cursos" element={<Cursos />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;