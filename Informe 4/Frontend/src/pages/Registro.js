import { useState } from "react";
import API from "../api/api";

function Registro() {
  const [form, setForm] = useState({
    registro: "",
    nombres: "",
    apellidos: "",
    correo: "",
    contrasena: ""
  });

  const registrar = async () => {
    try {
      await API.post("/auth/registro", form);
      alert("Usuario registrado ✅");
    } catch (err) {
      alert("Error al registrar ❌");
    }
  };

  return (
    <div>
      <h2>Registro</h2>

      <input placeholder="Registro" onChange={e => setForm({...form, registro: e.target.value})} />
      <input placeholder="Nombres" onChange={e => setForm({...form, nombres: e.target.value})} />
      <input placeholder="Apellidos" onChange={e => setForm({...form, apellidos: e.target.value})} />
      <input placeholder="Correo" onChange={e => setForm({...form, correo: e.target.value})} />
      <input type="password" placeholder="Contraseña" onChange={e => setForm({...form, contrasena: e.target.value})} />

      <button onClick={registrar}>Registrar</button>
    </div>
  );
}

export default Registro;