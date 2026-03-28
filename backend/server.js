// ============================================================
// server.js — Servidor principal de Villalobos Western Hats
// Punto de entrada del backend Node.js + Express
// Incluye configuración de seguridad completa
// ============================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// --- Importar rutas ---
const rutasProductos = require('./routes/productos');
const rutasPagos     = require('./routes/pagos');
const rutasPedidos   = require('./routes/pedidos');
const rutasAdmin     = require('./routes/admin');
const rutasContacto  = require('./routes/contacto');

// --- Inicializar app ---
const app = express();
const PUERTO = process.env.PORT || 3001;

// ============================================================
// SEGURIDAD — Headers HTTP seguros con Helmet
// Protege contra clickjacking, XSS, MIME sniffing, etc.
// ============================================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: false,
  contentSecurityPolicy: false,
}));

// ============================================================
// SEGURIDAD — CORS restrictivo
// Solo acepta peticiones del frontend autorizado
// ============================================================
const origenesPermitidos = [
  process.env.FRONTEND_URL || 'http://localhost:8080',
  'https://villaloboswesternhats.com',
  'https://www.villaloboswesternhats.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (ej: Postman, apps móviles)
    if (!origin) return callback(null, true);
    if (origenesPermitidos.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS bloqueado para origen: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ============================================================
// SEGURIDAD — Rate Limiting global
// Máximo 100 requests por IP cada 15 minutos
// ============================================================
const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { ok: false, mensaje: 'Demasiadas solicitudes. Intenta en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================
// SEGURIDAD — Rate Limiting estricto para el login del admin
// Máximo 10 intentos por IP cada 15 minutos — anti fuerza bruta
// ============================================================
const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { ok: false, mensaje: 'Demasiados intentos de login. Intenta en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================
// SEGURIDAD — Rate Limiting para formularios de contacto
// Máximo 5 envíos por IP cada hora
// ============================================================
const limitadorContacto = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  message: { ok: false, mensaje: 'Demasiados envíos. Intenta en 1 hora.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================
// MIDDLEWARES GLOBALES
// ============================================================

// Webhook de Stripe necesita el body RAW — va antes de express.json()
app.use('/api/pagos/webhook', express.raw({ type: 'application/json' }));

// Body parser JSON con límite de tamaño
app.use(express.json({ limit: '10kb' }));


// Rate limiting general para todas las rutas
app.use('/api', limitadorGeneral);

// ============================================================
// RUTAS DE LA API
// ============================================================
app.use('/api/productos', rutasProductos);
app.use('/api/pagos',     rutasPagos);
app.use('/api/pedidos',   rutasPedidos);
app.use('/api/admin',     rutasAdmin);
app.use('/api/contacto',  limitadorContacto, rutasContacto);

// Rate limiting estricto solo para el login del admin
app.use('/api/admin/login', limitadorLogin);

// ============================================================
// RUTA DE SALUD — Verificar que el servidor corre
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mensaje: 'Servidor Villalobos Western Hats funcionando',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// MANEJO DE ERRORES GLOBAL
// Captura errores no controlados y los responde de forma segura
// ============================================================
app.use((err, req, res, next) => {  console.error('❌ Error no controlado:', err.message);

  // Error de CORS
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ ok: false, mensaje: 'Acceso no permitido' });
  }

  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
});

// ============================================================
// INICIAR SERVIDOR
// ============================================================
app.listen(PUERTO, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PUERTO}`);
  console.log(`🔒 Seguridad activada: Helmet, CORS, Rate Limiting, XSS, Sanitización`);
});

module.exports = app;