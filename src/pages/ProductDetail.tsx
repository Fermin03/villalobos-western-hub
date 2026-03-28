/**
 * PRODUCTO INDIVIDUAL — Galería, detalle, acordeón, productos relacionados.
 */
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Package, CheckCircle, CreditCard, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { getProductBySlug, getProducts, type Product } from "@/data/products";

const ProductDetail = () => {
  const { t, lang } = useLanguage();
  const { slug } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mainImage, setMainImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [agregado, setAgregado] = useState(false);
  const [errorTalla, setErrorTalla] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setCargando(true);
    getProductBySlug(slug).then((prod) => {
      setProduct(prod);
      setSelectedSize(""); // Resetear talla al cambiar producto
      getProducts().then((todos) => {
        setRelated(todos.filter((p) => p.slug !== slug).slice(0, 4));
      });
      setCargando(false);
    });
  }, [slug]);

  if (cargando) {
    return (
      <div className="container py-20 text-center">
        <p className="font-body text-muted-foreground">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Link to="/catalogo" className="font-body text-accent hover:underline">Ver catálogo</Link>
      </div>
    );
  }

  const images = product.imagenes?.length ? product.imagenes : [product.imagen_principal];

  const accordionItems = [
    {
      key: "description",
      label: t("product.description"),
      content: product.descripcion || "",
    },
    {
      key: "sizeguide",
      label: t("product.sizeguide"),
      content: lang === "es"
        ? "Mide la circunferencia de tu cabeza a la altura de la frente. Talla 56 = 56cm, Talla 57 = 57cm, etc."
        : "Measure the circumference of your head at forehead height. Size 56 = 56cm, Size 57 = 57cm, etc.",
    },
    {
      key: "shippingpolicy",
      label: t("product.shippingpolicy"),
      content: lang === "es"
        ? "Envío gratis en compras mayores a $1,500 MXN dentro de México. Envíos internacionales a EUA (7-12 días) y Canadá (10-15 días)."
        : "Free shipping on orders over $1,500 MXN within Mexico. International shipping to USA (7-12 days) and Canada (10-15 days).",
    },
  ];

  const handleAdd = () => {
    // Validar que se haya seleccionado una talla si el producto tiene tallas
    if (product.tallas?.length > 0 && !selectedSize) {
      setErrorTalla(true);
      setTimeout(() => setErrorTalla(false), 3000);
      return;
    }

    addItem({
      id: String(product.id),
      name: product.nombre,
      brand: product.marca,
      price: product.precio,
      size: selectedSize || "Única",
      quantity: 1,
      image: product.imagen_principal,
    });

    // Animación de confirmación
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  const isOwn = product.marca === "Villalobos Hats";

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="font-body text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">{t("product.breadcrumb.home")}</Link>
        <span className="mx-2">/</span>
        <Link to="/catalogo" className="hover:text-foreground">{t("product.breadcrumb.hats")}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.nombre}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

        {/* Galería */}
        <div>
          <div className="relative aspect-square bg-card rounded-lg overflow-hidden mb-4">
            <img
              src={images[mainImage] || product.imagen_principal}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`aspect-square rounded overflow-hidden border-2 transition-colors ${
                    mainImage === i ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalles */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-body font-medium text-accent">{product.marca}</span>
            <span className={`text-xs font-body font-semibold px-2 py-0.5 rounded ${
              isOwn ? "bg-gold text-gold-foreground" : "bg-accent text-accent-foreground"
            }`}>
              {t(isOwn ? "badge.own" : "badge.dealer")}
            </span>
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold mb-4">{product.nombre}</h1>
          <p className="font-body text-2xl font-semibold text-primary mb-6">
            ${product.precio.toLocaleString()} MXN
          </p>

          {product.descripcion && (
            <p className="font-body text-muted-foreground mb-6">{product.descripcion}</p>
          )}

          {/* Selector de tallas */}
          {product.tallas?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-sm font-semibold">
                  {t("product.size")}
                  {selectedSize && (
                    <span className="ml-2 text-accent font-bold">— {selectedSize}</span>
                  )}
                </p>
                <button
                  onClick={() => setOpenAccordion(openAccordion === "sizeguide" ? null : "sizeguide")}
                  className="font-body text-xs text-muted-foreground hover:text-accent transition-colors underline"
                >
                  Guía de tallas
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.tallas.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSize(s);
                      setErrorTalla(false);
                    }}
                    className={`w-12 h-12 rounded font-body text-sm font-medium border-2 transition-all hover:scale-105 ${
                      selectedSize === s
                        ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                        : errorTalla
                        ? "border-red-400 text-red-500 animate-pulse"
                        : "border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Mensaje de error si no selecciona talla */}
              {errorTalla && (
                <p className="font-body text-xs text-red-500 mt-2 animate-pulse">
                  ⚠️ Por favor selecciona una talla antes de agregar al carrito
                </p>
              )}
            </div>
          )}

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAdd}
            className={`w-full py-3.5 font-body font-medium text-sm rounded mb-3 transition-all ${
              agregado
                ? "bg-green-600 text-white"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {agregado ? "✅ ¡Agregado al carrito!" : t("product.addtocart")}
          </button>

          <button className="w-full py-3.5 border-2 border-primary text-primary font-body font-medium text-sm rounded hover:bg-primary hover:text-primary-foreground transition-colors">
            {t("product.buynow")}
          </button>

          {/* Trust badges */}
          <div className="flex items-center gap-6 mt-6 py-4 border-t border-border flex-wrap">
            <div className="flex items-center gap-2 font-body text-xs text-muted-foreground">
              <Package size={16} /> {t("product.freeshipping")}
            </div>
            <div className="flex items-center gap-2 font-body text-xs text-muted-foreground">
              <CheckCircle size={16} /> {t("product.official")}
            </div>
            <div className="flex items-center gap-2 font-body text-xs text-muted-foreground">
              <CreditCard size={16} /> {t("product.secure")}
            </div>
          </div>

          {/* Acordeón */}
          <div className="mt-6 border-t border-border">
            {accordionItems.map((item) => (
              <div key={item.key} className="border-b border-border">
                <button
                  onClick={() => setOpenAccordion(openAccordion === item.key ? null : item.key)}
                  className="w-full flex items-center justify-between py-4 font-body text-sm font-medium"
                >
                  {item.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${openAccordion === item.key ? "rotate-180" : ""}`}
                  />
                </button>
                {openAccordion === item.key && (
                  <div className="pb-4 font-body text-sm text-muted-foreground">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-8">{t("product.related")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link key={p.id} to={`/producto/${p.slug}`} className="group block">
                <div className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={p.imagen_principal} alt={p.nombre} className="w-full aspect-square object-cover" />
                  <div className="p-4">
                    <p className="font-body text-xs text-accent">{p.marca}</p>
                    <h3 className="font-display text-base mt-1">{p.nombre}</h3>
                    <p className="font-body text-sm font-semibold text-primary mt-1">
                      ${p.precio.toLocaleString()} MXN
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;