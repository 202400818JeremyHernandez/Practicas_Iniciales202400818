import { useState } from "react";
import API from "../api/api";

function Login() {
  const [registro, setRegistro] = useState("");
  const [contrasena, setContrasena] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        registro,
        contrasena
      });

      localStorage.setItem("token", res.data.token);
      alert("Login correcto");
    } catch {
      alert("Error");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Registro" onChange={e => setRegistro(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={e => setContrasena(e.target.value)} />

      <button onClick={login}>Ingresar</button>
    </div>
  );
}

export default Login;