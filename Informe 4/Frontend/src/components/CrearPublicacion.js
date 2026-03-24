import { useState } from "react";
import API from "../api/api";

function CrearPublicacion({ recargar }) {
  const [mensaje, setMensaje] = useState("");

  const crear = async () => {
    try {
      await API.post("/publicaciones", {
        tipo: "curso",
        referencia_id: 1,
        mensaje
      });

      alert("Publicado ✅");
      setMensaje("");
      recargar();
    } catch {
      alert("Error al publicar ❌");
    }
  };

  return (
    <div>
      <h3>Crear publicación</h3>
      <textarea
        value={mensaje}
        onChange={e => setMensaje(e.target.value)}
      />
      <button onClick={crear}>Publicar</button>
    </div>
  );
}

export default CrearPublicacion;