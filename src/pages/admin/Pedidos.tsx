// ============================================================
// src/pages/admin/Pedidos.tsx — Gestión de pedidos
// Lista pedidos, permite ver detalle y actualizar estado
// Envía correo HTML automático al cliente en cada cambio
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function AdminPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [numeroGuia, setNumeroGuia] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // --- Verificar autenticación ---
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin'); return; }
    cargarPedidos(token);
  }, []);

  // --- Carga todos los pedidos ---
  async function cargarPedidos(token?: string) {
    const t = token || localStorage.getItem('admin_token') || '';
    try {
      const res = await fetch(`${API_URL}/admin/pedidos`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      const datos = await res.json();
      if (datos.ok) setPedidos(datos.data);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
    } finally {
      setCargando(false);
    }
  }

  // --- Carga detalle de un pedido ---
  async function verDetalle(id: number) {
    setCargandoDetalle(true);
    const token = localStorage.getItem('admin_token') || '';
    try {
      const res = await fetch(`${API_URL}/admin/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const datos = await res.json();
      if (datos.ok) {
        setPedidoSeleccionado(datos.data);
        setNumeroGuia(datos.data.numero_guia || '');
      }
    } catch (err) {
      console.error('Error al cargar detalle:', err);
    } finally {
      setCargandoDetalle(false);
    }
  }

  // --- Actualiza estado del pedido y envía correo ---
  async function actualizarEstado(id: number, estado: string) {
    setActualizando(id);
    const token = localStorage.getItem('admin_token') || '';

    try {
      const res = await fetch(`${API_URL}/admin/pedidos/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado, numero_guia: numeroGuia }),
      });

      const datos = await res.json();

      if (datos.ok) {
        setMensaje(`✅ Pedido #${id} actualizado a "${estado}" — correo enviado al cliente`);
        cargarPedidos();
        if (pedidoSeleccionado?.id === id) {
          verDetalle(id);
        }
        setTimeout(() => setMensaje(''), 4000);
      } else {
        setMensaje(`❌ ${datos.mensaje}`);
      }
    } catch (err) {
      setMensaje('❌ Error de conexión');
    } finally {
      setActualizando(null);
    }
  }

  // --- Color por estado ---
  function colorEstado(estado: string) {
    const colores: Record<string, { bg: string; texto: string }> = {
      pagado:     { bg: '#C9A84C', texto: '#fff' },
      preparando: { bg: '#3498db', texto: '#fff' },
      enviado:    { bg: '#6B7A3E', texto: '#fff' },
      entregado:  { bg: '#27ae60', texto: '#fff' },
      cancelado:  { bg: '#e74c3c', texto: '#fff' },
    };
    return colores[estado] || { bg: '#999', texto: '#fff' };
  }

  // --- Filtrar pedidos por estado ---
  const pedidosFiltrados = filtroEstado === 'todos'
    ? pedidos
    : pedidos.filter(p => p.estado === filtroEstado);

  const estilos = {
    badge: (estado: string) => ({
      background: colorEstado(estado).bg,
      color: colorEstado(estado).texto,
      padding: '3px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      display: 'inline-block',
    }),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5EFE0', fontFamily: 'Jost, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#4A3728', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#F5EFE0', fontFamily: 'Playfair Display, serif', margin: 0, fontSize: '22px' }}>
          Villalobos Admin — Pedidos
        </h1>
        <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'transparent', border: '1px solid #C9A84C', color: '#C9A84C', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}>
          ← Dashboard
        </button>
      </header>

      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: pedidoSeleccionado ? '1fr 400px' : '1fr', gap: '24px' }}>

        {/* Columna izquierda — Lista de pedidos */}
        <div>

          {/* Mensaje */}
          {mensaje && (
            <div style={{ background: '#fff', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              {mensaje}
            </div>
          )}

          {/* Filtros por estado */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {['todos', 'pagado', 'preparando', 'enviado', 'entregado', 'cancelado'].map(estado => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: filtroEstado === estado ? 600 : 400,
                  background: filtroEstado === estado
                    ? (estado === 'todos' ? '#4A3728' : colorEstado(estado).bg)
                    : '#fff',
                  color: filtroEstado === estado ? '#fff' : '#4A3728',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                }}
              >
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                {estado !== 'todos' && (
                  <span style={{ marginLeft: '6px', opacity: 0.8 }}>
                    ({pedidos.filter(p => p.estado === estado).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tabla de pedidos */}
          <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #F5EFE0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#4A3728', fontFamily: 'Playfair Display, serif', margin: 0, fontSize: '18px' }}>
                {filtroEstado === 'todos' ? `Todos los Pedidos (${pedidos.length})` : `${filtroEstado.charAt(0).toUpperCase() + filtroEstado.slice(1)} (${pedidosFiltrados.length})`}
              </h2>
            </div>

            {cargando ? (
              <p style={{ color: '#999', padding: '24px', textAlign: 'center' }}>Cargando pedidos...</p>
            ) : pedidosFiltrados.length === 0 ? (
              <p style={{ color: '#999', padding: '24px', textAlign: 'center' }}>No hay pedidos con este estado.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F5EFE0' }}>
                      {['#', 'Cliente', 'Total', 'Tipo', 'Estado', 'Fecha', 'Acciones'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#999', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosFiltrados.map((p: any) => (
                      <tr
                        key={p.id}
                        style={{
                          borderBottom: '1px solid #F5EFE0',
                          background: pedidoSeleccionado?.id === p.id ? '#FDF8F0' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}
                        onClick={() => verDetalle(p.id)}
                      >
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#999' }}>#{p.id}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#4A3728', fontWeight: 500 }}>
                          {p.cliente_nombre}
                          <div style={{ fontSize: '12px', color: '#999', fontWeight: 400 }}>{p.cliente_correo}</div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#4A3728', fontWeight: 600 }}>${parseFloat(p.total).toLocaleString('es-MX')} MXN</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#4A3728' }}>{p.tipo_cliente}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={estilos.badge(p.estado)}>{p.estado}</span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#999' }}>
                          {new Date(p.created_at).toLocaleDateString('es-MX')}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); verDetalle(p.id); }}
                            style={{ background: '#4A3728', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha — Detalle del pedido */}
        {pedidoSeleccionado && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', height: 'fit-content', position: 'sticky', top: '24px' }}>

            {/* Header del detalle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F5EFE0' }}>
              <h3 style={{ color: '#4A3728', fontFamily: 'Playfair Display, serif', margin: 0, fontSize: '18px' }}>
                Pedido #{pedidoSeleccionado.id}
              </h3>
              <button onClick={() => setPedidoSeleccionado(null)} style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', fontSize: '20px' }}>×</button>
            </div>

            {cargandoDetalle ? (
              <p style={{ color: '#999', textAlign: 'center' }}>Cargando...</p>
            ) : (
              <>
                {/* Estado actual */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Estado actual</p>
                  <span style={estilos.badge(pedidoSeleccionado.estado)}>{pedidoSeleccionado.estado}</span>
                </div>

                {/* Datos del cliente */}
                <div style={{ marginBottom: '20px', background: '#F5EFE0', borderRadius: '8px', padding: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px' }}>Cliente</p>
                  <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#4A3728', fontWeight: 600 }}>{pedidoSeleccionado.cliente_nombre}</p>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#666' }}>{pedidoSeleccionado.cliente_correo}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{pedidoSeleccionado.cliente_telefono}</p>
                </div>

                {/* Dirección de envío */}
                {pedidoSeleccionado.direccion_envio && (
                  <div style={{ marginBottom: '20px', background: '#F5EFE0', borderRadius: '8px', padding: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px' }}>Dirección de envío</p>
                    {typeof pedidoSeleccionado.direccion_envio === 'object' ? (
                      <>
                        <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#4A3728' }}>
                          {pedidoSeleccionado.direccion_envio.calle} {pedidoSeleccionado.direccion_envio.numero}
                        </p>
                        <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#4A3728' }}>
                          {pedidoSeleccionado.direccion_envio.colonia}
                        </p>
                        <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#4A3728' }}>
                          {pedidoSeleccionado.direccion_envio.ciudad}, {pedidoSeleccionado.direccion_envio.estado} {pedidoSeleccionado.direccion_envio.cp}
                        </p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#4A3728' }}>
                          {pedidoSeleccionado.direccion_envio.pais}
                        </p>
                      </>
                    ) : (
                      <p style={{ margin: 0, fontSize: '13px', color: '#4A3728' }}>{pedidoSeleccionado.direccion_envio}</p>
                    )}
                  </div>
                )}

                {/* Productos del pedido */}
                {pedidoSeleccionado.items && pedidoSeleccionado.items.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px' }}>Productos</p>
                    {pedidoSeleccionado.items.map((item: any) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid #F5EFE0' }}>
                        <img
                          src={item.imagen_principal || 'https://placehold.co/48x48/4A3728/F5EFE0?text=🤠'}
                          alt={item.nombre}
                          style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: '13px', color: '#4A3728', fontWeight: 500 }}>{item.nombre}</p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>x{item.cantidad} · ${parseFloat(item.precio_unitario).toLocaleString('es-MX')} MXN</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', fontWeight: 700, color: '#4A3728' }}>
                      <span>Total</span>
                      <span>${parseFloat(pedidoSeleccionado.total).toLocaleString('es-MX')} MXN</span>
                    </div>
                  </div>
                )}

                {/* Número de guía */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Número de guía (opcional)
                  </label>
                  <input
                    type="text"
                    value={numeroGuia}
                    onChange={(e) => setNumeroGuia(e.target.value)}
                    placeholder="Ej: 1234567890"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D5C9B5', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'Jost, sans-serif' }}
                  />
                </div>

                {/* Botones de estado */}
                <div>
                  <p style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px' }}>
                    Actualizar estado — se enviará correo al cliente
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { estado: 'pagado',     emoji: '✅', label: 'Pagado' },
                      { estado: 'preparando', emoji: '📦', label: 'Preparando' },
                      { estado: 'enviado',    emoji: '🚚', label: 'Enviado' },
                      { estado: 'entregado',  emoji: '🎉', label: 'Entregado' },
                      { estado: 'cancelado',  emoji: '❌', label: 'Cancelado' },
                    ].map(({ estado, emoji, label }) => (
                      <button
                        key={estado}
                        onClick={() => actualizarEstado(pedidoSeleccionado.id, estado)}
                        disabled={actualizando === pedidoSeleccionado.id || pedidoSeleccionado.estado === estado}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: pedidoSeleccionado.estado === estado ? 'default' : 'pointer',
                          fontSize: '13px',
                          fontFamily: 'Jost, sans-serif',
                          fontWeight: 500,
                          background: pedidoSeleccionado.estado === estado ? colorEstado(estado).bg : '#F5EFE0',
                          color: pedidoSeleccionado.estado === estado ? '#fff' : '#4A3728',
                          opacity: actualizando === pedidoSeleccionado.id ? 0.6 : 1,
                          gridColumn: estado === 'cancelado' ? '1 / -1' : 'auto',
                        }}
                      >
                        {emoji} {label}
                        {pedidoSeleccionado.estado === estado && ' ✓'}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}