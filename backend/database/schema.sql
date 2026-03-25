-- ============================================================
-- database/schema.sql — Estructura de la base de datos
-- Villalobos Western Hats — Ejecutar en Hostinger hPanel
-- ============================================================

-- Usar la base de datos correcta
-- (Cambia 'tu_nombre_bd' por el nombre real que creaste en Hostinger)

-- ============================================================
-- TABLA: productos
-- ============================================================
CREATE TABLE IF NOT EXISTS productos (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(255) NOT NULL,
  slug              VARCHAR(255) NOT NULL UNIQUE,  -- URL amigable ej: sombrero-rodeo-cafe
  marca             VARCHAR(100) NOT NULL,          -- Rocha Hats, Villalobos Hats, etc.
  categoria         VARCHAR(100) NOT NULL,          -- sombreros, accesorios, etc.
  precio            DECIMAL(10,2) NOT NULL,
  precio_mayoreo    DECIMAL(10,2) DEFAULT NULL,     -- Precio especial para mayoristas
  stock             INT NOT NULL DEFAULT 0,
  imagen_principal  VARCHAR(500) NOT NULL,          -- URL de imagen principal
  imagenes          JSON DEFAULT NULL,              -- Array de URLs adicionales
  descripcion       TEXT DEFAULT NULL,
  tallas            JSON DEFAULT NULL,              -- ["55","56","57","58","59","60"]
  colores           JSON DEFAULT NULL,              -- ["cafe","negro","beige"]
  destacado         TINYINT(1) DEFAULT 0,           -- 1 = aparece en homepage
  activo            TINYINT(1) DEFAULT 1,           -- 0 = oculto del catálogo
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: pedidos
-- ============================================================
CREATE TABLE IF NOT EXISTS pedidos (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  stripe_payment_id   VARCHAR(255) NOT NULL UNIQUE, -- ID del Payment Intent de Stripe
  cliente_nombre      VARCHAR(255) NOT NULL,
  cliente_correo      VARCHAR(255) NOT NULL,
  cliente_telefono    VARCHAR(20) DEFAULT NULL,
  direccion_envio     JSON NOT NULL,                -- Objeto con calle, ciudad, estado, cp, pais
  total               DECIMAL(10,2) NOT NULL,
  tipo_cliente        ENUM('menudeo','mayoreo') DEFAULT 'menudeo',
  estado              ENUM('pagado','preparando','enviado','entregado','cancelado') DEFAULT 'pagado',
  numero_guia         VARCHAR(100) DEFAULT NULL,    -- Número de guía de envío
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: detalle_pedidos
-- ============================================================
CREATE TABLE IF NOT EXISTS detalle_pedidos (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id        INT NOT NULL,
  producto_id      INT NOT NULL,
  cantidad         INT NOT NULL,
  precio_unitario  DECIMAL(10,2) NOT NULL,          -- Precio al momento de la compra
  talla            VARCHAR(20) DEFAULT NULL,
  color            VARCHAR(50) DEFAULT NULL,
  FOREIGN KEY (pedido_id)   REFERENCES pedidos(id)   ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);

-- ============================================================
-- TABLA: admins
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(255) NOT NULL,
  correo         VARCHAR(255) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,             -- Hash bcrypt, nunca texto plano
  activo         TINYINT(1) DEFAULT 1,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- DATOS INICIALES: Admin por defecto
-- Password: VillalobosAdmin2024 (cámbiala después del primer login)
-- Hash generado con bcrypt rounds=10
-- ============================================================
INSERT INTO admins (nombre, correo, password_hash) VALUES (
  'Administrador',
  'admin@villaloboswestern.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);