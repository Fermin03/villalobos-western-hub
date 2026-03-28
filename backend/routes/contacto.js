// ============================================================
// routes/contacto.js — Formulario de mayoreo y contacto
// Guarda solicitudes en MySQL y envía correo HTML a Villalobos
// ============================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const nodemailer = require('nodemailer');

// --- Configuración del correo (hostinger) ---
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- POST /api/contacto/mayoreo ---
// Guarda la solicitud de mayoreo y envía correo HTML
router.post('/mayoreo', async (req, res) => {
  const {
    nombre, empresa, correo, telefono,
    pais, marca, volumen, mensaje
  } = req.body;

  // Validar campos requeridos
  if (!nombre || !correo || !telefono) {
    return res.status(400).json({ ok: false, mensaje: 'Faltan campos requeridos' });
  }

  try {
    // Guardar en base de datos
    await pool.query(
      `INSERT INTO solicitudes_mayoreo 
        (nombre, empresa, correo, telefono, pais, marca, volumen, mensaje)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, empresa || null, correo, telefono, pais || 'México', marca || null, volumen || null, mensaje || null]
    );

    // HTML del correo
    const htmlCorreo = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Georgia', serif; background: #F5EFE0; margin: 0; padding: 0; }
          .wrapper { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
          .header { background: #4A3728; padding: 32px; text-align: center; }
          .header h1 { color: #F5EFE0; font-size: 26px; margin: 0; letter-spacing: 2px; }
          .header p { color: #C9A84C; font-size: 12px; letter-spacing: 4px; margin: 6px 0 0; }
          .body { padding: 32px; }
          .body h2 { color: #4A3728; font-size: 18px; margin: 0 0 20px; border-bottom: 2px solid #F5EFE0; padding-bottom: 12px; }
          .campo { margin-bottom: 16px; }
          .campo label { display: block; font-size: 11px; color: #999; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
          .campo p { margin: 0; font-size: 15px; color: #2C1E12; background: #F5EFE0; padding: 10px 14px; border-radius: 6px; }
          .mensaje-box { background: #F5EFE0; padding: 16px; border-radius: 8px; border-left: 4px solid #C9A84C; margin-top: 20px; }
          .mensaje-box p { margin: 0; color: #2C1E12; line-height: 1.6; }
          .footer { background: #4A3728; padding: 20px 32px; text-align: center; }
          .footer p { color: #F5EFE0; font-size: 12px; margin: 0; opacity: 0.7; }
          .badge { display: inline-block; background: #C9A84C; color: #4A3728; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>Villalobos Western Hats</h1>
            <p>PANEL ADMINISTRATIVO</p>
          </div>
          <div class="body">
            <span class="badge">⭐ Nueva Solicitud de Mayoreo</span>
            <h2>Datos del Solicitante</h2>

            <div class="campo">
              <label>Nombre completo</label>
              <p>${nombre}</p>
            </div>

            ${empresa ? `
            <div class="campo">
              <label>Empresa / Negocio</label>
              <p>${empresa}</p>
            </div>` : ''}

            <div class="campo">
              <label>Correo electrónico</label>
              <p>${correo}</p>
            </div>

            <div class="campo">
              <label>Teléfono</label>
              <p>${telefono}</p>
            </div>

            <div class="campo">
              <label>País</label>
              <p>${pais || 'México'}</p>
            </div>

            ${marca ? `
            <div class="campo">
              <label>Marca de interés</label>
              <p>${marca}</p>
            </div>` : ''}

            ${volumen ? `
            <div class="campo">
              <label>Volumen estimado</label>
              <p>${volumen}</p>
            </div>` : ''}

            ${mensaje ? `
            <div class="campo">
              <label>Mensaje</label>
              <div class="mensaje-box">
                <p>${mensaje}</p>
              </div>
            </div>` : ''}

          </div>
          <div class="footer">
            <p>Villalobos Western Hats — villaloboswesternhats.com</p>
            <p style="margin-top:6px;">Este correo fue generado automáticamente desde el formulario de mayoreo.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar correo
    await transporter.sendMail({
      from: `"Villalobos Western Hats" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_DESTINO,
      subject: `⭐ Nueva solicitud de mayoreo — ${nombre}`,
      html: htmlCorreo,
    });

    res.json({ ok: true, mensaje: 'Solicitud enviada correctamente' });

  } catch (error) {
    console.error('❌ Error al procesar solicitud de mayoreo:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error al enviar la solicitud' });
  }
});

module.exports = router;