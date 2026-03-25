// ============================================================
// src/pages/admin/Productos.tsx — Gestión de productos y categorías
// Permite agregar, editar productos y gestionar categorías dinámicas
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface FormProducto {
  nombre: string;
  slug: string;
  marca: string;
  categoria: string;
  precio: string;
  precio_mayoreo: string;
  stock: string;
  imagen_principal: string;
  imagenes_texto: string;
  descripcion: string;
  destacado: boolean;
  activo: boolean;
}

const FORM_VACIO: FormProducto = {
  nombre: '', slug: '', marca: '', categoria: '',
  precio: '', precio_mayoreo: '', stock: '',
  imagen_principal: '', imagenes_texto: '', descripcion: '',
  destacado: false, activo: true,
};

// Vista activa del panel
type Vista = 'productos' | 'categorias';

export default function AdminProductos() {
  const navigate = useNavigate();
  const [vista, setVista] = useState<Vista>('productos');

  // --- Estado de productos ---
  const [productos, setProductos] = useState<any[]>([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState<FormProducto>(FORM_VACIO);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // --- Estado de categorías ---
  const [categorias, setCategorias] = useState<any[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [guardandoCategoria, setGuardandoCategoria] = useState(false);
  const [mensajeCategoria, setMensajeCategoria] = useState('');

  // --- Verificar autenticación ---
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin'); return; }
    cargarProductos(token);
    cargarCategorias();
  }, []);

  // --- Carga productos ---
  async function cargarProductos(token?: string) {
    const t = token || localStorage.getItem('admin_token') || '';
    try {
      const res = await fetch(`${API_URL}/admin/productos`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      const datos = await res.json();
      if (datos.ok) setProductos(datos.data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setCargandoProductos(false);
    }
  }

  // --- Carga categorías ---
  async function cargarCategorias() {
    try {
      const res = await fetch(`${API_URL}/admin/categorias`);
      const datos = await res.json();
      if (datos.ok) setCategorias(datos.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    } finally {
      setCargandoCategorias(false);
    }
  }

  // --- Genera slug automático ---
  function generarSlug(nombre: string) {
    return nombre.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  // --- Maneja cambios en el formulario de producto ---
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'nombre' ? { slug: generarSlug(value) } : {}),
    }));
  }

  // --- Guarda producto ---
  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setMensaje('');

    const token = localStorage.getItem('admin_token') || '';

    const imagenesArray = form.imagenes_texto
      ? form.imagenes_texto.split('\n').map(u => u.trim()).filter(u => u !== '')
      : [];

    const payload = {
      ...form,
      precio: parseFloat(form.precio),
      precio_mayoreo: form.precio_mayoreo ? parseFloat(form.precio_mayoreo) : null,
      stock: parseInt(form.stock),
      imagenes: imagenesArray,
    };

    delete (payload as any).imagenes_texto;

    try {
      const url = editandoId
        ? `${API_URL}/admin/productos/${editandoId}`
        : `${API_URL}/admin/productos`;

      const res = await fetch(url, {
        method: editandoId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const datos = await res.json();

      if (datos.ok) {
        setMensaje(editandoId ? '✅ Producto actualizado' : '✅ Producto creado');
        setForm(FORM_VACIO);
        setEditandoId(null);
        setMostrarForm(false);
        cargarProductos();
      } else {
        setMensaje(`❌ ${datos.mensaje}`);
      }
    } catch (err) {
      setMensaje('❌ Error de conexión');
    } finally {
      setGuardando(false);
    }
  }

  // --- Carga datos de un producto para editar ---
  function handleEditar(producto: any) {
    let imagenesTexto = '';
    try {
      const imgs = typeof producto.imagenes === 'string'
        ? JSON.parse(producto.imagenes)
        : producto.imagenes;
      imagenesTexto = Array.isArray(imgs) ? imgs.join('\n') : '';
    } catch { imagenesTexto = ''; }

    setForm({
      nombre: producto.nombre,
      slug: producto.slug,
      marca: producto.marca,
      categoria: producto.categoria,
      precio: producto.precio.toString(),
      precio_mayoreo: producto.precio_mayoreo?.toString() || '',
      stock: producto.stock.toString(),
      imagen_principal: producto.imagen_principal,
      imagenes_texto: imagenesTexto,
      descripcion: producto.descripcion || '',
      destacado: producto.destacado === 1,
      activo: producto.activo === 1,
    });
    setEditandoId(producto.id);
    setMostrarForm(true);
    setVista('productos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Agregar categoría ---
  async function handleAgregarCategoria(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevaCategoria.trim()) return;

    setGuardandoCategoria(true);
    setMensajeCategoria('');

    const token = localStorage.getItem('admin_token') || '';

    try {
      const res = await fetch(`${API_URL}/admin/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre: nuevaCategoria.trim() }),
      });

      const datos = await res.json();

      if (datos.ok) {
        setMensajeCategoria('✅ Categoría agregada');
        setNuevaCategoria('');
        cargarCategorias();
      } else {
        setMensajeCategoria(`❌ ${datos.mensaje}`);
      }
    } catch (err) {
      setMensajeCategoria('❌ Error de conexión');
    } finally {
      setGuardandoCategoria(false);
    }
  }

  // --- Eliminar categoría ---
  async function handleEliminarCategoria(id: number, nombre: string) {
    if (!confirm(`¿Eliminar la categoría "${nombre}"?`)) return;

    const token = localStorage.getItem('admin_token') || '';

    try {
      const res = await fetch(`${API_URL}/admin/categorias/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const datos = await res.json();

      if (datos.ok) {
        setMensajeCategoria('✅ Categoría eliminada');
        cargarCategorias();
      } else {
        setMensajeCategoria(`❌ ${datos.mensaje}`);
      }
    } catch (err) {
      setMensajeCategoria('❌ Error de conexión');
    }
  }

  // --- Estilos reutilizables ---
  const estiloInput = {
    width: '100%', padding: '10px 14px',
    border: '1px solid #D5C9B5', borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box' as const,
    fontFamily: 'Jost, sans-serif', background: '#fff',
  };

  const estiloLabel = {
    display: 'block', color: '#4A3728',
    marginBottom: '6px', fontWeight: 500, fontSize: '14px',
  };

  const estiloTab = (activo: boolean) => ({
    padding: '8px 20px', borderRadius: '6px', cursor: 'pointer',
    fontWeight: 600, fontSize: '14px', border: 'none',
    background: activo ? '#C9A84C' : 'transparent',
    color: activo ? '#4A3728' : '#C9A84C',
    outline: activo ? 'none' : '1px solid #C9A84C',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F5EFE0', fontFamily: 'Jost, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#4A3728', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ color: '#F5EFE0', fontFamily: 'Playfair Display, serif', margin: 0, fontSize: '22px' }}>
          Villalobos Admin — Productos
        </h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Tabs de navegación */}
          <button onClick={() => setVista('productos')} style={estiloTab(vista === 'productos')}>
            🎩 Productos
          </button>
          <button onClick={() => setVista('categorias')} style={estiloTab(vista === 'categorias')}>
            🗂 Categorías
          </button>
          <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'transparent', border: '1px solid #C9A84C', color: '#C9A84C', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </header>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* ══════════════ VISTA: PRODUCTOS ══════════════ */}
        {vista === 'productos' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#4A3728', fontFamily: 'Playfair Display, serif', margin: 0 }}>Catálogo</h2>
              <button
                onClick={() => { setForm(FORM_VACIO); setEditandoId(null); setMostrarForm(!mostrarForm); }}
                style={{ background: '#C9A84C', border: 'none', color: '#4A3728', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                {mostrarForm ? 'Cancelar' : '+ Nuevo Producto'}
              </button>
            </div>

            {mensaje && (
              <div style={{ background: '#fff', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                {mensaje}
              </div>
            )}

            {/* Formulario de producto */}
            {mostrarForm && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                <h2 style={{ color: '#4A3728', fontFamily: 'Playfair Display, serif', marginTop: 0 }}>
                  {editandoId ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>

                <form onSubmit={handleGuardar}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                    <div>
                      <label style={estiloLabel}>Nombre *</label>
                      <input name="nombre" value={form.nombre} onChange={handleChange} required style={estiloInput} />
                    </div>

                    <div>
                      <label style={estiloLabel}>Slug (URL)</label>
                      <input name="slug" value={form.slug} onChange={handleChange} style={estiloInput} />
                    </div>

                    <div>
                      <label style={estiloLabel}>Marca *</label>
                      <select name="marca" value={form.marca} onChange={handleChange} required style={estiloInput}>
                        <option value="">Seleccionar marca</option>
                        <option value="Villalobos Hats">Villalobos Hats</option>
                        <option value="Rocha Hats">Rocha Hats</option>
                        <option value="Domador">Domador</option>
                      </select>
                    </div>

                    {/* Tipo de sombrero — cargado dinámicamente desde BD */}
                    <div>
                      <label style={estiloLabel}>Tipo de Sombrero *</label>
                      <select name="categoria" value={form.categoria} onChange={handleChange} required style={estiloInput}>
                        <option value="">Seleccionar tipo</option>
                        {cargandoCategorias ? (
                          <option disabled>Cargando...</option>
                        ) : (
                          categorias.map((cat) => (
                            <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                          ))
                        )}
                      </select>
                      <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0' }}>
                        ¿No está el tipo? Agrégalo en la pestaña <strong>Categorías</strong>
                      </p>
                    </div>

                    <div>
                      <label style={estiloLabel}>Precio MXN *</label>
                      <input name="precio" type="number" value={form.precio} onChange={handleChange} required style={estiloInput} />
                    </div>

                    <div>
                      <label style={estiloLabel}>Precio Mayoreo MXN</label>
                      <input name="precio_mayoreo" type="number" value={form.precio_mayoreo} onChange={handleChange} style={estiloInput} />
                    </div>

                    <div>
                      <label style={estiloLabel}>Stock *</label>
                      <input name="stock" type="number" value={form.stock} onChange={handleChange} required style={estiloInput} />
                    </div>

                    <div>
                      <label style={estiloLabel}>URL Imagen Principal *</label>
                      <input name="imagen_principal" value={form.imagen_principal} onChange={handleChange} required style={estiloInput} placeholder="https://..." />
                    </div>

                  </div>

                  {/* Imágenes secundarias */}
                  <div style={{ marginTop: '20px' }}>
                    <label style={estiloLabel}>Imágenes secundarias (slider)</label>
                    <p style={{ fontSize: '13px', color: '#999', margin: '0 0 8px' }}>
                      Una URL por línea
                    </p>
                    <textarea
                      name="imagenes_texto"
                      rows={4}
                      placeholder={"https://ejemplo.com/foto1.jpg\nhttps://ejemplo.com/foto2.jpg"}
                      value={form.imagenes_texto}
                      onChange={handleChange}
                      style={{ ...estiloInput, resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <label style={estiloLabel}>Descripción</label>
                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} style={{ ...estiloInput, resize: 'vertical' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#4A3728' }}>
                      <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} />
                      Producto destacado (aparece en homepage)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#4A3728' }}>
                      <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
                      Activo (visible en catálogo)
                    </label>
                  </div>

                  <button type="submit" disabled={guardando} style={{ marginTop: '24px', background: '#4A3728', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: guardando ? 'not-allowed' : 'pointer' }}>
                    {guardando ? 'Guardando...' : editandoId ? 'Actualizar Producto' : 'Crear Producto'}
                  </button>
                </form>
              </div>
            )}

            {/* Tabla de productos */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <h3 style={{ color: '#4A3728', fontFamily: 'Playfair Display, serif', marginTop: 0 }}>
                {productos.length} productos en catálogo
              </h3>

              {cargandoProductos ? (
                <p style={{ color: '#999' }}>Cargando productos...</p>
              ) : productos.length === 0 ? (
                <p style={{ color: '#999' }}>No hay productos. ¡Agrega el primero!</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F5EFE0' }}>
                      {['#', 'Nombre', 'Marca', 'Tipo', 'Precio', 'Stock', 'Estado', 'Acciones'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px', color: '#999', fontWeight: 500, fontSize: '13px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((p: any) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #F5EFE0' }}>
                        <td style={{ padding: '12px 10px', fontSize: '14px', color: '#999' }}>{p.id}</td>
                        <td style={{ padding: '12px 10px', fontSize: '14px', color: '#4A3728', fontWeight: 500 }}>{p.nombre}</td>
                        <td style={{ padding: '12px 10px', fontSize: '14px', color: '#4A3728' }}>{p.marca}</td>
                        <td style={{ padding: '12px 10px', fontSize: '14px', color: '#4A3728' }}>{p.categoria}</td>
                        <td style={{ padding: '12px 10px', fontSize: '14px', color: '#4A3728' }}>${p.precio}</td>
                        <td style={{ padding: '12px 10px', fontSize: '14px', color: p.stock < 5 ? '#e74c3c' : '#4A3728' }}>{p.stock}</td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ background: p.activo ? '#6B7A3E' : '#999', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                            {p.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <button onClick={() => handleEditar(p)} style={{ background: '#4A3728', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ══════════════ VISTA: CATEGORÍAS ══════════════ */}
        {vista === 'categorias' && (
          <>
            <h2 style={{ color: '#4A3728', fontFamily: 'Playfair Display, serif', marginBottom: '24px' }}>
              Tipos de Sombrero
            </h2>

            {mensajeCategoria && (
              <div style={{ background: '#fff', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                {mensajeCategoria}
              </div>
            )}

            {/* Formulario nueva categoría */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', marginBottom: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <h3 style={{ color: '#4A3728', fontFamily: 'Playfair Display, serif', marginTop: 0 }}>
                Agregar nuevo tipo
              </h3>
              <form onSubmit={handleAgregarCategoria} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={estiloLabel}>Nombre del tipo de sombrero</label>
                  <input
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    placeholder="Ej: Vaquero, Rodeo, Charro..."
                    required
                    style={estiloInput}
                  />
                </div>
                <button
                  type="submit"
                  disabled={guardandoCategoria}
                  style={{ background: '#4A3728', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: guardandoCategoria ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
                >
                  {guardandoCategoria ? 'Guardando...' : '+ Agregar'}
                </button>
              </form>
            </div>

            {/* Lista de categorías */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <h3 style={{ color: '#4A3728', fontFamily: 'Playfair Display, serif', marginTop: 0 }}>
                Tipos actuales ({categorias.length})
              </h3>
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
                Estos tipos aparecen como filtros en la tienda y en el formulario de productos.
              </p>

              {cargandoCategorias ? (
                <p style={{ color: '#999' }}>Cargando...</p>
              ) : categorias.length === 0 ? (
                <p style={{ color: '#999' }}>No hay categorías. Agrega la primera.</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {categorias.map((cat: any) => (
                    <div
                      key={cat.id}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F5EFE0', padding: '10px 16px', borderRadius: '8px', border: '1px solid #D5C9B5' }}
                    >
                      <span style={{ color: '#4A3728', fontWeight: 500, fontSize: '15px' }}>🎩 {cat.nombre}</span>
                      <button
                        onClick={() => handleEliminarCategoria(cat.id, cat.nombre)}
                        style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '0 4px' }}
                        title="Eliminar categoría"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}