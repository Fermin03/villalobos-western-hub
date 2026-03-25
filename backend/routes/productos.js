// ============================================================
// routes/productos.js — API de productos
// Endpoints para consultar el catálogo desde MySQL
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// --- GET /api/productos ---
// Obtiene todos los productos activos del catálogo
router.get('/', async (req, res) => {
  try {
    const { marca, categoria, orden } = req.query;

    // Consulta base — solo productos activos
    let sql = `
      SELECT 
        id, nombre, slug, marca, categoria, 
        precio, precio_mayoreo, stock,
        imagen_principal, imagenes,
        descripcion, tallas, colores,
        destacado, activo
      FROM productos 
      WHERE activo = 1
    `;

    const params = [];

    // Filtro opcional por marca
    if (marca) {
      sql += ' AND marca = ?';
      params.push(marca);
    }

    // Filtro opcional por categoría
    if (categoria) {
      sql += ' AND categoria = ?';
      params.push(categoria);
    }

    // Orden opcional (precio, nombre, destacado)
    const ordenesPermitidos = ['precio ASC', 'precio DESC', 'nombre ASC', 'destacado DESC'];
    if (orden && ordenesPermitidos.includes(orden)) {
      sql += ` ORDER BY ${orden}`;
    } else {
      sql += ' ORDER BY destacado DESC, id DESC';
    }

    const [productos] = await pool.query(sql, params);

    // Parsear imágenes y tallas (guardadas como JSON en MySQL)
    const productosFormateados = productos.map(p => ({
      ...p,
      imagenes: p.imagenes ? JSON.parse(p.imagenes) : [],
      tallas:   p.tallas   ? JSON.parse(p.tallas)   : [],
      colores:  p.colores  ? JSON.parse(p.colores)  : [],
    }));

    res.json({ ok: true, data: productosFormateados });

  } catch (error) {
    console.error('❌ Error al obtener productos:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener productos' });
  }
});

// --- GET /api/productos/:slug ---
// Obtiene un producto individual por su slug (ej: /sombrero-rodeo-cafe)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM productos WHERE slug = ? AND activo = 1',
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
    }

    const producto = rows[0];

    // Parsear campos JSON
    producto.imagenes = producto.imagenes ? JSON.parse(producto.imagenes) : [];
    producto.tallas   = producto.tallas   ? JSON.parse(producto.tallas)   : [];
    producto.colores  = producto.colores  ? JSON.parse(producto.colores)  : [];

    res.json({ ok: true, data: producto });

  } catch (error) {
    console.error('❌ Error al obtener producto:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener producto' });
  }
});

module.exports = router;