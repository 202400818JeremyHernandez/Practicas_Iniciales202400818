// ╔══════════════════════════════════════════════════════════════╗                                          
// ║Autor: Jeremy Hernandez                                       ║
// ║Curso: Practicas Iniciales                                    ║
// ║PROYECTO USAC — Backend API                                   ║
// ║Descripción: API REST para manejo de usuarios, publicaciones, ║
// ╚══════════════════════════════════════════════════════════════╝


const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');  // Para encriptar contraseñas
const jwt      = require('jsonwebtoken'); // Para autenticación con tokens
const mysql    = require('mysql2/promise');

const app    = express();
const PORT   = 3001;

// Clave secreta para firmar tokens (en producción debería ir en .env)
const SECRET = 'clave_super_secreta_demo';

app.use(cors());
app.use(express.json()); // Permite recibir JSON en las peticiones

// --- [CONEXIÓN A BASE DE DATOS (MySQL) ] ---

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: 'informe4_web'
});

// --- [ MIDDLEWARE PARA VALIDAR TOKEN JWT ] ---

// Este middleware protege las rutas que requieren login

function verificarToken(req, res, next) {
  const auth  = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    // Decodifica el token y guarda el usuario en req
    req.usuario = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Token inválido' });
  }
}

// >>>>>>>>>>>>>>>>> AUTENTICACIÓN (REGISTRO / LOGIN / RECUPERACIÓN) <<<<<<<<<<<<<<<<<
// Registrar usuario nuevo
app.post('/api/auth/registro', async (req, res) => {
  const { registro, nombres, apellidos, correo, contrasena } = req.body;

  // Validación básica
  if (!registro || !nombres || !apellidos || !correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Se encripta la contraseña antes de guardarla
    const hash = await bcrypt.hash(contrasena, 10);

    await db.execute(
      'INSERT INTO usuarios (registro, nombres, apellidos, correo, contrasena) VALUES (?,?,?,?,?)',
      [registro, nombres, apellidos, correo, hash]
    );

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });

  } catch (err) {
    // Error típico cuando el correo o registro ya existen
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Registro o correo ya existe' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Login de usuario
app.post('/api/auth/login', async (req, res) => {
  const { registro, contrasena } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE registro = ?',
      [registro]
    );

    const usuario = rows[0];

    // Validar si el usuario existe
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Comparar contraseña ingresada con la encriptada
    const valido = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!valido) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, registro: usuario.registro },
      SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        registro: usuario.registro
      }
    });

  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Recuperar contraseña
