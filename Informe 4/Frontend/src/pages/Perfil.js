import { useEffect, useState } from "react";
import API from "../api/api";

function Perfil() {
  const [user, setUser] = useState({});

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    API.get(`/usuarios/${usuario.registro}`)
      .then(res => setUser(res.data));
  }, []);

  return (
    <div>
      <h2>Perfil</h2>
      <p>{user.nombres}</p>
      <p>{user.apellidos}</p>
      <p>{user.correo}</p>
    </div>
  );
}

export default Perfil;