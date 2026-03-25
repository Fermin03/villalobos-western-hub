// ============================================================
// routes/pagos.js — API de pagos con Stripe
// Soporta: Tarjeta (débito/crédito), OXXOPay, Apple Pay, Google Pay
// ============================================================

const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const pool = require('../config/database');

// --- POST /api/pagos/crear-intento ---
// Crea un Payment Intent en Stripe y devuelve el clientSecret al frontend
router.post('/crear-intento', async (req, res) => {
  try {
    const { items, correo, tipo_cliente, metodo_pago } = req.body;

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

      // Usar precio mayoreo si aplica
      const precio = (tipo_cliente === 'mayoreo' && producto.precio_mayoreo)
        ? producto.precio_mayoreo
        : producto.precio;

      total += precio * item.cantidad;
    }

    // Stripe maneja montos en centavos
    const totalCentavos = Math.round(total * 100);

    // ── Determinar métodos de pago según lo que solicita el frontend ──
    // OXXO requiere su propio payment_method_types exclusivo (no se mezcla con card)
    let paymentMethodTypes;

    if (metodo_pago === 'oxxo') {
      paymentMethodTypes = ['oxxo'];
    } else {
      // Tarjeta: soporta card (incluye Apple Pay y Google Pay en el frontend)
      paymentMethodTypes = ['card'];
    }

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCentavos,
      currency: 'mxn',
      payment_method_types: paymentMethodTypes,
      receipt_email: correo || undefined,

      // OXXO requiere estos datos para generar el voucher
      ...(metodo_pago === 'oxxo' && {
        payment_method_options: {
          oxxo: {
            expires_after_days: 3, // El voucher vence en 3 días
          },
        },
      }),

      metadata: {
        tipo_cliente: tipo_cliente || 'menudeo',
        metodo_pago: metodo_pago || 'card',
        num_productos: items.length.toString(),
      },
    });

    res.json({
      ok: true,
      clientSecret: paymentIntent.client_secret,
      total: total,
      metodo_pago: metodo_pago || 'card',
    });

  } catch (error) {
    console.error('❌ Error al crear Payment Intent:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al procesar el pago' });
  }
});

// --- POST /api/pagos/webhook ---
// Recibe eventos de Stripe (pago confirmado, fallido, OXXO pagado, etc.)
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

  // Pago con tarjeta exitoso
  if (evento.type === 'payment_intent.succeeded') {
    const paymentIntent = evento.data.object;
    console.log(`✅ Pago exitoso: ${paymentIntent.id}`);

    // Actualizar pedido a 'pagado' si existe en la BD
    try {
      await pool.query(
        "UPDATE pedidos SET estado = 'pagado' WHERE stripe_payment_id = ?",
        [paymentIntent.id]
      );
    } catch (err) {
      console.error('❌ Error al actualizar pedido tras webhook:', err.message);
    }
  }

  // OXXO pagado en tienda — Stripe notifica cuando el cliente pagó en OXXO
  if (evento.type === 'payment_intent.payment_failed') {
    const paymentIntent = evento.data.object;
    console.log(`❌ Pago fallido: ${paymentIntent.id}`);
  }

  // OXXO: voucher generado y pendiente de pago
  if (evento.type === 'payment_intent.requires_action') {
    const paymentIntent = evento.data.object;
    if (paymentIntent.payment_method_types?.includes('oxxo')) {
      console.log(`🏪 Voucher OXXO generado: ${paymentIntent.id}`);
    }
  }

  res.json({ recibido: true });
});

module.exports = router;