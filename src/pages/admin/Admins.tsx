// ============================================================
// src/pages/admin/Admins.tsx — Gestión de administradores
// Permite crear, editar y desactivar admins desde el panel
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function AdminAdmins() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState({
    nombre: '', correo: '', password: '', activo: true
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin'); return; }
    cargarAdmins(token);
  }, []);

  async function cargarAdmins(token?: string) {
    const t = token || localStorage.getItem('admin_token') || '';
    try {
      const res = await fetch(`${API_URL}/admin/admins`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      const datos = await res.json();
      if (datos.ok) setAdmins(datos.data);
    } catch (err) {
      console.error('Error al cargar admins:', err);
    } finally {
      setCargando(false);
    }
  }

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setMensaje('');
    const token = localStorage.getItem('admin_token') || '';

    try {
      const res = await fetch(`${API_URL}/admin/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });

      const datos = await res.json();

      if (datos.ok) {
        setMensaje('✅ Administrador creado correctamente');
        setForm({ nombre: '', correo: '', password: '', activo: true });
        setMostrarForm(false);
        cargarAdmins();
      } else {
        setMensaje(`❌ ${datos.mensaje}`);
      }
    } catch (err) {
      setMensaje('❌ Error de conexión');
    } finally {
      setGuardando(false);
    }
  }

  async function toggleActivo(id: number, activo: boolean) {
    const token = localStorage.getItem('admin_token') || '';
    try {
      const res = await fetch(`${API_URL}/admin/admins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ activo: !activo }),
      });
      const datos = await res.json();
      if (datos.ok) {
        setMensaje(`✅ Admin ${!activo ? 'activado' : 'desactivado'} correctamente`);
        cargarAdmins();
        setTimeout(() => setMensaje(''), 3000);
      }
    } catch (err) {
      setMensaje('❌ Error de conexión');
    }
  }

  const estiloInput = {
    width: '100%', padding: '10px 14px',
    border: '1px solid #D5C9B5', borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box' as const,
    fontFamily: 'Jost, sans-serif'
  };

  const estiloLabel = {
    display: 'block', color: '#4A3728',
    marginBottom: '6px', fontWeight: 500, fontSize: '14px'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5EFE0', fontFamily: 'Jost, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#4A3728', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#F5EFE0', fontFamily: 'Playfair Display, serif', margin: 0, fontSize: '22px' }}>
          Villalobos Admin — Administradores
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'transparent', border: '1px solid #C9A84C', color: '#C9A84C', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}>
            ← Dashboard
          </button>
          <button
            onClick={() => { setMostrarForm(!mostrarForm); setMensaje(''); }}
            style={{ background: '#C9A84C', border: 'none', color: '#4A3728', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            {mostrarForm ? 'Cancelar' : '+ Nuevo Admin'}
          </button>
        </div>
      </header>

      <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>

        {/* Mensaje */}
        {mensaje && (
          <div style={{ background: '#fff', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            {mensaje}
          </div>
        )}

        {/* Formulario nuevo admin */}
        {mostrarForm && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <h2 style={{ color: '#4A3728', fontFamily: 'Playfair Display, serif', marginTop: 0 }}>
              Nuevo Administrador
            </h2>

            <form onSubmit={handleGuardar}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                <div>
                  <label style={estiloLabel}>Nombre *</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    required
                    style={estiloInput}
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label style={estiloLabel}>Correo *</label>
                  <input
                    type="email"
                    value={form.correo}
                    onChange={e => setForm(f => ({ ...f, correo: e.target.value }))}
                    required
                    style={estiloInput}
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={estiloLabel}>Contraseña *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    minLength={8}
                    style={estiloInput}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>

              </div>

              <button
                type="submit"
                disabled={guardando}
                style={{ marginTop: '24px', background: '#4A3728', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: guardando ? 'not-allowed' : 'pointer', opacity: guardando ? 0.7 : 1 }}
              >
                {guardando ? 'Creando...' : 'Crear Administrador'}
              </button>
            </form>
          </div>
        )}

        {/* Lista de admins */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h2 style={{ color: '#4A3728', fontFamily: 'Playfair Display, serif', marginTop: 0 }}>
            Administradores ({admins.length})
          </h2>

          {cargando ? (
            <p style={{ color: '#999' }}>Cargando...</p>
          ) : admins.length === 0 ? (
            <p style={{ color: '#999' }}>No hay administradores.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {admins.map((admin: any) => (
                <div
                  key={admin.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', borderRadius: '8px',
                    background: admin.activo ? '#F5EFE0' : '#f5f5f5',
                    opacity: admin.activo ? 1 : 0.6
                  }}
                >
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#4A3728', fontSize: '15px' }}>
                      {admin.nombre}
                      {admin.id === parseInt(localStorage.getItem('admin_id') || '0') && (
                        <span style={{ marginLeft: '8px', fontSize: '11px', background: '#C9A84C', color: '#4A3728', padding: '2px 8px', borderRadius: '10px' }}>Tú</span>
                      )}
                    </p>
                    <p style={{ margin: '0 0 4px', color: '#666', fontSize: '13px' }}>{admin.correo}</p>
                    <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>
                      Creado: {new Date(admin.created_at).toLocaleDateString('es-MX')}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      background: admin.activo ? '#6B7A3E' : '#999',
                      color: '#fff', padding: '3px 10px',
                      borderRadius: '20px', fontSize: '12px'
                    }}>
                      {admin.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <button
                      onClick={() => toggleActivo(admin.id, admin.activo)}
                      style={{
                        background: admin.activo ? '#e74c3c' : '#6B7A3E',
                        color: '#fff', border: 'none',
                        padding: '6px 14px', borderRadius: '6px',
                        cursor: 'pointer', fontSize: '13px'
                      }}
                    >
                      {admin.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}