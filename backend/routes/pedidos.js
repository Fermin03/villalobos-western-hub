// ============================================================
// routes/pedidos.js — API de pedidos
// Crea y consulta pedidos después de un pago exitoso
// Envía correo HTML de confirmación al cliente automáticamente
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const nodemailer = require('nodemailer');

// --- Configuración del correo Hostinger ---
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ============================================================
// FUNCIÓN — Genera el HTML del correo de confirmación de compra
// ============================================================
function generarCorreoConfirmacion(pedido, items, direccion) {
  // Generar filas de productos
  const filasProductos = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #EDE5D0;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div>
            <p style="margin: 0 0 4px; font-size: 14px; color: #2C1E12; font-weight: 600;">${item.nombre}</p>
            ${item.talla ? `<p style="margin: 0; font-size: 12px; color: #999;">Talla: ${item.talla}</p>` : ''}
            ${item.color ? `<p style="margin: 0; font-size: 12px; color: #999;">Color: ${item.color}</p>` : ''}
          </div>
        </div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #EDE5D0; text-align: center; font-size: 14px; color: #4A3728;">
        x${item.cantidad}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #EDE5D0; text-align: right; font-size: 14px; font-weight: 600; color: #4A3728;">
        $${(parseFloat(item.precio) * item.cantidad).toLocaleString('es-MX')} MXN
      </td>
    </tr>
  `).join('');

  // Formatear dirección
  const direccionTexto = typeof direccion === 'object'
    ? `${direccion.calle || ''} ${direccion.numero || ''}, ${direccion.colonia || ''}, ${direccion.ciudad || ''}, ${direccion.estado || ''} ${direccion.cp || ''}, ${direccion.pais || ''}`
    : direccion || 'Por confirmar';

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de compra — Villalobos Western Hats</title>
    </head>
    <body style="margin: 0; padding: 0; background: #F5EFE0; font-family: Georgia, 'Times New Roman', serif;">

      <div style="max-width: 620px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 40px rgba(74,55,40,0.15);">

        <!-- HEADER -->
        <div style="background: #4A3728; padding: 40px 40px 32px; text-align: center;">
          <p style="margin: 0 0 8px; color: #C9A84C; font-size: 11px; letter-spacing: 6px; text-transform: uppercase; font-family: 'Helvetica Neue', Arial, sans-serif;">Distribuidor Oficial</p>
          <h1 style="margin: 0 0 4px; color: #F5EFE0; font-size: 32px; font-weight: 700; letter-spacing: 2px;">Villalobos</h1>
          <p style="margin: 0; color: #C9A84C; font-size: 13px; letter-spacing: 8px; font-family: 'Helvetica Neue', Arial, sans-serif;">WESTERN HATS</p>
        </div>

        <!-- BANNER DE CONFIRMACIÓN -->
        <div style="background: #6B7A3E; padding: 20px 40px; text-align: center;">
          <p style="margin: 0; color: #fff; font-size: 16px; letter-spacing: 1px; font-family: 'Helvetica Neue', Arial, sans-serif;">
            ✅ &nbsp; ¡Tu pedido fue confirmado exitosamente!
          </p>
        </div>

        <!-- CUERPO -->
        <div style="padding: 40px;">

          <!-- Saludo -->
          <p style="margin: 0 0 8px; font-size: 22px; color: #2C1E12; font-weight: 700;">
            ¡Gracias por tu compra, ${pedido.cliente_nombre.split(' ')[0]}!
          </p>
          <p style="margin: 0 0 32px; font-size: 15px; color: #666; line-height: 1.6; font-family: 'Helvetica Neue', Arial, sans-serif;">
            Hemos recibido tu pedido y lo estamos procesando. Te notificaremos por correo cuando tu sombrero esté en camino.
          </p>

          <!-- Número de pedido -->
          <div style="background: #F5EFE0; border-radius: 12px; padding: 20px 24px; margin-bottom: 32px; border-left: 4px solid #C9A84C;">
            <p style="margin: 0 0 4px; font-size: 11px; color: #999; letter-spacing: 3px; text-transform: uppercase; font-family: 'Helvetica Neue', Arial, sans-serif;">Número de pedido</p>
            <p style="margin: 0; font-size: 28px; font-weight: 700; color: #4A3728; letter-spacing: 2px;">#${pedido.pedido_id}</p>
          </div>

          <!-- Productos -->
          <p style="margin: 0 0 16px; font-size: 13px; color: #999; letter-spacing: 3px; text-transform: uppercase; font-family: 'Helvetica Neue', Arial, sans-serif;">Resumen de tu pedido</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <thead>
              <tr style="border-bottom: 2px solid #4A3728;">
                <th style="text-align: left; padding: 8px 0; font-size: 12px; color: #999; font-weight: 500; font-family: 'Helvetica Neue', Arial, sans-serif; letter-spacing: 1px; text-transform: uppercase;">Producto</th>
                <th style="text-align: center; padding: 8px 0; font-size: 12px; color: #999; font-weight: 500; font-family: 'Helvetica Neue', Arial, sans-serif; letter-spacing: 1px; text-transform: uppercase;">Cant.</th>
                <th style="text-align: right; padding: 8px 0; font-size: 12px; color: #999; font-weight: 500; font-family: 'Helvetica Neue', Arial, sans-serif; letter-spacing: 1px; text-transform: uppercase;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${filasProductos}
            </tbody>
          </table>

          <!-- Total -->
          <div style="background: #4A3728; border-radius: 8px; padding: 16px 20px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #F5EFE0; font-size: 14px; letter-spacing: 2px; font-family: 'Helvetica Neue', Arial, sans-serif; text-transform: uppercase;">Total pagado</span>
            <span style="color: #C9A84C; font-size: 22px; font-weight: 700;">${parseFloat(pedido.total).toLocaleString('es-MX')} MXN</span>
          </div>

          <!-- Dirección de envío -->
          <div style="margin-bottom: 32px;">
            <p style="margin: 0 0 12px; font-size: 13px; color: #999; letter-spacing: 3px; text-transform: uppercase; font-family: 'Helvetica Neue', Arial, sans-serif;">Dirección de envío</p>
            <div style="background: #F5EFE0; border-radius: 8px; padding: 16px 20px;">
              <p style="margin: 0; font-size: 14px; color: #4A3728; line-height: 1.6; font-family: 'Helvetica Neue', Arial, sans-serif;">${direccionTexto}</p>
            </div>
          </div>

          <!-- Pasos siguientes -->
          <div style="margin-bottom: 32px;">
            <p style="margin: 0 0 16px; font-size: 13px; color: #999; letter-spacing: 3px; text-transform: uppercase; font-family: 'Helvetica Neue', Arial, sans-serif;">¿Qué sigue?</p>
            <div style="display: flex; flex-direction: column; gap: 12px;">

              <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #C9A84C; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; text-align: center; line-height: 32px;">1</div>
                <div>
                  <p style="margin: 0 0 2px; font-size: 14px; font-weight: 600; color: #2C1E12;">Preparando tu pedido</p>
                  <p style="margin: 0; font-size: 13px; color: #999; font-family: 'Helvetica Neue', Arial, sans-serif;">Estamos seleccionando y empacando tu sombrero con cuidado.</p>
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #EDE5D0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; text-align: center; line-height: 32px; color: #999;">2</div>
                <div>
                  <p style="margin: 0 0 2px; font-size: 14px; font-weight: 600; color: #2C1E12;">Envío</p>
                  <p style="margin: 0; font-size: 13px; color: #999; font-family: 'Helvetica Neue', Arial, sans-serif;">Te enviaremos el número de guía para rastrear tu paquete.</p>
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #EDE5D0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; text-align: center; line-height: 32px; color: #999;">3</div>
                <div>
                  <p style="margin: 0 0 2px; font-size: 14px; font-weight: 600; color: #2C1E12;">Entrega</p>
                  <p style="margin: 0; font-size: 13px; color: #999; font-family: 'Helvetica Neue', Arial, sans-serif;">Tu sombrero llegará a la dirección indicada.</p>
                </div>
              </div>

            </div>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="https://villaloboswesternhats.com/catalogo" style="display: inline-block; background: #4A3728; color: #F5EFE0; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-size: 14px; letter-spacing: 2px; font-family: 'Helvetica Neue', Arial, sans-serif; text-transform: uppercase;">
              Seguir comprando
            </a>
          </div>

          <!-- Contacto -->
          <div style="border-top: 1px solid #EDE5D0; padding-top: 24px; text-align: center;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #999; font-family: 'Helvetica Neue', Arial, sans-serif;">¿Tienes alguna pregunta sobre tu pedido?</p>
            <a href="mailto:${process.env.EMAIL_USER}" style="color: #4A3728; font-size: 14px; font-weight: 600; text-decoration: none;">${process.env.EMAIL_USER}</a>
          </div>

        </div>

        <!-- FOOTER -->
        <div style="background: #4A3728; padding: 28px 40px; text-align: center;">
          <p style="margin: 0 0 6px; color: #C9A84C; font-size: 16px; letter-spacing: 3px; font-family: 'Helvetica Neue', Arial, sans-serif;">VILLALOBOS WESTERN HATS</p>
          <p style="margin: 0 0 16px; color: #F5EFE0; font-size: 12px; opacity: 0.6; font-family: 'Helvetica Neue', Arial, sans-serif;">Distribuidor oficial · México · EUA · Canadá</p>
          <div style="display: flex; justify-content: center; gap: 24px;">
            <a href="https://villaloboswesternhats.com" style="color: #C9A84C; font-size: 12px; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif;">Tienda</a>
            <a href="https://villaloboswesternhats.com/mayoreo" style="color: #C9A84C; font-size: 12px; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif;">Mayoreo</a>
            <a href="https://villaloboswesternhats.com/contacto" style="color: #C9A84C; font-size: 12px; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif;">Contacto</a>
          </div>
          <p style="margin: 16px 0 0; color: #F5EFE0; font-size: 11px; opacity: 0.4; font-family: 'Helvetica Neue', Arial, sans-serif;">Este correo fue generado automáticamente. Por favor no respondas a este mensaje.</p>
        </div>

      </div>
    </body>
    </html>
  `;
}

