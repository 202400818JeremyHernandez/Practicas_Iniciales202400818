import Comentarios from "../components/Comentarios";
import CrearPublicacion from "../components/CrearPublicacion";
import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [filtro, setFiltro] = useState("");

  const navigate = useNavigate();

  const cargarPublicaciones = async () => {
    try {
      const res = await API.get(`/publicaciones?nombre_curso=${filtro}`);
      setPosts(res.data);
    } catch {
      alert("Error cargando publicaciones");
    }
  };

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  return (
    <div className="container">
      <h1>Feed 🔥</h1>

      <input
        placeholder="Buscar por curso"
        onChange={e => setFiltro(e.target.value)}
      />

      <button onClick={cargarPublicaciones}>Filtrar</button>

      <CrearPublicacion recargar={cargarPublicaciones} />

      {posts.map(p => (
        <div key={p.id} className="card">
          <h4
            style={{cursor: "pointer", color: "#58a6ff"}}
            onClick={() => navigate(`/usuario/${p.registro}`)}
          >
            {p.nombres} {p.apellidos}
          </h4>

          <p>{p.mensaje}</p>
          <small>{p.referencia_nombre}</small>
          <p>Comentarios: {p.total_comentarios}</p>

          <Comentarios id={p.id} />
        </div>
      ))}
    </div>
  );
}

export default Feed;