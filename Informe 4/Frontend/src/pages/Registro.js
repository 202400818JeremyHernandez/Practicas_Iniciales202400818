import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Registro() {
  const [form, setForm] = useState({
    registro: "",
    nombres: "",
    apellidos: "",
    correo: "",
    contrasena: ""
  });

  const navigate = useNavigate();

  const registrar = async () => {
    try {
      await API.post("/auth/registro", form);
      alert("Usuario registrado ✅");
      navigate("/");
    } catch {
      alert("Error al registrar ❌");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: "400px", margin: "auto"}}>

        <h2 style={{textAlign: "center"}}>Registro 📝</h2>

        <input placeholder="Registro"
          onChange={e => setForm({...form, registro: e.target.value})} />

        <input placeholder="Nombres"
          onChange={e => setForm({...form, nombres: e.target.value})} />

        <input placeholder="Apellidos"
          onChange={e => setForm({...form, apellidos: e.target.value})} />

        <input placeholder="Correo"
          onChange={e => setForm({...form, correo: e.target.value})} />

        <input type="password" placeholder="Contraseña"
          onChange={e => setForm({...form, contrasena: e.target.value})} />

        <button onClick={registrar} style={{width: "100%", marginTop: "10px"}}>
          Registrar
        </button>

        <hr />

        <button
          onClick={() => navigate("/")}
          style={{width: "100%", background: "#6b7280"}}
        >
          Volver al login
        </button>

      </div>
    </div>
  );
}

export default Registro;