// ============================================================
// routes/pedidos.js — API de pedidos
// Crea y consulta pedidos después de un pago exitoso
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// --- POST /api/pedidos ---
// Crea un nuevo pedido después de confirmar el pago con Stripe
router.post('/', async (req, res) => {
  const conexion = await pool.getConnection();

  try {
    const {
      stripe_payment_id,  // ID del Payment Intent de Stripe
      cliente_nombre,
      cliente_correo,
      cliente_telefono,
      direccion_envio,    // Objeto con calle, ciudad, estado, cp, pais
      items,              // Array de productos comprados
      total,
      tipo_cliente        // 'menudeo' o 'mayoreo'
    } = req.body;

    // Iniciar transacción para garantizar consistencia
    await conexion.beginTransaction();

    // Insertar el pedido principal
    const [resultadoPedido] = await conexion.query(
      `INSERT INTO pedidos 
        (stripe_payment_id, cliente_nombre, cliente_correo, cliente_telefono,
         direccion_envio, total, tipo_cliente, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pagado')`,
      [
        stripe_payment_id,
        cliente_nombre,
        cliente_correo,
        cliente_telefono,
        JSON.stringify(direccion_envio),
        total,
        tipo_cliente || 'menudeo'
      ]
    );

    const pedidoId = resultadoPedido.insertId;

    // Insertar cada producto del pedido y reducir stock
    for (const item of items) {
      // Guardar el item en detalle_pedidos
      await conexion.query(
        `INSERT INTO detalle_pedidos 
          (pedido_id, producto_id, cantidad, precio_unitario, talla, color)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pedidoId, item.id, item.cantidad, item.precio, item.talla || null, item.color || null]
      );

      // Reducir el stock del producto
      await conexion.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.id]
      );
    }

    // Confirmar transacción
    await conexion.commit();

    res.json({
      ok: true,
      mensaje: 'Pedido creado exitosamente',
      pedido_id: pedidoId
    });

  } catch (error) {
    // Revertir todo si algo falla
    await conexion.rollback();
    console.error('❌ Error al crear pedido:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al crear el pedido' });
  } finally {
    conexion.release();
  }
});

// --- GET /api/pedidos/:id ---
// Obtiene el detalle de un pedido por su ID (para página de confirmación)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener pedido principal
    const [pedidos] = await pool.query(
      'SELECT * FROM pedidos WHERE id = ?',
      [id]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Pedido no encontrado' });
    }

    const pedido = pedidos[0];

    // Obtener productos del pedido
    const [items] = await pool.query(
      `SELECT dp.*, p.nombre, p.imagen_principal, p.slug
       FROM detalle_pedidos dp
       JOIN productos p ON dp.producto_id = p.id
       WHERE dp.pedido_id = ?`,
      [id]
    );

    // Parsear dirección de envío
    pedido.direccion_envio = JSON.parse(pedido.direccion_envio);
    pedido.items = items;

    res.json({ ok: true, data: pedido });

  } catch (error) {
    console.error('❌ Error al obtener pedido:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener el pedido' });
  }
});

module.exports = router;