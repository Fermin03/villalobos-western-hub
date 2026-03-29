/**
 * HOMEPAGE — Hero, trust bar, brands, categories, featured products,
 * best sellers, por marca, testimonios, about, wholesale banner.
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import ProductCard from "@/components/ProductCard";
import { getPlaceholderImage, getProducts, Product } from "@/data/products";
import { Package, CreditCard, CheckCircle, Star, TruckIcon, ShieldCheck, ArrowRight } from "lucide-react";

const Index = () => {
  const { t, lang } = useLanguage();
  const fadeRef = useFadeInOnScroll();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    getProducts()
      .then((productos) => setAllProducts(productos))
      .catch((err) => console.error("Error al cargar productos:", err))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Separar productos por marca
  const featured     = allProducts.filter(p => p.destacado).slice(0, 8);
  const domador      = allProducts.filter(p => p.marca === 'Domador').slice(0, 4);
  const rocha        = allProducts.filter(p => p.marca === 'Rocha Hats').slice(0, 4);
  const villalobos   = allProducts.filter(p => p.marca === 'Villalobos Hats').slice(0, 4);
  const todosProductos = allProducts.slice(0, 8);

  const brands = [
    { key: "domador",    badge: "badge.dealer", badgeColor: "bg-accent text-accent-foreground" },
    { key: "rocha",      badge: "badge.dealer", badgeColor: "bg-accent text-accent-foreground" },
    { key: "villalobos", badge: "badge.own",    badgeColor: "bg-gold text-gold-foreground" },
  ];

  const categories = [
    { key: "texanas", img: getPlaceholderImage(0) },
    { key: "fieltro",  img: getPlaceholderImage(1) },
    { key: "palma",    img: getPlaceholderImage(2) },
    { key: "paja",     img: getPlaceholderImage(3) },
  ];

  const testimonios = [
    { nombre: "Carlos M.", ciudad: "Monterrey, MX", texto: "Excelente calidad, el sombrero llegó perfectamente empacado. Sin duda el mejor distribuidor.", estrellas: 5 },
    { nombre: "Jose R.",   ciudad: "Dallas, TX",    texto: "Muy buena atención y envío rápido a Estados Unidos. Recomendado al 100%.", estrellas: 5 },
    { nombre: "Miguel A.", ciudad: "Guadalajara, MX", texto: "Los sombreros Domador son increíbles. Volveré a comprar pronto.", estrellas: 5 },
  ];

  // Skeleton de carga
  const SkeletonGrid = ({ count = 4 }: { count?: number }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg bg-card animate-pulse">
          <div className="aspect-[3/4] bg-muted rounded-t-lg" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  const SeccionProductos = ({ productos, titulo, subtitulo, verTodosLink = "/catalogo" }: {
    productos: Product[];
    titulo: string;
    subtitulo?: string;
    verTodosLink?: string;
  }) => {
    if (loadingProducts) return <SkeletonGrid />;
    if (productos.length === 0) return null;
    return (
      <div>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">{titulo}</h2>
            {subtitulo && <p className="font-body text-muted-foreground mt-1">{subtitulo}</p>}
          </div>
          <Link to={verTodosLink} className="font-body text-sm text-accent hover:underline flex items-center gap-1">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productos.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={fadeRef}>

      {/* ══════════════ HERO ══════════════ */}
      <section className="min-h-[90vh] md:min-h-screen flex flex-col md:flex-row">
        <div className="relative w-full md:w-[55%] min-h-[50vh] md:min-h-full grain-overlay">
          <img
            src={getPlaceholderImage(0)}
            alt="Villalobos Western Hats"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-[45%] flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 md:py-0">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-4">{t("hero.label")}</span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
            {t("hero.title")}
          </h1>
          <p className="font-body text-base text-muted-foreground mb-8 max-w-md">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/catalogo" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-body font-medium text-sm tracking-wide rounded hover:opacity-90 transition-opacity">
              {t("hero.cta.catalog")}
            </Link>
            <Link to="/mayoreo" className="inline-flex items-center justify-center px-8 py-3 border-2 border-accent text-accent font-body font-medium text-sm tracking-wide rounded hover:bg-accent hover:text-accent-foreground transition-colors">
              {t("hero.cta.wholesale")}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ MARQUEE ══════════════ */}
      <div className="bg-primary text-primary-foreground py-3 overflow-hidden">
        <div className="marquee-track whitespace-nowrap">
          {[0, 1].map((i) => (
            <span key={i} className="font-body text-sm tracking-[0.2em] uppercase mx-4">
              TEXANAS · FIELTRO · PALMA · PAJA · DOMADOR · ROCHA HATS · VILLALOBOS HATS · DISTRIBUIDOR OFICIAL · AUTHORIZED DEALER ·{" "}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════ TRUST BAR ══════════════ */}
      <section className="py-8 border-b border-border fade-in-section">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck size={28} className="text-accent" />
              <p className="font-body text-sm font-semibold">{t("trust.brands")}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <TruckIcon size={28} className="text-accent" />
              <p className="font-body text-sm font-semibold">{t("trust.shipping")}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <CheckCircle size={28} className="text-accent" />
              <p className="font-body text-sm font-semibold">{t("trust.dealer")}</p>
              <p className="font-body text-xs text-muted-foreground">{t("trust.dealer.brands")}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <CreditCard size={28} className="text-accent" />
              <p className="font-body text-sm font-semibold">{t("trust.payment")}</p>
              <p className="font-body text-xs text-muted-foreground">{t("trust.payment.methods")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ PRODUCTOS DESTACADOS ══════════════ */}
      <section className="py-16 md:py-20 fade-in-section">
        <div className="container">
          <SeccionProductos
            productos={featured.length > 0 ? featured : todosProductos}
            titulo={t("featured.title")}
            subtitulo="Los sombreros más populares de nuestra colección"
          />
        </div>
      </section>

      {/* ══════════════ BANNER INTERMEDIO — OFERTA ══════════════ */}
      <section className="py-12 bg-accent/10 fade-in-section">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card rounded-2xl p-8 border border-accent/20">
            <div>
              <span className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-2 block">Envío gratis</span>
              <h3 className="font-display text-2xl font-bold mb-2">En compras mayores a $1,500 MXN</h3>
              <p className="font-body text-muted-foreground">Solo válido para envíos dentro de México. Recibe tu sombrero en la puerta de tu casa.</p>
            </div>
            <Link to="/catalogo" className="shrink-0 inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-body font-medium text-sm rounded hover:opacity-90 transition-opacity">
              Ver catálogo completo
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ BRANDS SECTION ══════════════ */}
      <section className="py-16 md:py-20 fade-in-section">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-4">{t("brands.title")}</h2>
          <p className="font-body text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Distribuidor oficial de las mejores marcas western de México
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {brands.map((b) => (
              <Link key={b.key} to="/marcas" className="group bg-card rounded-lg p-8 text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-3xl">🤠</span>
                </div>
                <h3 className="font-display text-xl mb-2">{t(`brand.${b.key}.name`)}</h3>
                <p className="font-body text-sm text-muted-foreground mb-3">{t(`brand.${b.key}.desc`)}</p>
                <span className={`inline-block text-xs font-body font-semibold px-3 py-1 rounded ${b.badgeColor}`}>
                  {t(b.badge)}
                </span>
                <p className="font-body text-sm text-accent mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("brands.shop")} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ DOMADOR ══════════════ */}
      {domador.length > 0 && (
        <section className="py-16 md:py-20 bg-card/50 fade-in-section">
          <div className="container">
            <SeccionProductos
              productos={domador}
              titulo="Sombreros Domador"
              subtitulo="Tradición y calidad en cada sombrero"
              verTodosLink="/catalogo?marca=Domador"
            />
          </div>
        </section>
      )}

      {/* ══════════════ CATEGORIES ══════════════ */}
      <section className="py-16 md:py-20 fade-in-section">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-4">{t("categories.title")}</h2>
          <p className="font-body text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Encuentra el estilo que mejor te represente
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.key} to="/catalogo" className="group relative aspect-[3/4] rounded-lg overflow-hidden">
                <img src={cat.img} alt={t(`cat.${cat.key}`)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-lg text-background">{t(`cat.${cat.key}`)}</h3>
                  <span className="font-body text-xs text-background/80">{t("categories.shop")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ ROCHA HATS ══════════════ */}
      {rocha.length > 0 && (
        <section className="py-16 md:py-20 bg-card/50 fade-in-section">
          <div className="container">
            <SeccionProductos
              productos={rocha}
              titulo="Rocha Hats"
              subtitulo="Estilo y elegancia western"
              verTodosLink="/catalogo?marca=Rocha+Hats"
            />
          </div>
        </section>
      )}

      {/* ══════════════ BANNER MAYOREO ══════════════ */}
      <section className="py-16 md:py-20 fade-in-section" style={{ background: 'linear-gradient(135deg, #4A3728 0%, #2C1E12 100%)' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-3 block">Para revendedores</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                Precios especiales para mayoreo
              </h2>
              <p className="font-body text-white/70 mb-6">
                Descuentos desde el 10% hasta el 25% en compras de volumen. Atendemos tiendas, boutiques y distribuidores en México, EUA y Canadá.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { piezas: '10-25', descuento: '10%' },
                  { piezas: '26-50', descuento: '15%' },
                  { piezas: '51-100', descuento: '20%' },
                  { piezas: '100+', descuento: '25%' },
                ].map((item) => (
                  <div key={item.piezas} className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="font-body text-white/70 text-xs">{item.piezas} piezas</p>
                    <p className="font-display text-2xl font-bold text-accent">{item.descuento}</p>
                  </div>
                ))}
              </div>
              <Link to="/mayoreo" className="inline-flex items-center justify-center px-8 py-3 bg-accent text-accent-foreground font-body font-medium text-sm rounded hover:opacity-90 transition-opacity">
                Solicitar precio de mayoreo
              </Link>
            </div>
            <div className="hidden md:block">
              <img src={getPlaceholderImage(6)} alt="Mayoreo" className="rounded-xl w-full aspect-square object-cover opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ VILLALOBOS HATS ══════════════ */}
      {villalobos.length > 0 && (
        <section className="py-16 md:py-20 fade-in-section">
          <div className="container">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block text-xs font-body font-semibold px-3 py-1 rounded bg-gold text-gold-foreground">
                Marca Propia
              </span>
            </div>
            <SeccionProductos
              productos={villalobos}
              titulo="Villalobos Hats"
              subtitulo="Nuestra marca exclusiva — calidad garantizada"
              verTodosLink="/catalogo?marca=Villalobos+Hats"
            />
          </div>
        </section>
      )}

      {/* ══════════════ TESTIMONIOS ══════════════ */}
      <section className="py-16 md:py-20 bg-card/50 fade-in-section">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-4">Lo que dicen nuestros clientes</h2>
          <p className="font-body text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Miles de clientes satisfechos en México, EUA y Canadá
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonios.map((t, i) => (
              <div key={i} className="bg-background rounded-xl p-6 border border-border">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.estrellas }).map((_, j) => (
                    <Star key={j} size={16} className="text-accent fill-accent" />
                  ))}
                </div>
                <p className="font-body text-sm text-muted-foreground mb-4 italic">"{t.texto}"</p>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{t.nombre}</p>
                  <p className="font-body text-xs text-muted-foreground">{t.ciudad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ ABOUT SECTION ══════════════ */}
      <section className="py-16 md:py-20 fade-in-section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <img src={getPlaceholderImage(5)} alt="Villalobos Western Hats" className="rounded-lg w-full aspect-[3/4] object-cover" />
            <div>
              <span className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-3 block">{t("about.label")}</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">{t("about.title")}</h2>
              <p className="font-body text-muted-foreground mb-4">{t("about.p1")}</p>
              <p className="font-body text-muted-foreground mb-6">{t("about.p2")}</p>
              <Link to="/nosotros" className="font-body text-accent font-medium hover:underline">
                {t("about.cta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ WHOLESALE BANNER ══════════════ */}
      <section className="py-16 md:py-20 bg-primary diagonal-lines fade-in-section">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                {t("wholesale.banner.title")}
              </h2>
              <p className="font-body text-primary-foreground/80 max-w-lg">
                {t("wholesale.banner.text")}
              </p>
            </div>
            <Link to="/mayoreo" className="inline-flex items-center justify-center px-8 py-3 bg-accent text-accent-foreground font-body font-medium text-sm tracking-wide rounded hover:opacity-90 transition-opacity shrink-0">
              {t("wholesale.banner.cta")}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;