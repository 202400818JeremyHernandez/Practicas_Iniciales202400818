import { useNavigate } from "react-router-dom";

function Navbar({ setAuth }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setAuth(false);
    navigate("/");
  };

  const btn = {
    margin: "5px",
    padding: "8px",
    border: "none",
    background: "#3498db",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer"
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      background: "#2c3e50",
      padding: "10px"
    }}>
      <div style={{color: "white"}}>Mi Red USAC</div>

      <div>
        <button onClick={() => navigate("/feed")} style={btn}>Feed</button>
        <button onClick={() => navigate("/perfil")} style={btn}>Perfil</button>
        <button onClick={() => navigate("/cursos")} style={btn}>Cursos</button>
        <button onClick={logout} style={btn}>Salir</button>
      </div>
    </div>
  );
}

export default Navbar;