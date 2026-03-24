/**
 * NAVBAR STICKY — Logo, links de navegación, búsqueda, carrito, toggle ES/EN.
 * Responsivo con menú hamburguesa móvil fullscreen.
 */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { key: "nav.home", path: "/" },
  { key: "nav.hats", path: "/catalogo" },
  { key: "nav.brands", path: "/marcas" },
  { key: "nav.wholesale", path: "/mayoreo" },
  { key: "nav.shipping", path: "/envios" },
  { key: "nav.contact", path: "/contacto" },
];

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();
  const { itemCount } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo / Wordmark */}
        <Link to="/" className="flex flex-col items-center leading-none gap-0" onClick={() => setMobileOpen(false)}>
          <span className="text-xs tracking-[0.3em] font-body text-muted-foreground">⌂</span>
          <span className="font-display text-xl md:text-2xl font-bold text-primary tracking-wide italic">Villalobos</span>
          <span className="text-[9px] tracking-[0.35em] uppercase font-body text-muted-foreground -mt-0.5">Western</span>
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

        {/* Right: Search, Cart, Language Toggle, Mobile Menu */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search */}
          <button className="text-foreground hover:text-accent transition-colors" aria-label={t("nav.search")}>
            <Search size={20} />
          </button>

          {/* Cart */}
          <Link to="/carrito" className="relative text-foreground hover:text-accent transition-colors">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-body font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 font-body text-sm">
            <button
              onClick={() => setLang("es")}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                lang === "es" ? "text-accent font-bold border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ES
            </button>
            <span className="text-muted-foreground">/</span>
            <button
              onClick={() => setLang("en")}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                lang === "en" ? "text-accent font-bold border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-foreground hover:text-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[calc(4rem+1px)] bg-background z-40 flex flex-col items-center justify-center gap-8 animate-[fade-up_0.3s_ease-out]">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`font-display text-2xl tracking-wide transition-colors ${
                location.pathname === link.path ? "text-accent" : "text-foreground"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
