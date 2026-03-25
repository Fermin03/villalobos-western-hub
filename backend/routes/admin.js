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
    req.admin = payload;
    next();
  } catch (error) {
    return res.status(403).json({ ok: false, mensaje: 'Token inválido o expirado' });
  }
}

// ============================================================
// AUTH
// ============================================================

// --- POST /api/admin/login ---
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM admins WHERE correo = ? AND activo = 1',
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
    }

    const admin = rows[0];
    const passwordValida = await bcrypt.compare(password, admin.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
    }

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
router.get('/productos', verificarToken, async (req, res) => {
  try {
    const [productos] = await pool.query('SELECT * FROM productos ORDER BY id DESC');
    res.json({ ok: true, data: productos });
  } catch (error) {
    console.error('❌ Error al obtener productos admin:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener productos' });
  }
});

// --- POST /api/admin/productos ---
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
router.put('/productos/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const campos = req.body;

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
// CATEGORÍAS (protegido)
// ============================================================

// --- GET /api/admin/categorias ---
// Lista todas las categorías (para admin y para la tienda)
router.get('/categorias', async (req, res) => {
  // Esta ruta es pública — el catálogo la necesita sin token
  try {
    const [categorias] = await pool.query(
      'SELECT * FROM categorias WHERE activo = 1 ORDER BY nombre ASC'
    );
    res.json({ ok: true, data: categorias });
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener categorías' });
  }
});

// --- POST /api/admin/categorias ---
// Crea una nueva categoría
router.post('/categorias', verificarToken, async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ ok: false, mensaje: 'El nombre es requerido' });
    }

    const [resultado] = await pool.query(
      'INSERT INTO categorias (nombre) VALUES (?)',
      [nombre.trim()]
    );

    res.json({ ok: true, mensaje: 'Categoría creada', id: resultado.insertId });

  } catch (error) {
    // Error de duplicado (nombre único)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ ok: false, mensaje: 'Ya existe una categoría con ese nombre' });
    }
    console.error('❌ Error al crear categoría:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al crear categoría' });
  }
});

// --- DELETE /api/admin/categorias/:id ---
// Desactiva una categoría (no la elimina para no romper productos existentes)
router.delete('/categorias/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que no haya productos activos usando esta categoría
    const [productos] = await pool.query(
      `SELECT COUNT(*) as total FROM productos 
       WHERE categoria = (SELECT nombre FROM categorias WHERE id = ?) AND activo = 1`,
      [id]
    );

    if (productos[0].total > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: `No se puede eliminar — hay ${productos[0].total} producto(s) usando esta categoría`
      });
    }

    await pool.query('UPDATE categorias SET activo = 0 WHERE id = ?', [id]);

    res.json({ ok: true, mensaje: 'Categoría eliminada' });

  } catch (error) {
    console.error('❌ Error al eliminar categoría:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar categoría' });
  }
});

// ============================================================
// PEDIDOS (protegido)
// ============================================================

// --- GET /api/admin/pedidos ---
router.get('/pedidos', verificarToken, async (req, res) => {
  try {
    const [pedidos] = await pool.query('SELECT * FROM pedidos ORDER BY created_at DESC');
    res.json({ ok: true, data: pedidos });
  } catch (error) {
    console.error('❌ Error al obtener pedidos:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener pedidos' });
  }
});

// --- PUT /api/admin/pedidos/:id/estado ---
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