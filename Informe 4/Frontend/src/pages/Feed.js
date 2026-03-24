import Comentarios from "../components/Comentarios";
import CrearPublicacion from "../components/CrearPublicacion";
import { useEffect, useState } from "react";
import API from "../api/api";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [filtro, setFiltro] = useState("");

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
        <div key={p.id} style={{
          background: "white",
          padding: "15px",
          marginTop: "15px",
          borderRadius: "8px",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
        }}>
          <h4>{p.nombres} {p.apellidos}</h4>
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