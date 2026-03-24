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
      <div className="card" style={{maxWidth: "400px", margin: "auto"}}>
        
        <h2 style={{textAlign: "center"}}>Iniciar Sesión 🔐</h2>

        <input
          placeholder="Registro"
          onChange={e => setRegistro(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          onChange={e => setContrasena(e.target.value)}
        />

        <button onClick={login} style={{width: "100%", marginTop: "10px"}}>
          Ingresar
        </button>

        <hr />

        {/* 🔥 BOTÓN REGISTRO */}
        <p style={{textAlign: "center"}}>¿No tienes cuenta?</p>

        <button
          onClick={() => navigate("/registro")}
          style={{
            width: "100%",
            background: "#22c55e"
          }}
        >
          Registrarse
        </button>

      </div>
    </div>
  );
}

export default Login;