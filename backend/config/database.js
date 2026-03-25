// ============================================================
// config/database.js — Configuración de conexión a MySQL
// Gestiona el pool de conexiones a la base de datos Hostinger
// ============================================================

const mysql = require('mysql2/promise');

// --- Pool de conexiones (más eficiente que conexión individual) ---
const pool = mysql.createPool({
  host:     process.env.DB_HOST,      // Servidor MySQL de Hostinger
  user:     process.env.DB_USER,      // Usuario de la base de datos
  password: process.env.DB_PASSWORD,  // Contraseña de la base de datos
  database: process.env.DB_NAME,      // Nombre de la base de datos
  port:     process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,                // Máximo de conexiones simultáneas
  queueLimit: 0
});

// --- Función para verificar la conexión al iniciar el servidor ---
async function verificarConexion() {
  try {
    const conexion = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    conexion.release(); // Liberar la conexión de vuelta al pool
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
    process.exit(1); // Detener el servidor si no hay base de datos
  }
}

verificarConexion();

module.exports = pool;