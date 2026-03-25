// ============================================================
// config/stripe.js — Configuración de Stripe
// Inicializa el cliente de Stripe con la llave secreta
// ============================================================

const Stripe = require('stripe');

// --- Verificar que la llave de Stripe esté definida ---
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY no está definida en .env');
  process.exit(1);
}

// --- Inicializar cliente de Stripe ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20', // Versión fija para evitar cambios inesperados
});

console.log('✅ Stripe inicializado correctamente');

module.exports = stripe;