/**
 * PÁGINA DE MARCAS — Secciones para cada marca con badges y formulario de notificación.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPlaceholderImage } from "@/data/products";

const brandsData = [
  { key: "domador", badge: "badge.dealer", badgeColor: "bg-accent text-accent-foreground", seed: 10 },
  { key: "rocha", badge: "badge.dealer", badgeColor: "bg-accent text-accent-foreground", seed: 11 },
  { key: "villalobos", badge: "badge.own", badgeColor: "bg-gold text-gold-foreground", seed: 12 },
];

const brandDescriptions: Record<string, Record<"es" | "en", string>> = {
  domador: {
    es: "Domador es una marca líder en sombreros western con décadas de tradición. Sus diseños combinan la artesanía clásica con materiales de primera calidad, creando piezas que resisten el paso del tiempo. Como distribuidores oficiales, ofrecemos su catálogo completo con garantía de autenticidad.",
    en: "Domador is a leading western hat brand with decades of tradition. Their designs combine classic craftsmanship with premium materials, creating pieces that stand the test of time. As authorized dealers, we offer their complete catalog with authenticity guarantee.",
  },
  rocha: {
    es: "Rocha Hats representa la evolución moderna del sombrero western. Con diseños innovadores que respetan las raíces de la tradición, cada sombrero Rocha es una declaración de estilo. Somos distribuidores autorizados con acceso a sus colecciones más exclusivas.",
    en: "Rocha Hats represents the modern evolution of the western hat. With innovative designs that respect traditional roots, every Rocha hat is a style statement. We are authorized distributors with access to their most exclusive collections.",
  },
  villalobos: {
    es: "Villalobos Hats es nuestra marca propia, nacida de la pasión por crear sombreros western excepcionales. Cada pieza es diseñada con atención al detalle, materiales premium y acabados exclusivos que no encontrarás en ningún otro lugar.",
    en: "Villalobos Hats is our own brand, born from a passion for creating exceptional western hats. Each piece is designed with attention to detail, premium materials and exclusive finishes you won't find anywhere else.",
  },
};

const Brands = () => {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState("");

  return (
    <div>
      {/* Header */}
      <section className="py-16 text-center">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{t("brands.page.title")}</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">{t("brands.page.subtitle")}</p>
        </div>
      </section>

      {/* Brand Sections */}
      {brandsData.map((brand, i) => (
        <section key={brand.key} className={`py-16 ${i % 2 === 1 ? "bg-card/50" : ""}`}>
          <div className="container">
            {/* Full-width image with overlay */}
            <div className="relative rounded-lg overflow-hidden mb-8 aspect-[21/9]">
              <img
                src={getPlaceholderImage(1400, 600, brand.key, brand.seed)}
                alt={t(`brand.${brand.key}.name`)}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl mb-3 block">🤠</span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-background">{t(`brand.${brand.key}.name`)}</h2>
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto text-center">
              <p className="font-body text-muted-foreground mb-4">{brandDescriptions[brand.key][lang]}</p>
              <span className={`inline-block text-xs font-body font-semibold px-4 py-1.5 rounded mb-6 ${brand.badgeColor}`}>
                {t(brand.badge)}
              </span>
              <br />
              <Link
                to="/catalogo"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-body font-medium text-sm rounded hover:opacity-90 transition-opacity"
              >
                {t("brands.shop")}
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* Coming Soon Banner */}
      <section className="py-16 bg-card">
        <div className="container text-center max-w-lg mx-auto">
          <h3 className="font-display text-xl mb-4">{t("brands.coming")}</h3>
          <p className="font-body text-sm text-muted-foreground mb-6">{t("brands.notify")}</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@ejemplo.com"
              className="flex-1 px-4 py-2 border border-border rounded font-body text-sm bg-background"
            />
            <button className="px-6 py-2 bg-accent text-accent-foreground font-body text-sm rounded hover:opacity-90 transition-opacity">
              {t("brands.notify.btn")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Brands;
