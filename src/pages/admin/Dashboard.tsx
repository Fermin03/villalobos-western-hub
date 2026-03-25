// ============================================================
// src/pages/admin/Dashboard.tsx — Panel principal del admin
// Muestra resumen de pedidos, productos y accesos rápidos
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // --- Estado del dashboard ---
  const [nombreAdmin, setNombreAdmin] = useState('');
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [pedidosRecientes, setPedidosRecientes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // --- Verificar autenticación al cargar ---
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const nombre = localStorage.getItem('admin_nombre');

    if (!token) {
      navigate('/admin');
      return;
    }

    setNombreAdmin(nombre || 'Admin');
    cargarDatos(token);
  }, []);

  // --- Carga datos del dashboard ---
  async function cargarDatos(token: string) {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Cargar productos y pedidos en paralelo
      const [resProductos, resPedidos] = await Promise.all([
        fetch(`${API_URL}/admin/productos`, { headers }),
        fetch(`${API_URL}/admin/pedidos`, { headers }),
      ]);

      const dataProductos = await resProductos.json();
      const dataPedidos = await resPedidos.json();

      if (dataProductos.ok) setTotalProductos(dataProductos.data.length);
      if (dataPedidos.ok) {
        setTotalPedidos(dataPedidos.data.length);
        setPedidosRecientes(dataPedidos.data.slice(0, 5)); // Últimos 5 pedidos
      }

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setCargando(false);
    }
  }

  // --- Cerrar sesión ---
  function cerrarSesion() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_nombre');
    navigate('/admin');
  }

  // --- Colores por estado de pedido ---
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

  if (cargando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5EFE0' }}>
        <p style={{ color: '#4A3728', fontFamily: 'Jost, sans-serif' }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5EFE0', fontFamily: 'Jost, sans-serif' }}>

      {/* Header del admin */}
      <header style={{ background: '#4A3728', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#F5EFE0', fontFamily: 'Playfair Display, serif', margin: 0, fontSize: '22px' }}>
          Villalobos Admin
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#C9A84C', fontSize: '14px' }}>👤 {nombreAdmin}</span>
          <button onClick={cerrarSesion} style={{ background: 'transparent', border: '1px solid #C9A84C', color: '#C9A84C', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Tarjetas de resumen */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          
          {/* Total productos */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <p style={{ color: '#999', fontSize: '13px', margin: '0 0 8px' }}>PRODUCTOS</p>
            <p style={{ color: '#4A3728', fontSize: '36px', fontWeight: 700, margin: 0 }}>{totalProductos}</p>
            <Link to="/admin/productos" style={{ color: '#6B7A3E', fontSize: '13px', textDecoration: 'none' }}>Ver todos →</Link>
          </div>

          {/* Total pedidos */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <p style={{ color: '#999', fontSize: '13px', margin: '0 0 8px' }}>PEDIDOS</p>
            <p style={{ color: '#4A3728', fontSize: '36px', fontWeight: 700, margin: 0 }}>{totalPedidos}</p>
            <Link to="/admin/pedidos" style={{ color: '#6B7A3E', fontSize: '13px', textDecoration: 'none' }}>Ver todos →</Link>
          </div>

          {/* Acceso rápido — agregar producto */}
          <div style={{ background: '#4A3728', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', cursor: 'pointer' }} onClick={() => navigate('/admin/productos')}>
            <p style={{ color: '#C9A84C', fontSize: '13px', margin: '0 0 8px' }}>ACCIÓN RÁPIDA</p>
            <p style={{ color: '#F5EFE0', fontSize: '18px', fontWeight: 600, margin: 0 }}>+ Agregar Producto</p>
          </div>

        </div>

        {/* Pedidos recientes */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h2 style={{ color: '#4A3728', fontFamily: 'Playfair Display, serif', marginTop: 0 }}>Pedidos Recientes</h2>

          {pedidosRecientes.length === 0 ? (
            <p style={{ color: '#999' }}>No hay pedidos todavía.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F5EFE0' }}>
                  <th style={{ textAlign: 'left', padding: '10px', color: '#999', fontWeight: 500, fontSize: '13px' }}>#</th>
                  <th style={{ textAlign: 'left', padding: '10px', color: '#999', fontWeight: 500, fontSize: '13px' }}>CLIENTE</th>
                  <th style={{ textAlign: 'left', padding: '10px', color: '#999', fontWeight: 500, fontSize: '13px' }}>TOTAL</th>
                  <th style={{ textAlign: 'left', padding: '10px', color: '#999', fontWeight: 500, fontSize: '13px' }}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {pedidosRecientes.map((pedido: any) => (
                  <tr key={pedido.id} style={{ borderBottom: '1px solid #F5EFE0' }}>
                    <td style={{ padding: '12px 10px', color: '#4A3728', fontSize: '14px' }}>#{pedido.id}</td>
                    <td style={{ padding: '12px 10px', color: '#4A3728', fontSize: '14px' }}>{pedido.cliente_nombre}</td>
                    <td style={{ padding: '12px 10px', color: '#4A3728', fontSize: '14px' }}>${pedido.total} MXN</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ background: colorEstado(pedido.estado), color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                        {pedido.estado}
                      </span>
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