import { useEffect, useState } from "react";
import API from "../api/api";

function Feed() {
  const [posts, setPosts] = useState([]);

  const cargarPublicaciones = async () => {
    try {
      const res = await API.get("/publicaciones");
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

      {posts.length === 0 ? (
        <p>No hay publicaciones</p>
      ) : (
        posts.map(p => (
          <div key={p.id} style={{border: "1px solid black", margin: "10px", padding: "10px"}}>
            <h4>{p.nombres} {p.apellidos}</h4>
            <p>{p.mensaje}</p>
            <small>{p.referencia_nombre}</small>
            <p>Comentarios: {p.total_comentarios}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;