app.post('/api/auth/recuperar', async (req, res) => {
  const { registro, correo, nueva_contrasena } = req.body;

  try {
    // Verifica que el usuario exista con esos datos
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE registro = ? AND correo = ?',
      [registro, correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Datos incorrectos' });
    }

    // Encripta la nueva contraseña
    const hash = await bcrypt.hash(nueva_contrasena, 10);

    await db.execute(
      'UPDATE usuarios SET contrasena = ? WHERE registro = ?',
      [hash, registro]
    );

    res.json({ mensaje: 'Contraseña actualizada correctamente' });

  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// >>>>>>>>>>>>>>>>> USUARIOS <<<<<<<<<<<<<<<<<

// Editar perfil
app.put('/api/usuarios/:id', verificarToken, async (req, res) => {
  const { nombres, apellidos, correo } = req.body;

  try {
    await db.execute(
      'UPDATE usuarios SET nombres=?, apellidos=?, correo=? WHERE id=?',
      [nombres, apellidos, correo, req.params.id]
    );

    res.json({ mensaje: 'Perfil actualizado correctamente' });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Correo ya en uso' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Obtener perfil por registro académico
app.get('/api/usuarios/:registro', verificarToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, registro, nombres, apellidos, correo FROM usuarios WHERE registro=?',
      [req.params.registro]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);

  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// >>>>>>>>>>>>>>>>> CURSOS APROBADOS <<<<<<<<<<<<<<<<<

// Agregar curso aprobado al usuario
app.post('/api/cursos-aprobados', verificarToken, async (req, res) => {
  const { curso_id } = req.body;

  try {
    await db.execute(
      'INSERT INTO cursos_aprobados (usuario_id, curso_id) VALUES (?,?)',
      [req.usuario.id, curso_id]
    );

    res.status(201).json({ mensaje: 'Curso agregado correctamente' });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Curso ya agregado' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Obtener cursos aprobados + total de créditos
app.get('/api/usuarios/:id/cursos-aprobados', verificarToken, async (req, res) => {
  try {
    const [cursos] = await db.execute(
      `SELECT c.id, c.nombre, c.creditos
       FROM cursos_aprobados ca
       JOIN cursos c ON ca.curso_id = c.id
       WHERE ca.usuario_id = ?`,
      [req.params.id]
    );

    // Suma total de créditos
    const [total] = await db.execute(
      `SELECT SUM(c.creditos) AS total_creditos
       FROM cursos_aprobados ca
       JOIN cursos c ON ca.curso_id = c.id
       WHERE ca.usuario_id = ?`,
      [req.params.id]
    );

    res.json({
      cursos,
      total_creditos: total[0].total_creditos || 0
    });

  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
});


// >>>>>>>>>>>>>>>>> PUBLICACIONES Y FILTROS <<<<<<<<<<<<<<<<<

app.get('/api/publicaciones', verificarToken, async (req, res) => {
  const { nombre_curso, nombre_catedratico } = req.query;

  let query = `
    SELECT p.*, u.nombres, u.apellidos, u.registro,
           COALESCE(cu.nombre, ca.nombre) AS referencia_nombre,
           COUNT(co.id) AS total_comentarios
    FROM publicaciones p
    JOIN usuarios u ON p.usuario_id = u.id
    LEFT JOIN comentarios co ON co.publicacion_id = p.id
    LEFT JOIN cursos cu ON p.tipo = 'curso' AND p.referencia_id = cu.id
    LEFT JOIN catedraticos ca ON p.tipo = 'catedratico' AND p.referencia_id = ca.id
  `;

  const params = [];
  let condiciones = [];

  if (nombre_curso) {
    condiciones.push('cu.nombre LIKE ?');
    params.push(`%${nombre_curso}%`);
  }

  if (nombre_catedratico) {
    condiciones.push('ca.nombre LIKE ?');
    params.push(`%${nombre_catedratico}%`);
  }

  if (condiciones.length > 0) {
    query += ' WHERE ' + condiciones.join(' AND ');
  }

  query += ' GROUP BY p.id ORDER BY p.creado_en DESC';

  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
});

// Crear publicación
app.post('/api/publicaciones', verificarToken, async (req, res) => {
  const { tipo, referencia_id, mensaje } = req.body;

  if (!['curso', 'catedratico'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO publicaciones (usuario_id, tipo, referencia_id, mensaje) VALUES (?,?,?,?)',
      [req.usuario.id, tipo, referencia_id, mensaje]
    );

    res.status(201).json({ id: result.insertId });

  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
});


// >>>>>>>>>>>>>>>>> COMENTARIOS <<<<<<<<<<<<<<<<<
// Obtener comentarios de una publicación
app.get('/api/publicaciones/:id/comentarios', verificarToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT c.*, u.nombres, u.registro
       FROM comentarios c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.publicacion_id = ?
       ORDER BY c.creado_en ASC`,
      [req.params.id]
    );

    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// Agregar comentario
app.post('/api/publicaciones/:id/comentarios', verificarToken, async (req, res) => {
  const { mensaje } = req.body;

  const [result] = await db.execute(
    'INSERT INTO comentarios (publicacion_id, usuario_id, mensaje) VALUES (?,?,?)',
    [req.params.id, req.usuario.id, mensaje]
  );

  res.status(201).json({ id: result.insertId });
});

// >>>>>>>>>>>>>>>>> CATÁLOGOS <<<<<<<<<<<<<<<<<

// Listar cursos
app.get('/api/cursos', verificarToken, async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM cursos');
  res.json(rows);
});

// Listar catedráticos
app.get('/api/catedraticos', verificarToken, async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM catedraticos');
  res.json(rows);
});

// ============================================================
// INICIO DEL SERVIDOR
// ============================================================

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});