// ============================================================
// POST /api/pedidos — Crea un nuevo pedido
// ============================================================
router.post('/', async (req, res) => {
  const conexion = await pool.getConnection();

  try {
    const {
      stripe_payment_id,
      cliente_nombre,
      cliente_correo,
      cliente_telefono,
      direccion_envio,
      items,
      total,
      tipo_cliente
    } = req.body;

    // Iniciar transacción
    await conexion.beginTransaction();

    // Insertar pedido principal
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

    // Insertar productos y reducir stock
    for (const item of items) {
      await conexion.query(
        `INSERT INTO detalle_pedidos 
          (pedido_id, producto_id, cantidad, precio_unitario, talla, color)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pedidoId, item.id, item.cantidad, item.precio, item.talla || null, item.color || null]
      );

      await conexion.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.id]
      );
    }

    // Confirmar transacción
    await conexion.commit();

    // Enviar correo de confirmación al cliente
    try {
      await transporter.sendMail({
        from: `"Villalobos Western Hats" <${process.env.EMAIL_USER}>`,
        to: cliente_correo,
        subject: `✅ Pedido confirmado #${pedidoId} — Villalobos Western Hats`,
        html: generarCorreoConfirmacion(
          { cliente_nombre, total, pedido_id: pedidoId },
          items,
          direccion_envio
        ),
      });
      console.log(`✅ Correo de confirmación enviado a ${cliente_correo}`);
    } catch (errorCorreo) {
      // Si falla el correo no afecta el pedido
      console.error('⚠️ Error al enviar correo de confirmación:', errorCorreo.message);
    }

    res.json({
      ok: true,
      mensaje: 'Pedido creado exitosamente',
      pedido_id: pedidoId
    });

  } catch (error) {
    await conexion.rollback();
    console.error('❌ Error al crear pedido:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al crear el pedido' });
  } finally {
    conexion.release();
  }
});

// ============================================================
// GET /api/pedidos/:id — Obtiene detalle de un pedido
// ============================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [pedidos] = await pool.query(
      'SELECT * FROM pedidos WHERE id = ?',
      [id]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Pedido no encontrado' });
    }

    const pedido = pedidos[0];

    const [items] = await pool.query(
      `SELECT dp.*, p.nombre, p.imagen_principal, p.slug
       FROM detalle_pedidos dp
       JOIN productos p ON dp.producto_id = p.id
       WHERE dp.pedido_id = ?`,
      [id]
    );

    pedido.direccion_envio = JSON.parse(pedido.direccion_envio);
    pedido.items = items;

    res.json({ ok: true, data: pedido });

  } catch (error) {
    console.error('❌ Error al obtener pedido:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener el pedido' });
  }
});

module.exports = router;