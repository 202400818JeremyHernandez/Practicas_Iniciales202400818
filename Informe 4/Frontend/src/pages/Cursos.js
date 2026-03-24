import { useEffect, useState } from "react";
import API from "../api/api";

function Cursos() {
  const [data, setData] = useState({ cursos: [], total_creditos: 0 });
  const [todosCursos, setTodosCursos] = useState([]);
  const [cursoId, setCursoId] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const cargarAprobados = async () => {
    const res = await API.get(`/usuarios/${usuario.id}/cursos-aprobados`);
    setData(res.data);
  };

  const cargarCursos = async () => {
    const res = await API.get("/cursos");
    setTodosCursos(res.data);
  };

  const agregarCurso = async () => {
    try {
      await API.post("/cursos-aprobados", { curso_id: cursoId });
      alert("Curso agregado ✅");
      cargarAprobados();
    } catch {
      alert("Error o ya agregado ❌");
    }
  };

  useEffect(() => {
    cargarAprobados();
    cargarCursos();
  }, []);

  return (
    <div className="container">
      <h2>Cursos Aprobados 🎓</h2>

      <div className="card">
        <h3>Agregar Curso</h3>

        <select onChange={e => setCursoId(e.target.value)}>
          <option value="">Seleccione curso</option>
          {todosCursos.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        <button onClick={agregarCurso}>Agregar</button>
      </div>

      <div className="card">
        <h3>Mis Cursos</h3>

        {data.cursos.map(c => (
          <p key={c.id}>
            {c.nombre} — {c.creditos} créditos
          </p>
        ))}

        <hr />

        <h3>Total: {data.total_creditos} créditos</h3>
      </div>
    </div>
  );
}

export default Cursos;