/**
 * PRODUCTO INDIVIDUAL — Galería, detalle, acordeón, productos relacionados.
 */
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Package, CheckCircle, CreditCard, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { products, getPlaceholderImages } from "@/data/products";

const ProductDetail = () => {
  const { t, lang } = useLanguage();
  const { slug } = useParams();
  const { addItem } = useCart();

  const product = products.find((p) => p.id === slug) || products[0];
  const images = getPlaceholderImages(products.indexOf(product));
  const [mainImage, setMainImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] || product.sizes[0]);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const related = products.filter((p) => p.id !== product.id && p.type === product.type).slice(0, 4);
  const isOwn = product.brand === "Villalobos Hats";

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name[lang], brand: product.brand, price: product.price, size: selectedSize, quantity: 1, image: images[0] });
  };

  const accordionItems = [
    { key: "description", label: t("product.description"), content: product.description[lang] },
    { key: "materials", label: t("product.materials"), content: product.materials[lang] },
    {
      key: "sizeguide",
      label: t("product.sizeguide"),
      content: lang === "es"
        ? "Mide la circunferencia de tu cabeza a la altura de la frente con una cinta métrica. Talla 56 = 56cm, Talla 57 = 57cm, etc."
        : "Measure the circumference of your head at forehead height with a measuring tape. Size 56 = 56cm, Size 57 = 57cm, etc.",
    },
    {
      key: "shippingpolicy",
      label: t("product.shippingpolicy"),
      content: lang === "es"
        ? "Envío gratis en compras mayores a $1,500 MXN dentro de México. Envíos internacionales a EUA (7-12 días) y Canadá (10-15 días)."
        : "Free shipping on orders over $1,500 MXN within Mexico. International shipping to USA (7-12 days) and Canada (10-15 days).",
    },
  ];

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="font-body text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">{t("product.breadcrumb.home")}</Link>
        <span className="mx-2">/</span>
        <Link to="/catalogo" className="hover:text-foreground">{t("product.breadcrumb.hats")}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name[lang]}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left — Gallery */}
        <div>
          <div className="relative aspect-square bg-card rounded-lg overflow-hidden mb-4">
            <img src={images[mainImage]} alt={product.name[lang]} className="w-full h-full object-cover" />
            {product.badge && (
              <span className={`absolute top-4 left-4 text-xs font-body font-semibold px-3 py-1 rounded ${
                product.badge === "premium" ? "bg-gold text-gold-foreground" : "bg-accent text-accent-foreground"
              }`}>
                {t(product.badge === "premium" ? "product.premium" : "product.new")}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[...images, images[0]].slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(i % images.length)}
                className={`aspect-square rounded overflow-hidden border-2 transition-colors ${
                  mainImage === i % images.length ? "border-primary" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right — Details */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-body font-medium text-accent">{product.brand}</span>
            <span className={`text-xs font-body font-semibold px-2 py-0.5 rounded ${
              isOwn ? "bg-gold text-gold-foreground" : "bg-accent text-accent-foreground"
            }`}>
              {t(isOwn ? "badge.own" : "badge.dealer")}
            </span>
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold mb-4">{product.name[lang]}</h1>
          <p className="font-body text-2xl font-semibold text-primary mb-6">${product.price.toLocaleString()} MXN</p>
          <p className="font-body text-muted-foreground mb-6">{product.description[lang]}</p>

          {/* Size Selector */}
          <div className="mb-6">
            <p className="font-body text-sm font-semibold mb-3">{t("product.size")}</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-12 h-12 rounded font-body text-sm border-2 transition-colors ${
                    selectedSize === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <button
            onClick={handleAdd}
            className="w-full py-3.5 bg-primary text-primary-foreground font-body font-medium text-sm rounded mb-3 hover:opacity-90 transition-opacity"
          >
            {t("product.addtocart")}
          </button>
          <button className="w-full py-3.5 border-2 border-primary text-primary font-body font-medium text-sm rounded hover:bg-primary hover:text-primary-foreground transition-colors">
            {t("product.buynow")}
          </button>

          {/* Trust Icons */}
          <div className="flex items-center gap-6 mt-6 py-4 border-t border-border">
            <div className="flex items-center gap-2 font-body text-xs text-muted-foreground"><Package size={16} /> {t("product.freeshipping")}</div>
            <div className="flex items-center gap-2 font-body text-xs text-muted-foreground"><CheckCircle size={16} /> {t("product.official")}</div>
            <div className="flex items-center gap-2 font-body text-xs text-muted-foreground"><CreditCard size={16} /> {t("product.secure")}</div>
          </div>

          {/* Accordion */}
          <div className="mt-6 border-t border-border">
            {accordionItems.map((item) => (
              <div key={item.key} className="border-b border-border">
                <button
                  onClick={() => setOpenAccordion(openAccordion === item.key ? null : item.key)}
                  className="w-full flex items-center justify-between py-4 font-body text-sm font-medium"
                >
                  {item.label}
                  <ChevronDown size={16} className={`transition-transform ${openAccordion === item.key ? "rotate-180" : ""}`} />
                </button>
                {openAccordion === item.key && (
                  <div className="pb-4 font-body text-sm text-muted-foreground animate-[fade-up_0.2s_ease-out]">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-8">{t("product.related")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={products.indexOf(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
