# 🎓 Demo Base — Prácticas Iniciales USAC
### Clase 8 · Frontend con React · Backend Node.js · MySQL

> **Este repositorio es un ejemplo funcional de la arquitectura que deben implementar en su proyecto.**  
> Úsenlo como punto de partida y referencia, **no como entrega final**.

---

## 📁 Estructura del repositorio

```
demo-clase8/
├── server.js          → Backend Node.js + Express (API REST)
├── package.json       → Dependencias del proyecto
├── package-lock.json  → Versiones exactas instaladas
├── demo_db.sql        → Script para crear y poblar la base de datos
└── frontend.html      → Frontend de ejemplo (HTML + React via CDN)
```

---

## ⚙️ Requisitos previos

Antes de correr el proyecto, asegúrense de tener instalado:

| Herramienta | Versión recomendada | Descarga |
|---|---|---|
| Node.js | v18 o superior | https://nodejs.org |
| MySQL | v8.0 o superior | https://dev.mysql.com/downloads/ |
| MySQL Workbench | Cualquier versión reciente | https://dev.mysql.com/downloads/workbench/ |

---

## 🚀 Pasos para correr el proyecto

### Paso 1 — Configurar la Base de Datos

1. Abrir **MySQL Workbench** y conectarse a su servidor local.
2. Abrir el archivo `demo_db.sql` desde Workbench:
   - `File → Open SQL Script → seleccionar demo_db.sql`
3. Ejecutar todo el script con el rayo ⚡ (o `Ctrl + Shift + Enter`).
4. Verificar que se creó la base de datos con:
   ```sql
   USE practica_web;
   SHOW TABLES;
   ```
   Deben ver 6 tablas: `usuarios`, `cursos`, `catedraticos`, `publicaciones`, `comentarios`, `cursos_aprobados`.

---

### Paso 2 — Configurar el Backend

1. Abrir una terminal en la carpeta del proyecto.
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Abrir el archivo `server.js` y ajustar las credenciales de MySQL en las líneas indicadas:
   ```js
   const db = mysql.createPool({
     host:     'localhost',
     user:     'root',       // ← tu usuario de MySQL
     password: 'root',       // ← tu contraseña de MySQL
     database: 'practica_web'
   });
   ```
4. Iniciar el servidor:
   ```bash
   node server.js
   ```
5. Si todo está bien, verán en la terminal:
   ```
   ✅ Backend corriendo en http://localhost:3001
   ```

---

### Paso 3 — Abrir el Frontend

1. Con el servidor corriendo, abrir el archivo `frontend.html` directamente en el navegador:
   - Hacer doble click en el archivo, **o**
   - Arrastrarlo a la ventana del navegador.
2. La aplicación debería cargar la pantalla de Login.

> ⚠️ **Importante:** El backend debe estar corriendo (`node server.js`) antes de abrir el frontend, de lo contrario no podrá conectarse.

---

## 🧪 Cuentas de prueba

El script SQL incluye datos de ejemplo. Pueden registrar un usuario nuevo desde la pantalla de Registro, o usar directamente la API con Postman.

### Probar con Postman

**Registrar usuario:**
```
POST http://localhost:3001/api/auth/registro
Body (JSON):
{
  "registro": "202300100",
  "nombres": "Ana",
  "apellidos": "Martínez",
  "correo": "ana@usac.edu.gt",
  "contrasena": "usac2026"
}
```

**Iniciar sesión:**
```
POST http://localhost:3001/api/auth/login
Body (JSON):
{
  "registro": "202300100",
  "contrasena": "usac2026"
}
```
El servidor responde con un `token`. Cópielo para usarlo en las rutas protegidas.

**Ver publicaciones (requiere token):**
```
GET http://localhost:3001/api/publicaciones
Authorization: Bearer <token>
```

---

