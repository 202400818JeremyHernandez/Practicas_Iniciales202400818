import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function PerfilUsuario() {
  const { registro } = useParams();

  const [user, setUser] = useState({});
  const [creditos, setCreditos] = useState(0);

  const cargarPerfil = async () => {
    const res = await API.get(`/usuarios/${registro}`);
    setUser(res.data);

    // 🔥 obtener créditos con id
    const res2 = await API.get(`/usuarios/${res.data.id}/cursos-aprobados`);
    setCreditos(res2.data.total_creditos);
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  return (
    <div className="container">
      <h2>Perfil Usuario 👤</h2>

      <div className="card">
        <h3>{user.nombres} {user.apellidos}</h3>

        <p><b>Registro:</b> {user.registro}</p>
        <p><b>Correo:</b> {user.correo}</p>
        <p><b>Créditos:</b> {creditos}</p>
      </div>
    </div>
  );
}

export default PerfilUsuario;