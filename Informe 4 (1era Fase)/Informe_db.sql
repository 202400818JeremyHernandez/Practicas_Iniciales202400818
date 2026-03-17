----------------------
-- BASE DE DATOS
----------------------

CREATE DATABASE IF NOT EXISTS informe4_web;
USE informe4_web;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registro VARCHAR(20) NOT NULL UNIQUE,
  nombres VARCHAR(80) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  creditos INT NOT NULL DEFAULT 5
);

CREATE TABLE catedraticos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL
);

CREATE TABLE publicaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('curso','catedratico') NOT NULL,
  referencia_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE comentarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  publicacion_id INT NOT NULL,
  usuario_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE cursos_aprobados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  curso_id INT NOT NULL,
  UNIQUE (usuario_id, curso_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

-- ---------------
-- DATOS DE PRUEBA 
-- ---------------

INSERT INTO cursos (nombre, creditos) VALUES
  ('Programación Avanzada', 5),
  ('Arquitectura de Computadoras', 4),
  ('Inteligencia Artificial', 5),
  ('Seguridad Informática', 4),
  ('Desarrollo Web', 5);

INSERT INTO catedraticos (nombre) VALUES
  ('Roberto Castillo'),
  ('Daniela Fuentes'),
  ('Jorge Herrera');

INSERT INTO usuarios (registro, nombres, apellidos, correo, contrasena) VALUES
  ('202400101', 'Carlos',  'Ramírez',  'carlosr@correo.com', '$2b$10$hash_demo_1'),
  ('202400102', 'Andrea',  'Gómez',    'andreag@correo.com', '$2b$10$hash_demo_2'),
  ('202400103', 'Luis',    'Morales',  'luism@correo.com',   '$2b$10$hash_demo_3');

INSERT INTO publicaciones (usuario_id, tipo, referencia_id, mensaje) VALUES
  (1, 'curso',       1, 'Programación Avanzada es retadora, pero se aprende bastante sobre estructuras complejas.'),
  (2, 'catedratico', 2, 'La licenciada explica muy claro y siempre deja ejemplos prácticos.'),
  (3, 'curso',       3, 'IA es interesante pero hay que practicar bastante lógica.');

INSERT INTO comentarios (publicacion_id, usuario_id, mensaje) VALUES
  (1, 2, '¿Usan mucho C++ o cambian de lenguaje?'),
  (1, 3, 'Confirmo, es difícil pero vale la pena.'),
  (2, 1, 'Sí, es de las mejores catedráticas que he tenido.');

INSERT INTO cursos_aprobados (usuario_id, curso_id) VALUES
  (1, 1), (1, 5),
  (2, 2), (2, 3),
  (3, 1), (3, 4);