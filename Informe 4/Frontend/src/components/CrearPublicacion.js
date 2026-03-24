import { useState, useEffect } from "react";
import API from "../api/api";

function CrearPublicacion({ recargar }) {
  const [mensaje, setMensaje] = useState("");
  const [cursos, setCursos] = useState([]);
  const [cursoId, setCursoId] = useState("");

  useEffect(() => {
    API.get("/cursos").then(res => setCursos(res.data));
  }, []);

  const crear = async () => {
    try {
      await API.post("/publicaciones", {
        tipo: "curso",
        referencia_id: cursoId,
        mensaje
      });

      alert("Publicado ✅");
      setMensaje("");
      recargar();
    } catch {
      alert("Error ❌");
    }
  };

  return (
    <div style={{
      background: "white",
      padding: "10px",
      marginTop: "10px",
      borderRadius: "8px"
    }}>
      <h3>Crear publicación</h3>

      <select onChange={e => setCursoId(e.target.value)}>
        <option value="">Seleccione curso</option>
        {cursos.map(c => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      <br />

      <textarea
        style={{width: "100%", height: "60px"}}
        value={mensaje}
        onChange={e => setMensaje(e.target.value)}
      />

      <button onClick={crear}>Publicar</button>
    </div>
  );
}

export default CrearPublicacion;