/**
 * NAVBAR STICKY — Logo SVG real, links de navegación, búsqueda modal, carrito, toggle ES/EN.
 * Búsqueda: modal overlay con resultados en tiempo real por nombre, marca y tipo.
 */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { getProducts } from "@/data/products";
import type { Product } from "@/data/products";

const navLinks = [
  { key: "nav.home", path: "/" },
  { key: "nav.hats", path: "/catalogo" },
  { key: "nav.brands", path: "/marcas" },
  { key: "nav.wholesale", path: "/mayoreo" },
  { key: "nav.shipping", path: "/envios" },
  { key: "nav.contact", path: "/contacto" },
];

// ── Logo SVG real de Villalobos Western Hats ──
const VillalobosLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 5102.36 3795.72"
    aria-label="Villalobos Western Hats"
  >
    <g fill="currentColor">
      <path d="M1091.69,1867.44c8.04,8.7,12.68,28.2,9.33,39.89-116.44,318.03-205.37,692.44-404.22,970.74-92.1,128.89-271.46,302.37-401.86,109.75-89.18-131.73-177.64-391.38-225.22-546.99-129.02-421.98-103.58-961.38,288.11-1236.37,426.35-299.33,900-65.15,1329.94,82.54,691.68,237.62,1659.71,515.9,2387.85,390.18,283.06-48.87,767.59-242.96,735.6-598.88-24.4-271.48-306.82-336.77-533.52-323.87-146.97,8.36-275.74,61.44-412.7,107.27,94.21-87.9,210.83-149.99,334.78-185.19,450.76-127.98,942.75,77.02,846.67,614.56-58.6,327.88-347.62,514.68-645.83,603.99-856.81,256.58-1940.64-210.92-2770.94-438.39-465.32-127.47-1174.01-352.61-1381.44,267.57-88.46,264.47-17.17,559.6,72.55,813.68,20.87,59.11,91.57,258.82,129.53,294.51,27.99,26.32,56.47,4.84,80.44-17.75,77.16-72.7,166.95-298.44,205.31-401.74,40.57-109.27,139.58-467,209.61-531.35,31.36-28.81,115.38-47.31,146.01-14.16Z"/>
      <path d="M1450.14,2857.02c18.33.91,38.56-1.21,55.16-9.6,22.22-11.22,119.72-95.21,134.28-115.69,53.94-75.9,98.97-247.96,140.1-341.97,36.11-82.54,81.57-175.53,125-254.41,37.4-67.93,109.48-211.88,207.39-174.61,66.43,25.29,21.43,99.11-.53,140.43-104.33,196.38-289.41,471.53-336.99,685.19-9.14,41.04-22.36,96.63,40.18,66.96,105.59-50.1,129.89-163.23,187.09-250.34,80-121.83,276.72-289.46,410.25-143.32,35.41-40.01,72-73.63,129.01-48.6,39.9,17.52,36.58,49.13,21.33,82.96-25.32,56.17-80.04,115.72-110.37,175.3-30.22,59.37-58.56,129.51-60.04,196.58,126.08-41.55,186.79-164.69,237.35-278.16,69.05-154.98,133.21-348.74,232.16-486.49,49.47-68.87,174.79-113.06,166.65,10.45-113.96,210.94-248.33,424.66-323.8,653.7-10.16,30.82-22.41,63.41-22.25,96.07,49.64-1.14,115.51-50.52,145.19-89.18,31.66-41.24,40.71-99.96,63.82-145.97,39.07-77.77,140.86-187.16,225.06-212.38,139.3-41.73,243.59,34.2,230.99,181.89-1.91,22.39-14.11,44.65-8.87,69.24,106.54-7.53,119.9-93.74,156.84-171.23,49.79-104.45,99.25-217.63,154.83-318.32,16.24-29.43,56.96-110.06,88.83-116.5,43.19-8.72,109.16,1.07,99.15,58.94l-164.88,332.81c34.39-15.73,64.65-34.26,102.49-42.54,176.34-38.56,187.74,135.51,144.2,260.26-55.6,159.28-259.34,414.43-451.98,333.5-107.86-45.31-81.89-167.25-75.92-261.06l-83.74,10.05c-64.19,191.56-355.52,414.98-472,132.87-49.34,56.82-194.32,167.17-269.83,117.98-35.09-22.86-40.93-71.2-42.66-109.19-59.81,45.9-159.49,151.29-241.87,116.98-60.23-25.08-34.06-94.74-46.05-103.53-60.76,50.79-124.15,118.3-211.59,106.74-65.08-8.61-96.17-74.95-103.09-133.57-41.99,35.16-74.4,72.76-123.06,100.12-82.12,46.17-168.33,63.04-194.99-49.79-3.03-12.83,3.71-28.04-7.75-36.8-53.88,52.86-169.34,135.23-247.98,118.44-57.08-12.18-62.37-80.43-66.75-127.45-68.24,44.9-177.76,139.83-263.54,127.43-102.35-14.8-84.57-118.81-61.13-191.03,40.51-124.82,113.53-241.65,173.6-357.57,35.26-38.83,135.65-18.61,133.01,39.16-.76,16.63-24.54,61.33-33.12,78.58-35.7,71.81-121.62,191.77-130.68,266.7-9.75,80.66,116.91-19.92,139.38-39.28,127.92-110.23,182.21-323.12,252.96-474.61,37.91-81.18,159.88-332.74,232.8-369.79,53.21-27.04,125.19-12.61,112.62,59.08-124.07,237.36-278.72,474.06-363.99,729.58-11.37,34.07-25.96,68.19-22.25,105ZM3195.44,2517.8c-124.71,29.67-242.44,216.79-207.82,339.43,22.23,78.76,109.19,1.52,138.7-31.42,21.36-23.85,64.77-81.83,60.04-113.57-2.11-14.13-19.08-31.3-24.35-47.22-17.14-51.77,9.92-102.3,33.43-147.21ZM3540.28,2873.68c7.85,7.38,38.83,7.11,49.93,5.34,56.17-8.94,130.1-116.99,156.58-164.77,19.44-35.07,92.78-180.37,21.98-191.75-102.82-16.53-230.36,176.18-238.49,265.37-1.7,18.66-3.23,73.37,9.99,85.8ZM2261.38,2527.75c-95.31,16.15-192.46,225.78-186.45,313.8,2.18,31.93,5.04,44.85,40.45,35.64,63.92-16.63,177.31-179.44,207.51-238.82,35.2-69.22,33.68-126.76-61.52-110.62Z"/>
      <path d="M2908.85,1.58c410.6-25.55,558.87,262.42,687.2,600.17,70.42,185.34,173.68,523.15,169.84,717.53-.65,33.07-5.37,94.22-47.64,98.17-47.02,4.38-98.79-115.12-115.99-152.36-123.33-267.01-232.06-778.85-460.76-958.68-100.75-79.22-172.4-34.32-283.11-24.97-252.67,21.33-506.39-13.72-758.59-22.46-284.26-9.84-589.89,5.44-726.3,296.24-53.84,114.78-57.61,242.01-87.08,363.75-5.04,20.83-8.23,47.09-21.5,63.22-7.78-.01-28.59-72.75-31.29-84.67-25.32-111.96-17.47-251.27,13.45-361.59C1399.54-8.09,2142.53,128.73,2567.01,61.46c114.24-18.1,225.47-52.64,341.85-59.88Z"/>
      <path d="M4463.12,2642.74c78.93-17.3,151.36-83.14,203.16-142.77,46.41-53.43,98.04-169.39,188.34-117.05,50.84,29.47.15,59.82-14.6,89.92-35.4,72.23,17.68,172.64,20.54,247.84,6.26,164.45-164.2,389.18-334.56,258.68-51.35-39.34-102.8-160.19-20.7-189.52,75.77-27.06,51.18,101.58,112.06,111.51,43.77,7.14,68.79-16.32,82.5-55.36,26.42-75.24,10.7-170.65-.21-247.88-78.14,75.99-159.09,150.88-275.92,152.51-43.91,154.51-259.11,358.12-418.03,226.8-224.14-185.22,180.32-716.76,397.07-544.37,10.56,8.4,60.36,59.56,60.36,69.09v140.6ZM4306.85,2517.76c-118.2,40.32-238.91,203.44-212.23,330.56,12.86,61.25,75.33,42.16,111.73,13.04,25.53-20.43,100.26-122.75,96.09-153.55-1.46-10.81-15.82-22.24-20.14-33.78-19.82-53.03,9.57-106.5,24.54-156.26Z"/>
      <path d="M5102.03,1973.41c1.45,6.45-2.14,6.7-5.75,9.79-13.23,11.34-95.28,64.59-97.38,72.06l37.49,125.31-105.78-75.57-109.94,75.61,39.33-125.51-106.69-81.68h134.65l38.02-124.29c4.89.4,5.43,5.07,7,8.5,16.67,36.33,19.73,80.84,39.57,115.79h129.47Z"/>
      <path d="M1257.38,2206.34c132.7-9.33,110.63,210.12-19.19,199.77-122.37-9.76-96.96-191.6,19.19-199.77Z"/>
      <text fontFamily="CenturySchoolbook-Bold, 'Century Schoolbook'" fontSize="424.51" fontWeight="700" letterSpacing=".3em" transform="translate(994.17 3660.37)">WESTERN</text>
    </g>
  </svg>
);

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Estado del buscador ──
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [resultados, setResultados] = useState<Product[]>([]);
  const [cargando, setCargando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar productos al abrir modal
  useEffect(() => {
    if (searchOpen && allProducts.length === 0) {
      setCargando(true);
      getProducts().then(setAllProducts).finally(() => setCargando(false));
    }
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [searchOpen]);

  // Filtrar en tiempo real
  useEffect(() => {
    if (!query.trim()) { setResultados([]); return; }
    const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const filtrados = allProducts.filter((p) => {
      const nombre    = p.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const marca     = p.marca.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const categoria = p.categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return nombre.includes(q) || marca.includes(q) || categoria.includes(q);
    });
    setResultados(filtrados.slice(0, 8));
  }, [query, allProducts]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") cerrarBuscador(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function cerrarBuscador() {
    setSearchOpen(false);
    setQuery("");
    setResultados([]);
  }

  function handleProductoClick(slug: string) {
    cerrarBuscador();
    navigate(`/producto/${slug}`);
  }

  function handleVerTodos(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    cerrarBuscador();
    navigate(`/catalogo?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <nav className="container flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0" onClick={() => setMobileOpen(false)} aria-label="Villalobos Western Hats">
            <VillalobosLogo className="h-10 md:h-12 w-auto text-primary" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className={`font-body text-sm tracking-wide uppercase transition-colors hover:text-accent ${
                  location.pathname === link.path ? "text-accent font-semibold" : "text-foreground"
                }`}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Derecha */}
          <div className="flex items-center gap-3 md:gap-4">

            {/* Búsqueda */}
            <button onClick={() => setSearchOpen(true)} className="text-foreground hover:text-accent transition-colors" aria-label="Buscar">
              <Search size={20} />
            </button>

            {/* Carrito */}
            <Link to="/carrito" className="relative text-foreground hover:text-accent transition-colors">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-body font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Idioma */}
            <div className="flex items-center gap-1 font-body text-sm">
              <button onClick={() => setLang("es")} className={`px-1.5 py-0.5 rounded transition-colors ${lang === "es" ? "text-accent font-bold border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"}`}>ES</button>
              <span className="text-muted-foreground">/</span>
              <button onClick={() => setLang("en")} className={`px-1.5 py-0.5 rounded transition-colors ${lang === "en" ? "text-accent font-bold border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"}`}>EN</button>
            </div>

            {/* Hamburguesa */}
            <button
              className="lg:hidden text-foreground hover:text-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ══════════════ MENÚ MÓVIL — Drawer lateral derecho ══════════════ */}
      {mobileOpen && (
        <>
          {/* Overlay oscuro */}
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel lateral */}
          <div className="lg:hidden fixed top-0 right-0 h-full w-[280px] bg-primary z-50 flex flex-col shadow-2xl"
            style={{ animation: 'slideInRight 0.25s ease-out' }}
          >
            {/* Header del drawer */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <VillalobosLogo className="h-8 w-auto text-background" />
              <button
                onClick={() => setMobileOpen(false)}
                className="text-background/70 hover:text-background transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Links de navegación */}
            <nav className="flex-1 flex flex-col px-4 py-6 gap-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3.5 rounded-lg font-body text-sm tracking-widest uppercase transition-all ${
                    location.pathname === link.path
                      ? "bg-white/15 text-background font-semibold"
                      : "text-background/75 hover:bg-white/10 hover:text-background"
                  }`}
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            {/* Footer del drawer — idioma */}
            <div className="px-6 py-5 border-t border-white/10">
              <p className="text-background/40 text-xs uppercase tracking-widest mb-3 font-body">Idioma</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setLang("es")}
                  className={`flex-1 py-2 rounded-lg font-body text-sm font-medium transition-all ${
                    lang === "es"
                      ? "bg-background text-primary"
                      : "bg-white/10 text-background/70 hover:bg-white/20 hover:text-background"
                  }`}
                >
                  Español
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`flex-1 py-2 rounded-lg font-body text-sm font-medium transition-all ${
                    lang === "en"
                      ? "bg-background text-primary"
                      : "bg-white/10 text-background/70 hover:bg-white/20 hover:text-background"
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════ MODAL BUSCADOR ══════════════ */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">

          {/* Fondo oscuro */}
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={cerrarBuscador} />

          {/* Panel */}
          <div className="relative w-full max-w-xl bg-background rounded-xl shadow-2xl overflow-hidden animate-[fade-up_0.2s_ease-out]">

            {/* Input */}
            <form onSubmit={handleVerTodos} className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Search size={18} className="text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, marca o tipo..."
                className="flex-1 bg-transparent font-body text-base text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button type="button" onClick={cerrarBuscador} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </form>

            {/* Resultados */}
            <div className="max-h-[60vh] overflow-y-auto">
              {cargando && (
                <p className="font-body text-sm text-muted-foreground text-center py-8">Cargando productos...</p>
              )}
              {!cargando && !query.trim() && (
                <p className="font-body text-sm text-muted-foreground text-center py-10">Escribe para buscar sombreros... 🤠</p>
              )}
              {!cargando && query.trim() && resultados.length === 0 && (
                <p className="font-body text-sm text-muted-foreground text-center py-10">
                  Sin resultados para <strong>"{query}"</strong>
                </p>
              )}
              {!cargando && resultados.length > 0 && (
                <ul>
                  {resultados.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => handleProductoClick(p.slug)}
                        className="w-full flex items-center gap-4 px-5 py-3 hover:bg-card transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                          <img
                            src={p.imagen_principal || `https://placehold.co/48x48/4A3728/F5EFE0?text=🤠`}
                            alt={p.nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-semibold text-sm text-foreground truncate">{p.nombre}</p>
                          <p className="font-body text-xs text-muted-foreground">{p.marca} · {p.categoria}</p>
                        </div>
                        <p className="font-body text-sm font-semibold text-primary shrink-0">
                          ${p.precio.toLocaleString("es-MX")} MXN
                        </p>
                      </button>
                    </li>
                  ))}
                  <li className="border-t border-border">
                    <button onClick={handleVerTodos} className="w-full py-3 font-body text-sm text-accent hover:text-accent/80 transition-colors font-medium">
                      Ver todos los resultados para "{query}" →
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animación del drawer */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Navbar;