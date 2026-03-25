// ============================================================
// routes/admin.js — API del panel de administración
// Rutas protegidas con JWT para gestionar el negocio
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ============================================================
// MIDDLEWARE — Verificar token JWT en rutas protegidas
// ============================================================
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ ok: false, mensaje: 'Token requerido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload; // Adjuntar datos del admin a la request
    next();
  } catch (error) {
    return res.status(403).json({ ok: false, mensaje: 'Token inválido o expirado' });
  }
}

// ============================================================
// AUTH
// ============================================================

// --- POST /api/admin/login ---
// Inicia sesión del administrador y devuelve un JWT
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Buscar admin en la base de datos
    const [rows] = await pool.query(
      'SELECT * FROM admins WHERE correo = ? AND activo = 1',
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
    }

    const admin = rows[0];

    // Verificar contraseña con bcrypt
    const passwordValida = await bcrypt.compare(password, admin.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
    }

    // Generar JWT con duración de 8 horas
    const token = jwt.sign(
      { id: admin.id, correo: admin.correo, nombre: admin.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ ok: true, token, nombre: admin.nombre });

  } catch (error) {
    console.error('❌ Error en login admin:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al iniciar sesión' });
  }
});

// ============================================================
// PRODUCTOS (protegido)
// ============================================================

// --- GET /api/admin/productos ---
// Lista todos los productos incluyendo los inactivos
router.get('/productos', verificarToken, async (req, res) => {
  try {
    const [productos] = await pool.query(
      'SELECT * FROM productos ORDER BY id DESC'
    );
    res.json({ ok: true, data: productos });
  } catch (error) {
    console.error('❌ Error al obtener productos admin:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener productos' });
  }
});

// --- POST /api/admin/productos ---
// Crea un nuevo producto
router.post('/productos', verificarToken, async (req, res) => {
  try {
    const {
      nombre, slug, marca, categoria,
      precio, precio_mayoreo, stock,
      imagen_principal, imagenes,
      descripcion, tallas, colores, destacado
    } = req.body;

    const [resultado] = await pool.query(
      `INSERT INTO productos 
        (nombre, slug, marca, categoria, precio, precio_mayoreo, stock,
         imagen_principal, imagenes, descripcion, tallas, colores, destacado, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        nombre, slug, marca, categoria,
        precio, precio_mayoreo || null, stock,
        imagen_principal,
        JSON.stringify(imagenes || []),
        descripcion,
        JSON.stringify(tallas || []),
        JSON.stringify(colores || []),
        destacado ? 1 : 0
      ]
    );

    res.json({ ok: true, mensaje: 'Producto creado', id: resultado.insertId });

  } catch (error) {
    console.error('❌ Error al crear producto:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al crear producto' });
  }
});

// --- PUT /api/admin/productos/:id ---
// Actualiza un producto existente
router.put('/productos/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const campos = req.body;

    // Serializar arrays a JSON si vienen en el body
    if (campos.imagenes) campos.imagenes = JSON.stringify(campos.imagenes);
    if (campos.tallas)   campos.tallas   = JSON.stringify(campos.tallas);
    if (campos.colores)  campos.colores  = JSON.stringify(campos.colores);

    await pool.query('UPDATE productos SET ? WHERE id = ?', [campos, id]);

    res.json({ ok: true, mensaje: 'Producto actualizado' });

  } catch (error) {
    console.error('❌ Error al actualizar producto:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar producto' });
  }
});

// ============================================================
// PEDIDOS (protegido)
// ============================================================

// --- GET /api/admin/pedidos ---
// Lista todos los pedidos con sus detalles
router.get('/pedidos', verificarToken, async (req, res) => {
  try {
    const [pedidos] = await pool.query(
      'SELECT * FROM pedidos ORDER BY created_at DESC'
    );
    res.json({ ok: true, data: pedidos });
  } catch (error) {
    console.error('❌ Error al obtener pedidos:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener pedidos' });
  }
});

// --- PUT /api/admin/pedidos/:id/estado ---
// Actualiza el estado de un pedido (pagado, enviado, entregado, cancelado)
router.put('/pedidos/:id/estado', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, numero_guia } = req.body;

    const estadosValidos = ['pagado', 'preparando', 'enviado', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ ok: false, mensaje: 'Estado no válido' });
    }

    await pool.query(
      'UPDATE pedidos SET estado = ?, numero_guia = ? WHERE id = ?',
      [estado, numero_guia || null, id]
    );

    res.json({ ok: true, mensaje: 'Estado actualizado' });

  } catch (error) {
    console.error('❌ Error al actualizar estado:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar estado' });
  }
});

module.exports = router;