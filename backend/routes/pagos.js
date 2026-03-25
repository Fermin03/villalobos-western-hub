// ============================================================
// routes/pagos.js — API de pagos con Stripe
// Crea Payment Intents y confirma transacciones
// ============================================================

const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const pool = require('../config/database');

// --- POST /api/pagos/crear-intento ---
// Crea un Payment Intent en Stripe y devuelve el clientSecret al frontend
router.post('/crear-intento', async (req, res) => {
  try {
    const { items, correo, tipo_cliente } = req.body;

    // Validar que vengan productos
    if (!items || items.length === 0) {
      return res.status(400).json({ ok: false, mensaje: 'No hay productos en el carrito' });
    }

    // Calcular total desde la base de datos (nunca confiar en precios del frontend)
    let total = 0;
    for (const item of items) {
      const [rows] = await pool.query(
        'SELECT precio, precio_mayoreo, stock FROM productos WHERE id = ? AND activo = 1',
        [item.id]
      );

      if (rows.length === 0) {
        return res.status(400).json({ ok: false, mensaje: `Producto ${item.id} no encontrado` });
      }

      const producto = rows[0];

      // Verificar stock disponible
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ ok: false, mensaje: `Stock insuficiente para producto ${item.id}` });
      }

      // Usar precio mayoreo si aplica (más de 6 piezas)
      const precio = (tipo_cliente === 'mayoreo' && producto.precio_mayoreo)
        ? producto.precio_mayoreo
        : producto.precio;

      total += precio * item.cantidad;
    }

    // Stripe maneja montos en centavos
    const totalCentavos = Math.round(total * 100);

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCentavos,
      currency: 'mxn',               // Pesos mexicanos
      receipt_email: correo,
      metadata: {
        tipo_cliente: tipo_cliente || 'menudeo',
        num_productos: items.length.toString()
      }
    });

    res.json({
      ok: true,
      clientSecret: paymentIntent.client_secret,
      total: total
    });

  } catch (error) {
    console.error('❌ Error al crear Payment Intent:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al procesar el pago' });
  }
});

// --- POST /api/pagos/webhook ---
// Recibe eventos de Stripe (pago confirmado, fallido, etc.)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let evento;

  try {
    evento = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('❌ Webhook inválido:', error.message);
    return res.status(400).json({ mensaje: `Webhook Error: ${error.message}` });
  }

  // Manejar evento de pago exitoso
  if (evento.type === 'payment_intent.succeeded') {
    const paymentIntent = evento.data.object;
    console.log(`✅ Pago exitoso: ${paymentIntent.id}`);
    // Aquí se actualiza el pedido en la base de datos (lo conectamos desde pedidos.js)
  }

  res.json({ recibido: true });
});

module.exports = router;