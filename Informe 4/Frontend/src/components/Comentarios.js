import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Comentarios({ id }) {
  const [comentarios, setComentarios] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

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
    <div style={{marginTop: "10px"}}>
      <h4>Comentarios</h4>

      {comentarios.map(c => (
        <div key={c.id} style={{
          background: "#1f1f35",
          padding: "8px",
          borderRadius: "6px",
          marginTop: "5px"
        }}>
          <b
            style={{cursor: "pointer", color: "#58a6ff"}}
            onClick={() => navigate(`/usuario/${c.registro}`)}
          >
            {c.nombres}:
          </b>
          {" "}{c.mensaje}
        </div>
      ))}

      <input
        placeholder="Escribe un comentario..."
        value={mensaje}
        onChange={e => setMensaje(e.target.value)}
      />

      <button onClick={comentar}>Comentar</button>
    </div>
  );
}

export default Comentarios;