// ============================================================
//  DEMO CLASE 8 — Backend Node.js + Express
//  Ejecutar:  npm install   →   node server.js
// ============================================================

const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const mysql    = require('mysql2/promise');

const app    = express();
const PORT   = 3001;
const SECRET = 'clave_super_secreta_demo'; // En producción usar variable de entorno

app.use(cors());
app.use(express.json());

// ─── CONEXIÓN A MYSQL ────────────────────────────────────────
const db = mysql.createPool({
  host:     'localhost',
  user:     'root',       
  password: 'root',           
  database: 'practica_web'
});

// ─── MIDDLEWARE: verificar JWT ───────────────────────────────
function verificarToken(req, res, next) {
  const auth  = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];  // "Bearer <token>"
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    req.usuario = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Token inválido' });
  }
}

// ============================================================
//  AUTH
// ============================================================

// POST /api/auth/registro
app.post('/api/auth/registro', async (req, res) => {
  const { registro, nombres, apellidos, correo, contrasena } = req.body;

  if (!registro || !nombres || !apellidos || !correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const hash = await bcrypt.hash(contrasena, 10);
    await db.execute(
      'INSERT INTO usuarios (registro, nombres, apellidos, correo, contrasena) VALUES (?,?,?,?,?)',
      [registro, nombres, apellidos, correo, hash]
    );
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Registro o correo ya existe' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { registro, contrasena } = req.body;

  if (!registro || !contrasena) {
    return res.status(400).json({ error: 'Registro y contraseña requeridos' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE registro = ?', [registro]
    );
    const usuario = rows[0];

    if (!usuario) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const valido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!valido)  return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: usuario.id, registro: usuario.registro, nombres: usuario.nombres },
      SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, usuario: { id: usuario.id, nombres: usuario.nombres, registro: usuario.registro } });
  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ============================================================
//  PUBLICACIONES
// ============================================================

// GET /api/publicaciones  — lista todas, más recientes primero
// Query params opcionales: tipo=curso|catedratico  referencia_id=N
app.get('/api/publicaciones', verificarToken, async (req, res) => {
  const { tipo, referencia_id } = req.query;

  let query = `
    SELECT p.*, u.nombres, u.apellidos, u.registro,
           COUNT(c.id) AS total_comentarios
    FROM publicaciones p
    JOIN usuarios u ON p.usuario_id = u.id
    LEFT JOIN comentarios c ON c.publicacion_id = p.id
  `;
  const params = [];

  if (tipo) {
    query += ' WHERE p.tipo = ?';
    params.push(tipo);
    if (referencia_id) {
      query += ' AND p.referencia_id = ?';
      params.push(referencia_id);
    }
  }

  query += ' GROUP BY p.id ORDER BY p.creado_en DESC';

  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
});

// POST /api/publicaciones  — crear nueva
app.post('/api/publicaciones', verificarToken, async (req, res) => {
  const { tipo, referencia_id, mensaje } = req.body;

  if (!tipo || !referencia_id || !mensaje) {
    return res.status(400).json({ error: 'tipo, referencia_id y mensaje son requeridos' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO publicaciones (usuario_id, tipo, referencia_id, mensaje) VALUES (?,?,?,?)',
      [req.usuario.id, tipo, referencia_id, mensaje]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Publicación creada' });
  } catch {
    res.status(500).json({ error: 'Error al crear publicación' });
  }
});

// ============================================================
//  COMENTARIOS
// ============================================================

// GET /api/publicaciones/:id/comentarios
app.get('/api/publicaciones/:id/comentarios', verificarToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT c.*, u.nombres, u.apellidos
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

// POST /api/publicaciones/:id/comentarios
app.post('/api/publicaciones/:id/comentarios', verificarToken, async (req, res) => {
  const { mensaje } = req.body;
  if (!mensaje) return res.status(400).json({ error: 'Mensaje requerido' });

  try {
    const [result] = await db.execute(
      'INSERT INTO comentarios (publicacion_id, usuario_id, mensaje) VALUES (?,?,?)',
      [req.params.id, req.usuario.id, mensaje]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Comentario agregado' });
  } catch {
    res.status(500).json({ error: 'Error al crear comentario' });
  }
});

// ============================================================
//  CURSOS y CATEDRÁTICOS (catálogos)
// ============================================================

app.get('/api/cursos', verificarToken, async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM cursos ORDER BY nombre');
  res.json(rows);
});

app.get('/api/catedraticos', verificarToken, async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM catedraticos ORDER BY nombre');
  res.json(rows);
});

// ─── INICIO ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
  console.log('   Endpoints disponibles:');
  console.log('   POST /api/auth/registro');
  console.log('   POST /api/auth/login');
  console.log('   GET  /api/publicaciones       (requiere token)');
  console.log('   POST /api/publicaciones       (requiere token)');
  console.log('   GET  /api/publicaciones/:id/comentarios');
  console.log('   POST /api/publicaciones/:id/comentarios');
  console.log('   GET  /api/cursos');
  console.log('   GET  /api/catedraticos');
});
