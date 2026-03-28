// ============================================================
// routes/admin.js — API del panel de administración
// Rutas protegidas con JWT para gestionar el negocio
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
// MIDDLEWARE — Verificar token JWT en rutas protegidas
// ============================================================
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

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
// FUNCIÓN — Genera el HTML del correo según el estado
// ============================================================
function generarCorreoEstado(pedido, estado, numero_guia) {
  const colores = {
    pagado:     { bg: '#C9A84C', texto: 'Pago Confirmado' },
    preparando: { bg: '#3498db', texto: 'Preparando tu Pedido' },
    enviado:    { bg: '#6B7A3E', texto: 'Tu Pedido va en Camino' },
    entregado:  { bg: '#27ae60', texto: 'Pedido Entregado' },
    cancelado:  { bg: '#e74c3c', texto: 'Pedido Cancelado' },
  };

  const info = colores[estado] || { bg: '#4A3728', texto: estado };

  const mensajes = {
    pagado:     'Tu pago fue confirmado exitosamente. Pronto comenzaremos a preparar tu pedido.',
    preparando: 'Estamos preparando tu pedido con mucho cuidado. Te notificaremos cuando sea enviado.',
    enviado:    numero_guia
      ? `Tu pedido ha sido enviado. Tu número de guía es <strong>${numero_guia}</strong>. Puedes rastrear tu paquete con este número.`
      : 'Tu pedido ha sido enviado y está en camino.',
    entregado:  '¡Tu pedido fue entregado! Esperamos que disfrutes tu sombrero. Gracias por tu compra.',
    cancelado:  'Lamentamos informarte que tu pedido ha sido cancelado. Si tienes dudas, contáctanos.',
  };

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Georgia, serif; background: #F5EFE0; margin: 0; padding: 20px; }
        .wrapper { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
        .header { background: #4A3728; padding: 32px; text-align: center; }
        .header h1 { color: #F5EFE0; font-size: 26px; margin: 0; letter-spacing: 2px; }
        .header p { color: #C9A84C; font-size: 12px; letter-spacing: 4px; margin: 6px 0 0; }
        .estado-badge { background: ${info.bg}; padding: 20px 32px; text-align: center; }
        .estado-badge h2 { color: #fff; margin: 0; font-size: 22px; letter-spacing: 1px; }
        .body { padding: 32px; }
        .mensaje { font-size: 15px; color: #2C1E12; line-height: 1.7; margin-bottom: 24px; }
        .pedido-box { background: #F5EFE0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
        .pedido-box p { margin: 6px 0; font-size: 14px; color: #4A3728; }
        .pedido-box strong { color: #2C1E12; }
        .guia-box { background: #4A3728; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; text-align: center; }
        .guia-box p { color: #F5EFE0; margin: 0; font-size: 13px; }
        .guia-box strong { color: #C9A84C; font-size: 20px; letter-spacing: 3px; display: block; margin-top: 6px; }
        .cta { text-align: center; margin: 24px 0; }
        .cta a { background: #4A3728; color: #F5EFE0; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 14px; letter-spacing: 1px; }
        .footer { background: #4A3728; padding: 20px 32px; text-align: center; }
        .footer p { color: #F5EFE0; font-size: 12px; margin: 0; opacity: 0.7; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>Villalobos Western Hats</h1>
          <p>WESTERN HATS</p>
        </div>
        <div class="estado-badge">
          <h2>${info.texto}</h2>
        </div>
        <div class="body">
          <p class="mensaje">Hola <strong>${pedido.cliente_nombre}</strong>,<br><br>${mensajes[estado]}</p>
          <div class="pedido-box">
            <p><strong>Número de pedido:</strong> #${pedido.id}</p>
            <p><strong>Total:</strong> $${parseFloat(pedido.total).toLocaleString('es-MX')} MXN</p>
            <p><strong>Estado:</strong> ${info.texto}</p>
          </div>
          ${numero_guia ? `
          <div class="guia-box">
            <p>Número de guía de rastreo</p>
            <strong>${numero_guia}</strong>
          </div>` : ''}
          <div class="cta">
            <a href="https://villaloboswesternhats.com">Visitar nuestra tienda</a>
          </div>
          <p style="font-size:13px; color:#999; text-align:center;">
            ¿Tienes preguntas? Contáctanos a <a href="mailto:${process.env.EMAIL_USER}" style="color:#4A3728;">${process.env.EMAIL_USER}</a>
          </p>
        </div>
        <div class="footer">
          <p>Villalobos Western Hats — villaloboswesternhats.com</p>
          <p style="margin-top:6px;">Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ============================================================
// AUTH
// ============================================================

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

router.get('/productos', verificarToken, async (req, res) => {
  try {
    const [productos] = await pool.query('SELECT * FROM productos ORDER BY id DESC');
    res.json({ ok: true, data: productos });
  } catch (error) {
    console.error('❌ Error al obtener productos admin:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener productos' });
  }
});

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
// PEDIDOS (protegido)
// ============================================================

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

router.get('/pedidos/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [pedidos] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [id]);
    if (pedidos.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Pedido no encontrado' });
    }

    const pedido = pedidos[0];

    const [items] = await pool.query(
      `SELECT dp.*, p.nombre, p.imagen_principal
       FROM detalle_pedidos dp
       JOIN productos p ON dp.producto_id = p.id
       WHERE dp.pedido_id = ?`,
      [id]
    );

    pedido.items = items;
    if (pedido.direccion_envio) {
      try { pedido.direccion_envio = JSON.parse(pedido.direccion_envio); } catch {}
    }

    res.json({ ok: true, data: pedido });

  } catch (error) {
    console.error('❌ Error al obtener pedido:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener pedido' });
  }
});

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

    const [rows] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [id]);
    if (rows.length > 0) {
      const pedido = rows[0];

      const asuntos = {
        pagado:     `✅ Pago confirmado — Pedido #${id}`,
        preparando: `📦 Preparando tu pedido #${id}`,
        enviado:    `🚚 Tu pedido #${id} va en camino`,
        entregado:  `🎉 Pedido #${id} entregado`,
        cancelado:  `❌ Pedido #${id} cancelado`,
      };

      await transporter.sendMail({
        from: `"Villalobos Western Hats" <${process.env.EMAIL_USER}>`,
        to: pedido.cliente_correo,
        subject: asuntos[estado] || `Actualización de tu pedido #${id}`,
        html: generarCorreoEstado(pedido, estado, numero_guia),
      });

      console.log(`✅ Correo enviado a ${pedido.cliente_correo} — Estado: ${estado}`);
    }

    res.json({ ok: true, mensaje: 'Estado actualizado y correo enviado al cliente' });

  } catch (error) {
    console.error('❌ Error al actualizar estado:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar estado' });
  }
});

// ============================================================
// SOLICITUDES DE MAYOREO (protegido)
// ============================================================

router.get('/mayoreo', verificarToken, async (req, res) => {
  try {
    const [solicitudes] = await pool.query(
      'SELECT * FROM solicitudes_mayoreo ORDER BY created_at DESC'
    );
    res.json({ ok: true, data: solicitudes });
  } catch (error) {
    console.error('❌ Error al obtener solicitudes:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener solicitudes' });
  }
});

// ============================================================
// ADMINISTRADORES (protegido)
// ============================================================

// --- GET /api/admin/admins ---
router.get('/admins', verificarToken, async (req, res) => {
  try {
    const [admins] = await pool.query(
      'SELECT id, nombre, correo, activo, created_at FROM admins ORDER BY id ASC'
    );
    res.json({ ok: true, data: admins });
  } catch (error) {
    console.error('❌ Error al obtener admins:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener administradores' });
  }
});

// --- POST /api/admin/admins ---
router.post('/admins', verificarToken, async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ ok: false, mensaje: 'Faltan campos requeridos' });
    }

    // Verificar que el correo no exista
    const [existe] = await pool.query('SELECT id FROM admins WHERE correo = ?', [correo]);
    if (existe.length > 0) {
      return res.status(400).json({ ok: false, mensaje: 'Ya existe un admin con ese correo' });
    }

    // Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const [resultado] = await pool.query(
      'INSERT INTO admins (nombre, correo, password_hash, activo) VALUES (?, ?, ?, 1)',
      [nombre, correo, password_hash]
    );

    res.json({ ok: true, mensaje: 'Administrador creado', id: resultado.insertId });

  } catch (error) {
    console.error('❌ Error al crear admin:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al crear administrador' });
  }
});

// --- PUT /api/admin/admins/:id ---
router.put('/admins/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    await pool.query('UPDATE admins SET activo = ? WHERE id = ?', [activo ? 1 : 0, id]);
    res.json({ ok: true, mensaje: 'Administrador actualizado' });

  } catch (error) {
    console.error('❌ Error al actualizar admin:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar administrador' });
  }
});

module.exports = router;