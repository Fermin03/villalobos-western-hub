// ============================================================
// src/pages/admin/Login.tsx — Página de login del panel admin
// Autentica al administrador y guarda el JWT en localStorage
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function AdminLogin() {
  // --- Estado del formulario ---
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  // --- Maneja el envío del formulario ---
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const respuesta = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      });

      const datos = await respuesta.json();

      if (!datos.ok) {
        setError(datos.mensaje || 'Credenciales incorrectas');
        return;
      }

      // Guardar token JWT en localStorage
      localStorage.setItem('admin_token', datos.token);
      localStorage.setItem('admin_nombre', datos.nombre);

      // Redirigir al dashboard
      navigate('/admin/dashboard');

    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5EFE0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Jost, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#4A3728', fontSize: '28px', margin: 0 }}>
            Villalobos
          </h1>
          <p style={{ color: '#6B7A3E', letterSpacing: '4px', fontSize: '12px', marginTop: '4px' }}>
            PANEL ADMIN
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#4A3728', marginBottom: '6px', fontWeight: 500 }}>
              Correo
            </label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #D5C9B5',
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#4A3728', marginBottom: '6px', fontWeight: 500 }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #D5C9B5',
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <p style={{ color: '#c0392b', marginBottom: '16px', fontSize: '14px' }}>
              ❌ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '12px',
              background: '#4A3728',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: cargando ? 'not-allowed' : 'pointer',
              opacity: cargando ? 0.7 : 1
            }}
          >
            {cargando ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}