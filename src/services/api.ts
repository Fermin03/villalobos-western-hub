// ============================================================
// src/services/api.ts — Cliente HTTP para conectar con el backend
// Todas las llamadas al API de Villalobos Western Hats pasan por aquí
// ============================================================

// URL base del backend — en desarrollo apunta a localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ============================================================
// PRODUCTOS
// ============================================================

// Obtiene todos los productos activos, con filtros opcionales
export async function obtenerProductos(filtros?: {
  marca?: string;
  categoria?: string;
  orden?: string;
}) {
  const params = new URLSearchParams();
  if (filtros?.marca)     params.append('marca', filtros.marca);
  if (filtros?.categoria) params.append('categoria', filtros.categoria);
  if (filtros?.orden)     params.append('orden', filtros.orden);

  const respuesta = await fetch(`${API_URL}/productos?${params.toString()}`);
  const datos = await respuesta.json();

  if (!datos.ok) throw new Error(datos.mensaje);
  return datos.data;
}

// Obtiene un producto individual por su slug
export async function obtenerProducto(slug: string) {
  const respuesta = await fetch(`${API_URL}/productos/${slug}`);
  const datos = await respuesta.json();

  if (!datos.ok) throw new Error(datos.mensaje);
  return datos.data;
}

// ============================================================
// PAGOS
// ============================================================

// Crea un Payment Intent en Stripe y devuelve el clientSecret
export async function crearIntentoPago(payload: {
  items: { id: number; cantidad: number }[];
  correo: string;
  tipo_cliente?: string;
}) {
  const respuesta = await fetch(`${API_URL}/pagos/crear-intento`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const datos = await respuesta.json();

  if (!datos.ok) throw new Error(datos.mensaje);
  return datos;
}

// ============================================================
// PEDIDOS
// ============================================================

// Crea un pedido después de confirmar el pago
export async function crearPedido(payload: {
  stripe_payment_id: string;
  cliente_nombre: string;
  cliente_correo: string;
  cliente_telefono?: string;
  direccion_envio: object;
  items: object[];
  total: number;
  tipo_cliente?: string;
}) {
  const respuesta = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const datos = await respuesta.json();

  if (!datos.ok) throw new Error(datos.mensaje);
  return datos;
}

// Obtiene el detalle de un pedido por ID (para página de confirmación)
export async function obtenerPedido(id: number) {
  const respuesta = await fetch(`${API_URL}/pedidos/${id}`);
  const datos = await respuesta.json();

  if (!datos.ok) throw new Error(datos.mensaje);
  return datos.data;
}