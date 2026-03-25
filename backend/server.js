// ============================================================
// server.js — Servidor principal de Villalobos Western Hats
// Punto de entrada del backend Node.js + Express
// ============================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// --- Importar rutas ---
const rutasProductos = require('./routes/productos');
const rutasPagos = require('./routes/pagos');
const rutasPedidos = require('./routes/pedidos');
const rutasAdmin = require('./routes/admin');

// --- Inicializar app ---
const app = express();
const PUERTO = process.env.PORT || 3001;

// --- Middlewares globales ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// --- Rutas de la API ---
app.use('/api/productos', rutasProductos);
app.use('/api/pagos', rutasPagos);
app.use('/api/pedidos', rutasPedidos);
app.use('/api/admin', rutasAdmin);

// --- Ruta de prueba para verificar que el servidor corre ---
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mensaje: 'Servidor Villalobos Western Hats funcionando',
    timestamp: new Date().toISOString()
  });
});

// --- Iniciar servidor ---
app.listen(PUERTO, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PUERTO}`);
});

module.exports = app;