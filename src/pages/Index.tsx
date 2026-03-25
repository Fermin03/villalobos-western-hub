/**
 * HOMEPAGE — Hero, trust bar, brands, categories, featured products, about, wholesale banner.
 * ✅ CORREGIDO: Productos destacados ahora vienen del backend (MySQL), no de datos estáticos.
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import ProductCard from "@/components/ProductCard";
import { getPlaceholderImage, getProducts, Product } from "@/data/products";
import { Package, CreditCard, CheckCircle } from "lucide-react";

const Index = () => {
  const { t, lang } = useLanguage();
  const fadeRef = useFadeInOnScroll();

  // ── Estado para productos destacados desde el backend ──
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    getProducts()
      .then((productos) => {
        // Mostrar máximo 8 productos destacados
        setFeatured(productos.slice(0, 8));
      })
      .catch((err) => {
        console.error("Error al cargar productos destacados:", err);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  const brands = [
    { key: "domador", badge: "badge.dealer", badgeColor: "bg-accent text-accent-foreground" },
    { key: "rocha", badge: "badge.dealer", badgeColor: "bg-accent text-accent-foreground" },
    { key: "villalobos", badge: "badge.own", badgeColor: "bg-gold text-gold-foreground" },
  ];

  const categories = [
    { key: "texanas", img: getPlaceholderImage(0) },
    { key: "fieltro", img: getPlaceholderImage(1) },
    { key: "palma", img: getPlaceholderImage(2) },
    { key: "paja", img: getPlaceholderImage(3) },
  ];

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
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-body font-medium text-sm tracking-wide rounded hover:opacity-90 transition-opacity"
            >
              {t("hero.cta.catalog")}
            </Link>
            <Link
              to="/mayoreo"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-accent text-accent font-body font-medium text-sm tracking-wide rounded hover:bg-accent hover:text-accent-foreground transition-colors"
            >
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
            <div className="text-center">
              <span className="text-2xl mb-2 block">🤠</span>
              <p className="font-body text-sm font-semibold text-foreground">{t("trust.brands")}</p>
            </div>
            <div className="text-center">
              <span className="text-2xl mb-2 block"><Package className="inline" size={24} /></span>
              <p className="font-body text-sm font-semibold text-foreground">{t("trust.shipping")}</p>
            </div>
            <div className="text-center">
              <span className="text-2xl mb-2 block"><CheckCircle className="inline" size={24} /></span>
              <p className="font-body text-sm font-semibold text-foreground">{t("trust.dealer")}</p>
              <p className="font-body text-xs text-muted-foreground">{t("trust.dealer.brands")}</p>
            </div>
            <div className="text-center">
              <span className="text-2xl mb-2 block"><CreditCard className="inline" size={24} /></span>
              <p className="font-body text-sm font-semibold text-foreground">{t("trust.payment")}</p>
              <p className="font-body text-xs text-muted-foreground">{t("trust.payment.methods")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ BRANDS SECTION ══════════════ */}
      <section className="py-16 md:py-20 fade-in-section">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">{t("brands.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {brands.map((b) => (
              <Link
                key={b.key}
                to="/marcas"
                className="group bg-card rounded-lg p-8 text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]"
              >
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

      {/* ══════════════ CATEGORIES ══════════════ */}
      <section className="py-16 md:py-20 bg-card/50 fade-in-section">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">{t("categories.title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                to="/catalogo"
                className="group relative aspect-[3/4] rounded-lg overflow-hidden"
              >
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

      {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
      <section className="py-16 md:py-20 fade-in-section">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">{t("featured.title")}</h2>

          {/* Loading skeleton */}
          {loadingProducts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg bg-card animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-t-lg" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sin productos */}
          {!loadingProducts && featured.length === 0 && (
            <p className="text-center font-body text-muted-foreground py-12">
              Aún no hay productos disponibles.
            </p>
          )}

          {/* Grid de productos */}
          {!loadingProducts && featured.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ ABOUT SECTION ══════════════ */}
      <section className="py-16 md:py-20 bg-card/50 fade-in-section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <img
              src={getPlaceholderImage(5)}
              alt="Villalobos Western Hats"
              className="rounded-lg w-full aspect-[3/4] object-cover"
            />
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
            <Link
              to="/mayoreo"
              className="inline-flex items-center justify-center px-8 py-3 bg-accent text-accent-foreground font-body font-medium text-sm tracking-wide rounded hover:opacity-90 transition-opacity shrink-0"
            >
              {t("wholesale.banner.cta")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;