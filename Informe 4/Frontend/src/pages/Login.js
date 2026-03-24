import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Login({ setAuth }) {
  const [registro, setRegistro] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        registro,
        contrasena
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      setAuth(true);
      navigate("/feed");

    } catch {
      alert("Credenciales incorrectas ❌");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <input placeholder="Registro" onChange={e => setRegistro(e.target.value)} />
      <br /><br />

      <input type="password" placeholder="Contraseña" onChange={e => setContrasena(e.target.value)} />
      <br /><br />

      <button onClick={login}>Ingresar</button>
    </div>
  );
}

export default Login;