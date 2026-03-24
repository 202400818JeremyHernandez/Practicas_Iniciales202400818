import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Perfil from "./pages/Perfil";
import Cursos from "./pages/Cursos";


function App() {
  return (
    <BrowserRouter>
      <Routes>      
        <Route path="/" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/cursos" element={<Cursos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;