import { useEffect, useState } from "react";
import API from "../api/api";

function Comentarios({ id }) {
  const [comentarios, setComentarios] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const cargar = async () => {
    const res = await API.get(`/publicaciones/${id}/comentarios`);
    setComentarios(res.data);
  };

  const comentar = async () => {
    await API.post(`/publicaciones/${id}/comentarios`, { mensaje });
    setMensaje("");
    cargar();
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div>
      <h4>Comentarios</h4>

      {comentarios.map(c => (
        <p key={c.id}><b>{c.nombres}:</b> {c.mensaje}</p>
      ))}

      <input
        value={mensaje}
        onChange={e => setMensaje(e.target.value)}
      />

      <button onClick={comentar}>Comentar</button>
    </div>
  );
}

export default Comentarios;