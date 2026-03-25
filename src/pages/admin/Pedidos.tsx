// ============================================================
// src/pages/admin/Pedidos.tsx — Gestión de pedidos
// Lista todos los pedidos y permite actualizar su estado
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function AdminPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');

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

  // --- Actualiza el estado de un pedido ---
  async function actualizarEstado(id: number, estado: string, numero_guia?: string) {
    setActualizando(id);
    const token = localStorage.getItem('admin_token') || '';

    try {
      const res = await fetch(`${API_URL}/admin/pedidos/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado, numero_guia }),
      });

      const datos = await res.json();

      if (datos.ok) {
        setMensaje(`✅ Pedido #${id} actualizado a "${estado}"`);
        cargarPedidos();
        setTimeout(() => setMensaje(''), 3000);
      }
    } catch (err) {
      setMensaje('❌ Error al actualizar pedido');
    } finally {
      setActualizando(null);
    }
  }

  // --- Color por estado ---
  function colorEstado(estado: string) {
    const colores: Record<string, string> = {
      pagado:     '#C9A84C',
      preparando: '#3498db',
      enviado:    '#6B7A3E',
      entregado:  '#27ae60',
      cancelado:  '#e74c3c',
    };
    return colores[estado] || '#999';
  }

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

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Mensaje */}
        {mensaje && (
          <div style={{ background: '#fff', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            {mensaje}
          </div>
        )}

        {/* Tabla de pedidos */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h2 style={{ color: '#4A3728', fontFamily: 'Playfair Display, serif', marginTop: 0 }}>
            Todos los Pedidos ({pedidos.length})
          </h2>

          {cargando ? (
            <p style={{ color: '#999' }}>Cargando pedidos...</p>
          ) : pedidos.length === 0 ? (
            <p style={{ color: '#999' }}>No hay pedidos todavía.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F5EFE0' }}>
                  {['#', 'Cliente', 'Correo', 'Total', 'Tipo', 'Estado', 'Fecha', 'Acciones'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px', color: '#999', fontWeight: 500, fontSize: '13px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p: any) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F5EFE0' }}>
                    <td style={{ padding: '12px 10px', fontSize: '14px', color: '#999' }}>#{p.id}</td>
                    <td style={{ padding: '12px 10px', fontSize: '14px', color: '#4A3728', fontWeight: 500 }}>{p.cliente_nombre}</td>
                    <td style={{ padding: '12px 10px', fontSize: '14px', color: '#4A3728' }}>{p.cliente_correo}</td>
                    <td style={{ padding: '12px 10px', fontSize: '14px', color: '#4A3728' }}>${p.total} MXN</td>
                    <td style={{ padding: '12px 10px', fontSize: '14px', color: '#4A3728' }}>{p.tipo_cliente}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ background: colorEstado(p.estado), color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                        {p.estado}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', fontSize: '13px', color: '#999' }}>
                      {new Date(p.created_at).toLocaleDateString('es-MX')}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <select
                        value={p.estado}
                        disabled={actualizando === p.id}
                        onChange={e => actualizarEstado(p.id, e.target.value)}
                        style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #D5C9B5', fontSize: '13px', cursor: 'pointer', fontFamily: 'Jost, sans-serif' }}
                      >
                        <option value="pagado">Pagado</option>
                        <option value="preparando">Preparando</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}