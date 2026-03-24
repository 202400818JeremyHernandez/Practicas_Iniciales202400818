import { useEffect, useState } from "react";
import API from "../api/api";

function Cursos() {
  const [data, setData] = useState({ cursos: [] });
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    API.get(`/usuarios/${usuario.id}/cursos-aprobados`)
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Cursos Aprobados</h2>

      {data.cursos.map(c => (
        <p key={c.id}>{c.nombre} ({c.creditos})</p>
      ))}

      <h3>Total créditos: {data.total_creditos}</h3>
    </div>
  );
}

export default Cursos;