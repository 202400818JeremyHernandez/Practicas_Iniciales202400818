import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [registro, setRegistro] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        registro,
        contrasena
      });

      // 🔥 guardar token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      alert("Login correcto ✅");

      // 🔥 redirigir
      navigate("/feed");

    } catch (err) {
      console.error(err);
      alert("Credenciales incorrectas ❌");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Registro"
        onChange={e => setRegistro(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        onChange={e => setContrasena(e.target.value)}
      />

      <button onClick={login}>Ingresar</button>
    </div>
  );
}

export default Login;