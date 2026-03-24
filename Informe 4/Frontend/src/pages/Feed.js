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
    } catch (err) {
      console.error(err);
      alert("Error cargando publicaciones");
    }
  };

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  return (
    <div>
      <h1>Feed 🔥</h1>

      {/* 🔍 FILTRO */}
      <input
        placeholder="Buscar por curso"
        onChange={e => setFiltro(e.target.value)}
      />

      <button onClick={cargarPublicaciones}>Filtrar</button>

      {/* ➕ CREAR PUBLICACIÓN */}
      <CrearPublicacion recargar={cargarPublicaciones} />

      {/* 📭 SIN DATOS */}
      {posts.length === 0 ? (
        <p>No hay publicaciones</p>
      ) : (
        posts.map(p => (
          <div
            key={p.id}
            style={{
              border: "1px solid black",
              margin: "10px",
              padding: "10px"
            }}
          >
            {/* 👤 USUARIO */}
            <h4>{p.nombres} {p.apellidos}</h4>

            {/* 💬 MENSAJE */}
            <p>{p.mensaje}</p>

            {/* 📚 REFERENCIA */}
            <small>{p.referencia_nombre}</small>

            {/* 💬 TOTAL */}
            <p>Comentarios: {p.total_comentarios}</p>

            {/* 💬 COMPONENTE DE COMENTARIOS */}
            <Comentarios id={p.id} />
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;