## 📡 Endpoints disponibles

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/registro` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión, recibe token JWT | No |
| GET | `/api/publicaciones` | Listar publicaciones (más recientes primero) | ✅ Sí |
| POST | `/api/publicaciones` | Crear nueva publicación | ✅ Sí |
| GET | `/api/publicaciones/:id/comentarios` | Ver comentarios de una publicación | ✅ Sí |
| POST | `/api/publicaciones/:id/comentarios` | Agregar comentario | ✅ Sí |
| GET | `/api/cursos` | Listar catálogo de cursos | ✅ Sí |
| GET | `/api/catedraticos` | Listar catálogo de catedráticos | ✅ Sí |

### Filtros disponibles en GET `/api/publicaciones`
```
/api/publicaciones?tipo=curso
/api/publicaciones?tipo=catedratico
/api/publicaciones?tipo=curso&referencia_id=3
```

---

## 🛠️ Problemas comunes

| Error | Causa probable | Solución |
|---|---|---|
| `Error del servidor` al login | Contraseña de MySQL incorrecta en `server.js` | Cambiar `password` en el createPool |
| `401 Token requerido` | No se envió el token en la petición | Agregar `Authorization: Bearer <token>` en Postman |
| Frontend no carga datos | El backend no está corriendo | Correr `node server.js` en la terminal |
| `ECONNREFUSED` | MySQL no está iniciado | Iniciar el servicio MySQL desde el Administrador de tareas |
| `ER_DUP_ENTRY` al registrar | El registro o correo ya existe en la BD | Usar un registro/correo diferente |

---

## 🗂️ ¿Cómo usar esto como base para su proyecto?

Este demo implementa el **esqueleto** de la aplicación requerida. Para completar su proyecto deben agregar:

### En el Backend (`server.js` o nuevos archivos):
- [ ] `PUT /api/usuarios/:id` — Editar perfil de usuario
- [ ] `GET /api/usuarios/:registro` — Ver perfil por número de registro
- [ ] `POST /api/cursos-aprobados` — Agregar curso aprobado al perfil
- [ ] `GET /api/usuarios/:id/cursos-aprobados` — Ver cursos aprobados con total de créditos
- [ ] `POST /api/auth/recuperar` — Recuperar contraseña (registro + correo)
- [ ] Filtro por nombre de curso: `/api/publicaciones?nombre_curso=Bases`
- [ ] Filtro por nombre de catedrático: `/api/publicaciones?nombre_catedratico=García`

### En el Frontend (React/Angular — **no usar el HTML del demo**):
- [ ] Pantalla de Login
- [ ] Pantalla de Registro
- [ ] Pantalla de Recuperar contraseña
- [ ] Feed con publicaciones y filtros
- [ ] Modal/Pantalla para crear publicación
- [ ] Vista de publicación con comentarios
- [ ] Perfil de usuario (propio y de otros)
- [ ] Gestión de cursos aprobados

> **Nota:** El `frontend.html` es solo para demostración. Su proyecto debe ser una aplicación React o Angular real creada con `npx create-react-app` o `ng new`.

---

## 📦 Dependencias del backend

```json
{
  "express":     "^4.18.2",   → Framework del servidor
  "mysql2":      "^3.6.0",    → Conexión a MySQL
  "bcryptjs":    "^2.4.3",    → Hasheo de contraseñas
  "jsonwebtoken":"^9.0.0",    → Autenticación con JWT
  "cors":        "^2.8.5"     → Permitir peticiones del frontend
}
```

Para instalar todas de una vez:
```bash
npm install
```

---

## 📅 Fecha de entrega

**19 de Marzo de 2026**

### Entregables requeridos:
1. 🔗 Enlace al repositorio de GitHub (con commits de ambos integrantes)
2. 📖 Manual de Usuario (pantallas, flujos, botones)
3. ⚙️ Manual Técnico (endpoints, parámetros, respuestas)

---

*Prácticas Iniciales — Sección C · Inga. Floriza Avila · USAC Facultad de Ingeniería*
