import { useEffect, useState } from "react";
import API from "../api/api";

function Cursos() {
  const [data, setData] = useState({ cursos: [], total_creditos: 0 });
  const [todosCursos, setTodosCursos] = useState([]);
  const [cursoId, setCursoId] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // 🔥 cargar cursos aprobados
  const cargarAprobados = async () => {
    const res = await API.get(`/usuarios/${usuario.id}/cursos-aprobados`);
    setData(res.data);
  };

  // 🔥 cargar todos los cursos disponibles
  const cargarCursos = async () => {
    const res = await API.get("/cursos");
    setTodosCursos(res.data);
  };

  // 🔥 agregar curso aprobado
  const agregarCurso = async () => {
    try {
      await API.post("/cursos-aprobados", {
        curso_id: cursoId
      });

      alert("Curso agregado ✅");
      cargarAprobados();
    } catch (err) {
      alert("Error o curso ya agregado ❌");
    }
  };

  useEffect(() => {
    cargarAprobados();
    cargarCursos();
  }, []);

  return (
    <div>
      <h2>Cursos Aprobados 🎓</h2>

      {/* SELECT */}
      <select onChange={e => setCursoId(e.target.value)}>
        <option value="">Seleccione curso</option>
        {todosCursos.map(c => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <button onClick={agregarCurso}>Agregar</button>

      <hr />

      {/* LISTA */}
      {data.cursos.map(c => (
        <p key={c.id}>
          {c.nombre} ({c.creditos} créditos)
        </p>
      ))}

      <h3>Total créditos: {data.total_creditos}</h3>
    </div>
  );
}

export default Cursos;